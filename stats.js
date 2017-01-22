// var ts = require('text-statistics');
var ts = require('./text-statistics.js')

module.exports = {
	getStats: function(text) {
		return _getStats(text);
	}
};

function _getStats(text) {
    var stats = ts(text);

    return {
        "fkre" : stats.fleschKincaidReadingEase(stats.text),
        "fkgl" : stats.fleschKincaidGradeLevel(stats.text),
        "gfs"  : stats.gunningFogScore(stats.text),
        "cli"  : stats.colemanLiauIndex(stats.text),
        "si"   : stats.smogIndex(stats.text),
        "ari"  : stats.automatedReadabilityIndex(stats.text),

        "textLength" : stats.textLength(stats.text),
        "letterCount" : stats.letterCount(stats.text),
        "sentenceCount" : stats.sentenceCount(stats.text),
        "wordCount" : stats.wordCount(stats.text),
        "averageWordsPerSentence" : stats.averageWordsPerSentence(stats.text),
        "averageSyllablesPerWord" : stats.averageSyllablesPerWord(stats.text),
        "wordsWithOneSyllable" : stats.wordsWithOneSyllable(stats.text),
        "wordsWithTwoSyllables" : stats.wordsWithTwoSyllables(stats.text),
        "wordsWithThreeSyllables" : stats.wordsWithThreeSyllables(stats.text),
        "wordsWithMoreThanThreeSyllables" : stats.wordsWithMoreThanThreeSyllables(stats.text),
        "percentageWordsWithThreeSyllables" : stats.percentageWordsWithThreeSyllables(stats.text),
        "syllableCount" : stats.syllableCount(stats.text)
    };
}
