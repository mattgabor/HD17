var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('table.db');
var fs = require('fs');

var frequencyTable = {};
try {
	frequencyTable = JSON.parse(fs.readFileSync('table.json', 'utf8'));
} catch(err) {
	console.error(err);
	console.error('Failed to load table.json, to generate it run:\nnpm run-script table');
	process.exit(1);
}

var bigramFrequency = frequencyTable.bigrams;
var monogramFrequency = frequencyTable.monograms;

 
db.serialize(function() {
  db.run("CREATE TABLE monograms (word TEXT, log FLOAT)");
  db.run("CREATE TABLE bigrams (word TEXT, log FLOAT)");

  var len = Object.keys(monogramFrequency).length;
  var i = 0;

  db.run("BEGIN TRANSACTION");

  for (var wordKey in monogramFrequency) {
    if(wordKey.includes("\"")) {
      continue;
    }

    var log = monogramFrequency[wordKey];
    db.run("INSERT INTO monograms VALUES (\"" + wordKey + "\"," + log + ")");

    if (i % 1000 == 0) {
      console.log(i / len);
    }
    i++;
  }
  db.run("COMMIT TRANSACTION");


  len = Object.keys(bigramFrequency).length;
  i = 0;

  db.run("BEGIN TRANSACTION");
  for (var wordKey in bigramFrequency) {
    if(wordKey.includes("\"")) {
      continue;
    }

    var log = bigramFrequency[wordKey];
    db.run("INSERT INTO bigrams VALUES (\"" + wordKey + "\"," + log + ")");

    if (i % 1000 == 0) {
      console.log(i / len);
    }
    i++;
  }
  db.run("COMMIT TRANSACTION");

  console.log("CLOSING")
});
 
db.close();