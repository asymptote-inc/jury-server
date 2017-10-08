const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  key: String,
  salt: String,
  coins: Number
});

const User = mongoose.model('User', userSchema);

module.exports = User;
