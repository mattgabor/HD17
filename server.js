var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/analyze', function(req, res) {
  var text = req.body.toAnalyze;
  console.log(text);
  res.send('done');
});

app.use(express.static('./public'));
http.createServer(app).listen(8080);

console.log('Server started on localhost:8080');
