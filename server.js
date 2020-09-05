const fs = require('fs');
const cors = require('cors');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

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