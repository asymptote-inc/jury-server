const express = require('express');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const bodyParser = require('body-parser');

const config = require('./config');

const register = require('./src/auth/register');

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

app.listen(port, function () {
  console.log(`${environment} server listening on port ${port}.`)
});
