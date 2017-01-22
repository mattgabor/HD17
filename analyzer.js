let fs = require('fs');

var frequencyTable = {};
try {
	frequencyTable = JSON.parse(fs.readFileSync('table.json', 'utf8'));
} catch(err) {
	console.error('Failed to load table.json, to generate it run:\nnpm run-script table');
	process.exit(1);
}

var bigramFrequency = frequencyTable.bigrams;
var monogramFrequency = frequencyTable.monograms;

module.exports = {
	analyze: function(text) {
		return _analyze(text);
	}
};


function isBigramChar(c) {
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

function isWhitespaceChar(c) {
	return c == ' ' || c == '\n' || c == '\t';
}

function normalizeText(text) {
	var res = "";
	for(var i = 0; i < text.length; i++) {
		if(isBigramChar(text[i])) {
			res += text[i];
		}
	}
	return res.toLowerCase();
}

class Word {
	constructor(normalizedText, startIndex, endIndex) {
		this.normalizedText = normalizedText;
		this.startIndex = startIndex;
		this.endIndex = endIndex;
		this.logProbability = this.calcLogProbability();
	}

	calcLogProbability() {
		let p = monogramFrequency[this.normalizedText];
		if(p === undefined) {
			console.log("Monogram not found for: " + this.normalizedText);
			return -100;
		} else {
			return p;
		}
	}

	static parseWords(text) {
		if(text.length == 0) {
			return [];
		}

		var words = [];

		var inWord = !isWhitespaceChar(text[0]);
		var startIndex = -1;
		if(inWord) {
			startIndex = 0;
		}

		for(var i = 0; i < text.length; i++) {
			let c = text[i];
			if(!isWhitespaceChar(c) && !inWord) { // Start of a new word.
				startIndex = i;
				inWord = true;
			} else if(isWhitespaceChar(c) && inWord) { // End of the current word.
				let endIndex = i;
				let wordText = text.substring(startIndex, endIndex);
				let norm = normalizeText(wordText);

				words.push(new Word(norm, startIndex, endIndex));
				inWord = false;
			}
		}

		let lastC = text[text.length - 1];
		if(!isWhitespaceChar(lastC) && inWord) { // The last word ends with EOF
			let endIndex = text.length;
			let wordText = text.substring(startIndex, endIndex);
			let norm = normalizeText(wordText);
				
			words.push(new Word(norm, startIndex, endIndex));
		}

		return words;
	}
}

class Bigram {
	constructor(words, startIndex, endIndex) {
		this.words = words;
		this.startIndex = startIndex;
		this.endIndex = endIndex;
		this.logProbability = this.calcLogProbability();

		var sumWords = 0;
		for(var i = 0; i < words.length; i++) {
			sumWords += words[i].logProbability;
		}

		this.normalizedLogProbability = this.logProbability - sumWords;
	}

	calcLogProbability() {
		let wordTexts = this.words.map(function(w) { return w.normalizedText });
		let p = bigramFrequency[wordTexts.join("-")];
		if(p === undefined) {
			console.log("Bigram not found for: " + wordTexts);
			return -100;
		} else {
			return p;
		}
	}

	static parseBigrams(text) {
		if(text.length == 0) {
			return [];
		}

		let words = Word.parseWords(text);
		var bigrams = [];

		for(var i = 0; i < words.length - 1; i++) {
			let w1 = words[i];
			let w2 = words[i + 1];
			let bigram = new Bigram([w1, w2], w1.startIndex, w2.endIndex);
			bigrams.push(bigram);
		}

		return bigrams;
	}
}

function chainLogProbability(bigrams) {
	var sum = 0;

	for(var i = 0; i < bigrams.length; i++) {
		let bigram = bigrams[i];
		sum += bigram.logProbability;
	}

	return sum / bigrams.length;
}


function _analyze(text) {
	let bigrams = Bigram.parseBigrams(text);
	let logProb = chainLogProbability(bigrams);

    return {
    	"overallLogProbability": logProb, 
    	"bigrams": bigrams
    };
}
