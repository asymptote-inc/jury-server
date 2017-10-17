const User = require('../models/user');

function getScoreboard(callback) {
  User
    .find()
    .sort('field coins')
    .limit(15)
    .select('name email coins -_id')
    .exec((err, res) => {
      if (err) {
        callback(err);
      } else {
        callback(undefined, res);
      }
    });
}

module.exports = getScoreboard;
