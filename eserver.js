var express = require('express')
var request = require('superagent')
var path = require('path')
var requestIntervall = (1000 * 60 * 60)

var app = express()

const PORT = process.env.PORT || 8002;

var clientID = process.env.CLIENT_ID
var clientSecret = process.env.CLIENT_SECRET
var apiUrl = 'https://api.artsy.net/api/tokens/xapp_token'
var xappToken
var artistLink
var intervalExists = false
var viewed = true // Init value to make the first fetch

var paintingJSON = {}
var artistJSON = {}

var paintingBuffer = {}
var artistBuffer = {}

var fetchArtist = function (call) {
  request
    .get('https://api.artsy.net/api/' + call)
    .set('x-xapp-token', xappToken)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if (err) {
        console.log(err.error)
      } else {
        // console.log(res.body._embedded.artists[0]);
        artistBuffer = res.body._embedded.artists[0]
      }

      paintingJSON = paintingBuffer
      artistJSON = artistBuffer
    })
}

function fetchPainting () {
  // If no one has wied our last fetched painting, it is redundant to fetch another and waist api calls.
  if (!viewed) {
    return
  }

  viewed = false

  request
    .get('https://api.artsy.net/api/' + 'artworks?sample=1')
    .set('x-xapp-token', xappToken)
    .set('Accept', 'application/json')
    .end(function (err, res) {
      if (err) {
        console.log(err)
      } else {
        artistLink = res.body._links.artists.href.substring(26)

        /*
        Sizes of pictures suported by the API:

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

        paintingBuffer = res.body
      }

      fetchArtist(artistLink)
    })
}

var fetchToken = function () {
  request
    .post(apiUrl)
    .send({ client_id: clientID, client_secret: clientSecret })
    .end(function (err, res) {
      if (err) {
        console.log(err)
      } else {
        xappToken = res.body.token
        fetchPainting()
      }
    })
}

fetchToken()

if (!intervalExists) {
  intervalExists = true
  setInterval(fetchPainting, requestIntervall)
}

app.set('port', (process.env.PORT || 8002))

// Executes every time a request is made
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', function (request, response) {
  viewed = true

  if ((artistJSON.id === undefined) && (paintingJSON.dimensions === undefined)) {
    response.sendFile('public/index-none.html', { root: __dirname })
  } else if (paintingJSON.dimensions.cm.width / paintingJSON.dimensions.cm.height >= 2) {
    response.sendFile('public/index-wide.html', { root: __dirname })
  } else {
    response.sendFile('public/index-high.html', { root: __dirname })
  }
})

app.get('/fetch', function (request, response) {
  fetchPainting()

  response.sendFile('public/index-none.html', { root: __dirname })
})

app.get('/api/painting', function (request, response) {
  response.send(paintingJSON)
})

app.get('/api/artist', function (request, response) {
  response.send(artistJSON)
})

app.listen(app.get('port'), function () {
  console.log('Server on port: ' + app.get('port'))
})
