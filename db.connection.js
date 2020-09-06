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

// remove a game by id from db
function removeGameById(res, id) {
  let mongoClient = require('mongodb').MongoClient;
  mongoClient.connect(url, options, (err, client) => {
    if (err) {
      res.status(500).send({err: err, info: null})
    }
    var dbo = client.db(name);
    dbo.collection("games").remove({ "gameId": id })
      .then(result => {
        if (result.result.ok === 1 && result.result.n === 1) {
          res.status(200).send({ err: null, info: `Removed game ${id}`});
          client.close();
        }
        else {
          let error = `Unexpected delete result: ${result}`;
          res.status(500).send({ err: error, info: null });
          client.close();
        }
      })
      .catch(err => {
          res.status(500).send({ err: err, info: null });
          client.close();
      });
  });
}

// remove all games from db
function removeGames(res) {
  let mongoClient = require('mongodb').MongoClient;
  mongoClient.connect(url, options, (err, client) => {
    if (err) {
      res.status(500).send({err: err, info: null})
    }
    var dbo = client.db(name);
    dbo.collection("games").remove({})
      .then(result => {
        if (result.result.ok === 1) {
          res.status(200).send({ err: null, info: `Removed ${result.result.n} games`});
          client.close();
        }
        else {
          let error = `Unexpected delete result: ${result}`;
          res.status(500).send({ err: error, info: null });
          client.close();
        }
      })
      .catch(err => {
          res.status(500).send({ err: err, info: null });
          client.close();
      });
  });
}

// add a player to a game in the db (player must have a unique name)
function addPlayer(res, gameId, player) {
  let mongoClient = require('mongodb').MongoClient;
  mongoClient.connect(url, options, (err, client) => {
    if (err) {
      res.status(500).send({err: err, info: null})
    }
    var dbo = client.db(name);
    // addToSet will ensure no duplicates can exist in the players list for a given game
    dbo.collection("games").update(
      { "gameId": gameId },
      { $addToSet: { players: player } }
    ).then(result => {
      if (result.result.ok === 1) {
        // return 200 if player is added
        if (result.result.nModified === 1) {
          let response = `Successfully added player ${player} to game ${gameId}.`;
          res.status(200).send({ err: null, info: response });
        }
        // return 400 if player name was already taken
        else {
          let response = `Player ${player} already exists in game ${gameId}, please pick a different name.`;
          res.status(400).send({ err: response, info: null });
        }
      }
      // if something is up with the result object, send it as 500 error
      else {
        let error = `Failed to add player, result: ${result}`;
        res.status(500).send({ err: error, info: null });
      }
    }).catch(err => {
      let error = `Failed to add player: ${err}`;
      res.status(500).send({ err: error, info: null });
    });
  });
}

module.exports = {
  dbInfo,
  addGame,
  fetchGames,
  fetchGameById,
  removeGameById,
  removeGames,
  addPlayer
}