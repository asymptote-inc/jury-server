const express = require('express');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');

const config = require('./config');

const app = express();
const port = process.env.PORT || 80;
const environment = process.env.NODE_ENV || 'development';

mongoose.Promise = Bluebird;
mongoose.connect(config.mongoDbConnectionString, { useMongoClient: true, promiseLibrary: Bluebird });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', function (req, res) {
  res.sendStatus(200);
});

app.listen(port, function () {
  console.log(`${environment} server listening on port ${port}.`)
});
