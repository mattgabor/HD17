var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var analyzer = require('./analyzer');
var stats = require('./stats')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/analyze', function(req, res) {
  var text = req.body.toAnalyze;
  var bigramResult = analyzer.analyze(text);
  var statsResult = stats.getStats(text);

  var result = {
    "bigramResult": bigramResult,
    "statsResult": statsResult
  }

  res.type('json');
  res.send(JSON.stringify(result));
});


app.get('/prompt', function(req, res) {
  var difficulty = req.query.difficulty;
  var prompt;

  if (difficulty == "easy") {
    prompt = "Compare your home, village or city to the place you live at now. Describe things that are the same and different."
  } else if (difficulty == "intermediate") {
    prompt = "Do you think it is important for people to continue to travel into space? Why or why not? You may want to think about issues, such as: costs, dangers, rewards."
  } else {
    prompt = "Have North Americans become too dependent on the automobile for travel?"
  }

  res.type('text');
  res.send(prompt);
});

app.use(express.static('./public'));
http.createServer(app).listen(8080);
console.log('Server started on localhost:8080');
