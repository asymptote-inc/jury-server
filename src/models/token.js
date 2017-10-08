const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  code: String,
  userId: String
});

const Token = mongoose.model('Token', tokenSchema);

exports.Token = Token;
