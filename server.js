var http = require('http');
var fs = require('fs');

http.createServer(function(request, response) {
  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];
  request.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk){
    body.push(chunk);
  }).on('end', function() {

    response.on('error', function(err) {
     console.error(err);
   });

   response.statusCode = 200;
   response.setHeader('Content-Type', 'text/html');

   var responseBody = {
     headers: headers,
     method: method,
     url: url,
     body: body
   };
   
   console.log(url);

   var contents = fs.readFileSync('index.html').toString();
   response.write(contents);
   response.end();
 });
}).listen(9000);
