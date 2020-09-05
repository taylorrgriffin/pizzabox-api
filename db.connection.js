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

module.exports = {
  dbInfo,
}