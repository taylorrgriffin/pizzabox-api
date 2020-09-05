const { name, url, options } = require('./db.config');

// fetch db info including size, storage, and capacity
function dbInfo(res) {
  let mongoClient = require('mongodb').MongoClient;
  mongoClient.connect(url, options, (err, client) => {
    if (err) {
      res.status(500).send({err: err, info: null})
    }
    // metadata is stored in 'admin'
    var dbAdmin = client.db(name).admin();
    // fetch db info from 'admin
    dbAdmin.listDatabases((err, databases) => {
      res.status(200).send({err: err, info: databases});
      client.close();
    });
  });
}

function addGame(res, game) {
  let mongoClient = require('mongodb').MongoClient;
  mongoClient.connect(url, options, (err, client) => {
    if (err) {
      res.status(500).send({err: err, info: null})
    }
    var dbo = client.db(name);
    dbo.collection("games").insert(game).then(result => {
      // ensure that exactly 1 entity was inserted
      if (result.result.ok === 1
        && result.insertedCount === 1
        && result.ops.length === 1) {
        let response = `Successfully inserted game ${result.ops[0].gameId}.`;
        res.status(200).send({ err: null, info: response });
      }
      // if something is up with the result object, send it as 500 error
      else {
        let error = `Failed to insert game, result: ${result}`;
        res.status(500).send({ err: error, info: null });
      }
    }).catch(err => {
      let error = `Failed to insert game: ${err}`;
      res.status(500).send({ err: error, info: null });
    });
  });
}

// fetch all games from db
function fetchGames(res) {
  let mongoClient = require('mongodb').MongoClient;
  mongoClient.connect(url, options, (err, client) => {
    if (err) {
      res.status(500).send({err: err, info: null})
    }
    var dbo = client.db(name);
    dbo.collection("games").find().toArray((err, result) => {
      if (err) {
        res.status(500).send({err: err, info: null});
        client.close();
      }
      else {
        res.status(200).send({err: null, info: result});
        client.close();
      }
    });
  });
}

// fetch a game by id from db
function fetchGameById(res, id) {
  let mongoClient = require('mongodb').MongoClient;
  mongoClient.connect(url, options, (err, client) => {
    if (err) {
      res.status(500).send({err: err, info: null})
    }
    var dbo = client.db(name);
    dbo.collection("games").find({
      "gameId": id
    }).toArray((err, result) => {
      if (err) {
        res.status(500).send({err: err, info: null});
        client.close();
      }
      else {
        res.status(200).send({err: null, info: result});
        client.close();
      }
    });
  });
}

module.exports = {
  dbInfo,
  addGame,
  fetchGames,
  fetchGameById,
}