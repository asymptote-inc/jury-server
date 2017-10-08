const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.sendStatus(200);
});

app.listen(443, function () {
  console.log('Started. ')
});
