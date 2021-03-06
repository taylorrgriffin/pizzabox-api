const fs = require('fs');
const cors = require('cors');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

// import apiKey from secrets file
const apiKey = require('./secrets.json').apiKey;

// database methods
const {
  dbInfo,
  addGame,
  fetchGames,
  fetchGameById,
  removeGames,
  removeGameById,
  addPlayer
} = require('./db.connection');

// create instance of express server
const app = express();

// middleware config
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With, content-type'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// root endpoint to ensure service is active
app.get('/', (req, res) => {
  res.status(200).send({ err: null, info: 'OK' });
});

// middleware to make sure /api endpoints always require valid API key
app.use('/api', (req, res, next) => {
  if (req.query && req.query.apiKey == apiKey) {
    next();
  }
  else {
    res.status(401).send({err: 'Invalid API key sent. See documentation for more information.', info: null});
  }
});

// endpoint to get metatdata about database sizes
app.get('/api/dbInfo', (req, res) => {
  dbInfo(res);
});

// store a new game in the db
app.post('/api/game', (req, res) => {
  if (req.body && req.body.game) {
    addGame(res, req.body.game);
  }
  else {
    // 422 is for 'Unprocessable entity',
    // so we send 422 back if the request body does not contain a game object
    res.status(422).send({
      err: 'Missing game object in request body. See documentation for more information.',
      info: null
    });
  }
});

// add player to existing game
app.put('/api/game/:gameId', (req, res) => {
  let id = req.params.gameId;
  let player = req.body ? req.body.player : null;
  if (id && player) {
    addPlayer(res, id, player);
  }
  else {
    // 422 is for 'Unprocessable entity',
    // so we send 422 back if the request does not contain a gameId or player parameter
    res.status(422).send({
      err: 'Missing gameId or player parameter in request. See documentation for more information.',
      info: null
    });
  }
});

// fetch all games currently stored in the db
app.get('/api/game', (req, res) => {
  fetchGames(res);
});

// fetch a game by a given id stored in the db
app.get('/api/game/:gameId', (req, res) => {
  let id = req.params.gameId;
  if (id) {
    fetchGameById(res, id);
  }
  else {
    // 422 is for 'Unprocessable entity',
    // so we send 422 back if the request does not contain a gameId parameter
    res.status(422).send({
      err: 'Missing gameId parameter in request. See documentation for more information.',
      info: null
    });
  }
});

// delete a game by a given id from the db
app.delete('/api/game/:gameId', (req, res) => {
  let id = req.params.gameId;
  if (id) {
    removeGameById(res, id);
  }
  else {
    // 422 is for 'Unprocessable entity',
    // so we send 422 back if the request does not contain a gameId parameter
    res.status(422).send({
      err: 'Missing gameId parameter in request. See documentation for more information.',
      info: null
    });
  }
});

// delete all games in the db
app.delete('/api/game', (req, res) => {
  removeGames(res);
});

// catch-all for non-existant endpoints
app.get('*', (req, res) => {
  res.status(404).send({ err: 'Page not found.', info: null });
});

// create server using ssl for https
https.createServer({
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
}, app)
.listen(8080, '0.0.0.0', () => {
  console.info(`Server listening on port 8080`);
});