const Token = require('../models/token');

const logout = ({ code }, callback) => {
  if (!code) {
    callback(new Error('No access code provided. '));
  } else {
    Token.findOneAndRemove({ code }).exec((err, result) => {
      if (err) {
        callback(err);
      } else if (!result) {
        callback(new Error('Access denied. '));
      } else {
        callback(undefined, result.userId);
      }
    });
  }
};

module.exports = logout;
