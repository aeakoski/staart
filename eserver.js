var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var request = require('superagent');
var fs = require('fs');


var clientID = '6ea93f8aa8b00ee5d448',
    clientSecret = '04079fc5158cae176d9f598cc81f153e',
    apiUrl = 'https://api.artsy.net/api/tokens/xapp_token',
    xappToken;

var urlencodedParser = bodyParser.urlencoded({ extended: true })


request
  .post(apiUrl)
  .send({ client_id: clientID, client_secret: clientSecret })
  .end(function(err, res) {
    if(err){
      console.log(err);
    }else {
        xappToken = res.body.token;
        //console.log(xappToken);
    }
  });



app.use(cookieParser());

// set a cookie
//Executes every time a request is made
app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined)
  {
    // no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('artToken',xappToken, { maxAge: 10000, httpOnly: true });
    console.log('cookie created successfully');
  }
  else
  {
    // yes, cookie was already present
    //console.log('cookie exists', cookie);
  }
  next(); // <-- important!
});

app.use(express.static('public'));

app.get('/', function(request, response){
  response.sendFile("index.html");
});

/*

app.get('/process_get', function(request, response){
  query = {
    first_name:request.query.first_name,
    last_name:request.query.last_name
  };

  response.send(JSON.stringify(query));

});
*/

/*
app.post('/process_post', urlencodedParser, function(request, response){
  console.log(request.query.first_name);
  console.log(request);

  query = {
    first_name:request.body.first_name,
    last_name:request.body.last_name
  };

  response.send(JSON.stringify(query));

});
*/

var portNr = 8001;

var server = app.listen(portNr, function(){
  console.log("Server on port: " + server.address().port);

});
