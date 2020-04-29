const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const config = require('./config');
const path = require('path')
//const cors = require('cors');
const serverOptions = config.certOptions;
const app = express();
// Import Routes directory
require('./routes')(app);

//app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

if (process.env.NODE_ENV === 'production') {
  console.log(path.join(__dirname, '../../output'))
  app.use(express.static(path.join(__dirname, '../../output')));
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname, '../../output/index.html'));
  })
}

app.get('/', (_req, res) => {
  res.sendStatus(200);
});

app.get('/health', (_req, res) => {
  res.sendStatus(200);
});

var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || '4000';

var server = https.createServer(serverOptions, app);

server.listen(port, ip, err => {
  if (err) console.log(err);
  console.log('ip:', ip, 'Listening on port:', port)
});