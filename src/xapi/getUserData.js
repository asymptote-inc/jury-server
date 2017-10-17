const User = require('../models/user');

function getUserData(userId, callback) {
  User
    .findOne({ userId })
    .select('name email coins -_id')
    .exec((err, res) => {
      if (err) {
        callback(err);
      } else {
        if (!res) {
          callback(new Error('User not found. '));
        } else {
          callback(undefined, res);
        }
      }
    });
}

module.exports = getUserData;
