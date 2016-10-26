'use strict';

var express   = require('express');
var app       = express();
var server    = require('http').createServer(app);
/var io        = require('socket.io').listen(server); //Ta bort listen om detta inte funkar

/**
 *  Allows third party clients to connect to the socket server
 */
app.use(function(request, response, next) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

/**
 *  Server static assets out of the `public` directory
 */
app.use(express.static('public'));

/**
 *  Send the `public/index.html` to the browser
 */
app.get('/', function(req, res){
  res.sendfile('public/index.html');
});

app.get('/favicon.ico', function(req, res){
  res.sendfile('public/index.html');
});

//io.on('connection', function(socket){
//  console.log('a user connected');
//});

/**
 *  Have our server listen on port 8001
 */
var port = 8001;
server.listen(port, function(){
  console.log('Server listening on port %d', port);
});
