var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('superagent');


var clientID = '6ea93f8aa8b00ee5d448',
    clientSecret = '04079fc5158cae176d9f598cc81f153e',
    apiUrl = 'https://api.artsy.net/api/tokens/xapp_token',
    xappToken;

var paintingJSON={};

var fetchPainting = function(token, call){
  //example request call /artists/andy-warhol
  //https://api.artsy.net/api/artworks?gene_id=4e5e41670d2c670001030350
  request
    .get('https://api.artsy.net/api/'+call)
    .set('x-xapp-token', token)
    .set('Accept', 'application/json')
    .end(function(err, res){
      if (err) {
        console.log(err.error);

      }else{
        console.log(res.body);
        paintingJSON =  res.body;
      }


    });
}

request
  .post(apiUrl)
  .send({ client_id: clientID, client_secret: clientSecret })
  .end(function(err, res) {
    if(err){
      console.log(err);
    }else {

       /*

       Passing in a parameter of "sample" will redirect you to the
       canonical URL for a random element in the collection.
       It can be combo'ed with additional filter parameters, so one
       could query for a random upcoming show with:
       "https://api.artsy.net/api/shows?status=upcoming&sample=1"

       */

       /*
       Sizes suported by the API:

       //TODO Mke the function automaticly select the largest paintings avalible


       featured
       general
       large
       larger
       medium
       square
       tall

       */

       fetchPainting(res.body.token, "shows?sample=1");

        xappToken = res.body.token;
        //console.log(xappToken);
    }
});

// set a cookie
//Executes every time a request is made

app.use(express.static('public'));

app.get('/', function(request, response){
  response.sendFile("index.html");
});

//TODO Api for client to get the daily painting

//TODO Interupts every hour to get a new painting from the api

app.get('/api',function(req, res){
  res.send(paintingJSON);
})


var portNr = 8002;

var server = app.listen(portNr, function(){
  console.log("Server on port: " + server.address().port);

});
