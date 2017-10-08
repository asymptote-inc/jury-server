const crypto = require('crypto');

const User = require('../models/user');
const Token = require('../models/token');

const login = ({ username, email, password, userAgent }, callback) => {
  if (!((username || email) && password)) {
    callback(new Error('Missing parameters. '));

  } else {
    const funcOnResult = (err, result) => {
      if (err) {
        callback(err);

      } else if (result === null) {
        callback(new Error('User not found. '));

      } else {
        const salt = Buffer.from(result.salt, 'base64');
        const key = crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512').toString('base64');

        if (key !== result.key) {
          callback(new Error('Incorrect password. '));

        } else {
          const token = new Token({ code: crypto.randomBytes(16).toString('base64'), userId: result.userId, ua: userAgent });

          token.save(err => {
            if (err) {
              callback(err);
            } else {
              callback(undefined, token);
            }
          });
        }
      }
    };

    if (username) {
      User.findOne({ name: username }).exec(funcOnResult);
    } else if (email) {
      User.findOne({ email }).exec(funcOnResult);
    }
  }
};

module.exports = login;
