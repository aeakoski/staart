var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('superagent');

var requestIntervall = (1000*60*60);
var demoIntervall = (1000*10);

var clientID = '6ea93f8aa8b00ee5d448',
    clientSecret = '04079fc5158cae176d9f598cc81f153e',
    apiUrl = 'https://api.artsy.net/api/tokens/xapp_token',
    xappToken,
    artistLink,
    intervalExists = false;
    viewed = true; //Init value to make the first fetch

var paintingJSON={};
var artistJSON = {};

var paintingBuffer = {};
var artistBuffer = {};

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
        artistBuffer =  res.body._embedded.artists[0];
      }

      paintingJSON = paintingBuffer;
      artistJSON = artistBuffer;

      //console.log("Artist End");

    });
}

function fetchPainting(){
  //If no one has wied our last fetched painting, it is redundant to fetch another and waist api calls.
  if (!viewed) {
    return;
  }

  viewed = false;

  console.log("eyyow");
  /*

  Passing in a parameter of "sample" will redirect you to the
  canonical URL for a random element in the collection.
  It can be combo'ed with additional filter parameters, so one
  could query for a random upcoming show with:
  "https://api.artsy.net/api/shows?status=upcoming&sample=1"

  */

  /*
Errorkoden jag får är:

2016-11-22T16:13:05.990048+00:00 app[web.1]: TypeError: Cannot read property 'id' of undefined
2016-11-22T16:13:05.990058+00:00 app[web.1]:     at /app/eserver.js:131:19
2016-11-22T16:13:05.990059+00:00 app[web.1]:     at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
2016-11-22T16:13:05.990060+00:00 app[web.1]:     at next (/app/node_modules/express/lib/router/route.js:131:13)
2016-11-22T16:13:05.990061+00:00 app[web.1]:     at Route.dispatch (/app/node_modules/express/lib/router/route.js:112:3)
2016-11-22T16:13:05.990061+00:00 app[web.1]:     at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
2016-11-22T16:13:05.990062+00:00 app[web.1]:     at /app/node_modules/express/lib/router/index.js:277:22
2016-11-22T16:13:05.990063+00:00 app[web.1]:     at Function.process_params (/app/node_modules/express/lib/router/index.js:330:12)
2016-11-22T16:13:05.990063+00:00 app[web.1]:     at next (/app/node_modules/express/lib/router/index.js:271:10)
2016-11-22T16:13:05.990064+00:00 app[web.1]:     at SendStream.error (/app/node_modules/express/node_modules/serve-static/index.js:121:7)
2016-11-22T16:13:05.990065+00:00 app[web.1]:     at emitOne (events.js:77:13)
2016-11-22T16:13:13.635948+00:00 heroku[router]: at=info method=GET path="/fetch" host=staart.herokuapp.com request_id=982ca2a9-a2ff-4879-ac7f-cf04ee6d4595 fwd="130.229.158.59" dyno=web.1 connect=1ms service=17ms status=200 bytes=1955




  */

  //console.log("Painting Begin");
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

        paintingBuffer =  res.body;
      }

      fetchArtist(artistLink);

    });
}

var fetchToken = function(){
  //Token validd for 5 days
  //console.log("Token Begin");
  request
    .post(apiUrl)
    .send({ client_id: clientID, client_secret: clientSecret })
    .end(function(err, res) {
      if(err){
        console.log(err);
      }else {

          xappToken = res.body.token;
          //console.log(res.body);

          /*
          { type: 'xapp_token',
  token: 'JvTPWe4WsQO-xqX6Bts49tvQMenYJY_eHmpmimI4vV_AT5ZSrjiNxFene9hLyN4AHD2uoaOQal6SJ3HAk9JO87Bc9kjSFHXcownhWi93RyPUif4XZ44wQPr-bUXKllPVwVIj_J_7EscQ6bv34cmrByT82idLBmLCCgz2zGaoP4UOcfUnfeeur3Yo2aEI9br7PQnpdx8WSi-qjpln7ilLq4UkDXyN7pdr41kIYJnNYW0=',
  expires_at: '2016-11-05T08:26:44+00:00',
  _links: {} }

          */

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
    setInterval(fetchPainting, requestIntervall);
}

app.set('port', (process.env.PORT || 8002));

//Executes every time a request is made
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response){

  //This is where all the shit happenes when i try reading ID
  viewed = true;

  if ( (artistJSON.id === undefined) && (paintingJSON.dimensions===undefined)) {
    response.sendFile("public/index-none.html" ,{ root: __dirname });
  }else if (paintingJSON.dimensions.cm.width / paintingJSON.dimensions.cm.height >= 2) {
    response.sendFile("public/index-wide.html" ,{ root: __dirname });
    console.log("Wide!");
  }else {
    console.log("High");
    response.sendFile("public/index-high.html",{ root: __dirname });
    }
});

app.get('/fetch',function(request, response){
  fetchPainting();

  response.sendFile("public/index-none.html" ,{ root: __dirname });
});

app.get('/api/painting',function(request, response){
  response.send(paintingJSON);
});

app.get('/api/artist', function(request, response){
  response.send(artistJSON);
});


var server = app.listen(app.get('port'), function(){
  //console.log(server.address())
  console.log("Server on port: " + app.get('port'));

});
