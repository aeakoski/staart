var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('superagent');

var clientID = '6ea93f8aa8b00ee5d448',
    clientSecret = '04079fc5158cae176d9f598cc81f153e',
    apiUrl = 'https://api.artsy.net/api/tokens/xapp_token',
    xappToken,
    artistLink,
    intervalExists = false;

var paintingJSON={};
var artistJSON = {};

var fetchArtist = function(call){
  request
    .get('https://api.artsy.net/api/'+call)
    .set('x-xapp-token', xappToken)
    .set('Accept', 'application/json')
    .end(function(err, res){
      if (err) {
        console.log(err.error);
      }else{
        //console.log(res.body._embedded.artists[0]);
        artistJSON =  res.body._embedded.artists[0];
      }

      console.log("Artist End");

    });
}

function fetchPainting(){
  /*

  Passing in a parameter of "sample" will redirect you to the
  canonical URL for a random element in the collection.
  It can be combo'ed with additional filter parameters, so one
  could query for a random upcoming show with:
  "https://api.artsy.net/api/shows?status=upcoming&sample=1"

  */

  console.log("Painting Begin");
  request
    .get('https://api.artsy.net/api/'+ 'artworks?sample=1')
    .set('x-xapp-token', xappToken)
    .set('Accept', 'application/json')
    .end(function(err, res){
      if (err) {
        console.log(err);

      }else{
        artistLink = res.body._links.artists.href.substring(26);

        //TODO Logic for selecting the best image size

        /*
        Sizes suported by the API:

        featured
        general
        large
        larger
        large_rectangle
        medium
        medium_rectangle
        normlized
        square
        tall
        */

        paintingJSON =  res.body;
      }

      fetchArtist(artistLink);

    });
}

var fetchToken = function(){
  console.log("Token Begin");
  request
    .post(apiUrl)
    .send({ client_id: clientID, client_secret: clientSecret })
    .end(function(err, res) {
      if(err){
        console.log(err);
      }else {

          xappToken = res.body.token;

          //Token to test error message
          //xappToken = "JvTPWe4WsQO-xqX6Bts49odIKiJo2bM7jYmadA9XZu1fiJos49Cx1pbq8Y4crkR_yoEblmajLq8rshz56kMdL-nKz1bl-3Wy_IQ6XoRUEdGxpZcx9StwPgKbST4rK5NHqAX6JI2xg4x3AkzFxEJ7pb_FiXa1p-krV9V2UGgAVwSlVNtlmcylV8WvEQ03UwIeyfGpMnb1fEaPkVWi4yoxMTXT6nw_BYkS0t8mgvXJ6wE=";

          console.log("Token End");

          fetchPainting();
      }
  });

}

fetchToken();

if (!intervalExists) {
    intervalExists = true;
    setInterval(fetchPainting, 10000);
}


//Executes every time a request is made
app.use(express.static('public'));

app.get('/', function(request, response){
  if ( (artistJSON.id==undefined) && (paintingJSON.dimensions==undefined)) {
    response.sendFile("public/index-none.html" ,{ root: __dirname });
  }else if (paintingJSON.dimensions.cm.width / paintingJSON.dimensions.cm.height >= 2) {
    response.sendFile("public/index-wide.html" ,{ root: __dirname });
  }else {
    response.sendFile("public/index-high.html",{ root: __dirname });
    }
  });

app.get('/api/painting',function(req, res){
  res.send(paintingJSON);
});

app.get('/api/artist', function(req,  res){
  res.send(artistJSON);
});

var portNr = 8002;

var server = app.listen(portNr, function(){
  console.log(server.address())
  console.log("Server on port: " + server.address().port);

});
