var http = require('http');
var fs = require('fs');
var url = require('url');
var cookieParser = require('cookie-parser')

var portNr = 8001;

var server = http.createServer(function(request, response) {
  console.log(request.method);
  var pathName = request.url;

  console.log("Path requested: "+pathName);

  fs.readFile("website/" + pathName.substr(1), function (err, data) {
    if (err) {
      //console.log(err);
        //HTTP Status 404:File not Found
      response.writeHead(404, {'Content-Type': 'text/html'});
      response.write("Sorry, no such File or directory!");
    }else{

      //console.log(data.toString())
      //HTTP Status 200:OK
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data.toString());
    }
    response.end();

  })




  });


server.listen(portNr);
console.log('Server running at http/::127.0.0.1:'+portNr);
