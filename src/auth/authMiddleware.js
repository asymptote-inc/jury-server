const testAccess = require('./testAccess');

const auth = (req, res, next) => {
  const auth = req.headers['Authorization'] || req.headers['authorization'];

  if (auth) {
    let bearerAndCode = auth.split(/\s+/);

    if (bearerAndCode.length !== 2 || !/^[Bb]earer$/.test(bearerAndCode[0])) {
      res.sendStatus(400); // Bad request      
    } else {
      testAccess({ code: bearerAndCode[1] }, (err, userId) => {
        if (err) {
          res.setHeader('WWW-Authenticate', 'Bearer');
          res.sendStatus(401); // Unauthorized
        } else {
          next();
        }
      });
    }
  } else {
    res.sendStatus(403); // Forbidden
  }
}

module.exports = auth;
