const express = require('express');
const app = express();

const port = process.env.PORT || 80;

app.get('/', function (req, res) {
  res.sendStatus(200);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
});
