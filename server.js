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

app.use(express.static('./public'));
http.createServer(app).listen(8080);
console.log('Server started on localhost:8080');
