const express = require('express');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const bodyParser = require('body-parser');

const config = require('./config');

const register = require('./src/auth/register');
const testAccess = require('./src/auth/testAccess');
const login = require('./src/auth/login');

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));

const port = process.env.PORT || 80;
const environment = process.env.NODE_ENV || 'development';

mongoose.Promise = Bluebird;
mongoose.connect(config.mongoDbConnectionString, { useMongoClient: true, promiseLibrary: Bluebird });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', function (req, res) {
  res.sendStatus(200); // Ok
});

app.get('/env', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Temp', "" + config.mongoDbConnectionString);
  res.send(process.env); 
});

app.post('/register', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  register(req.body, err => {
    if (err) {
      res.status(400); // Bad request
      res.send({ error: err.message });
    } else {
      res.status(201); // Created
      res.send(req.body);
    }
  });
});

app.post('/login', (req, res) => {
  const userAgent = req.headers['User-Agent'] || req.headers['user-agent'];

  login({ ...req.body, userAgent }, (err, result) => {
    if (err) {
      res.status(400); // Bad request
      res.send({ error: err.message });
    } else {
      res.status(200);
      res.send({ code: result.code });
    }
  });
});

app.get('/touch', (req, res) => {
  const auth = req.headers['Authorization'] || req.headers['authorization'];

  if (auth) {
    testAccess(auth.split(/\s+/)[1], err => {
      if (err) {
        res.setHeader('WWW-Authenticate', 'Bearer');
        res.sendStatus(401); // Unauthorized
      } else {
        res.sendStatus(200); // OK
      }
    });
  } else {
    res.sendStatus(403); // Forbidden
  }
});

app.listen(port, function () {
  console.log(`${environment} server listening on port ${port}.`)
});
