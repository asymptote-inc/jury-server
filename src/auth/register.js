const crypto = require('crypto');
const uuid1 = require('uuid/v1');

const User = require('../models/user');

const register = ({ username, email, password }, callback) => {
  if (!(username && email && password)) {
    callback(new Error('Missing parameters. '));
  } else {
    User.findOne({ name: username })
      .or({ email })
      .exec((err, result) => {
        if (err) {
          callback(err);
        } else if (result !== null) {
          callback(new Error('User already exists. '));
        } else {
          const userId = uuid1();

          const salt = crypto.randomBytes(256);
          const key = crypto
            .pbkdf2Sync(password, salt, 100000, 512, 'sha512')
            .toString('base64');

          const user = new User({
            userId,
            name: username,
            email,
            key,
            salt: salt.toString('base64'),
            coins: 0
          });

          user.save(callback);
        }
      });
  }
};

module.exports = register;
