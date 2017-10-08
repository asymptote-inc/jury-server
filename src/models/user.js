const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

exports.User = User;
