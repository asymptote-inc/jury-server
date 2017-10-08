const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  code: String,
  userId: String
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
