const Token = require('../models/token');

const testAccess = ({ code }, callback) => {
  if (!code) {
    callback(new Error('No access code provided. '));
  } else {
    Token.findOne({ code }).exec((err, result) => {
      if (err) {
        callback(err);
      } else if (!result) {
        callback(new Error('Access denied. '));
      } else {
        callback();
      }
    });
  }
};

module.exports = testAccess;
