module.exports = {
  name: 'db',
  url: 'mongodb://mongo:27017',
  options: {
    useUnifiedTopology: true,
    useNewUrlParser:true,
    poolSize: 5,
    reconnectInterval: 500
  }
}