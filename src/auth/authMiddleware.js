const createAccessTester = function ({ }) {
  return function (req, res, next) {
    if (request.body) {
      res.sendStatus(403);
      return;
    }
    next();
  }
}

exports.testAccess = createAccessTester;
