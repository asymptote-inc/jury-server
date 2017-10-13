const withUserId = require('../auth/testAccess');

const jsonApiForward = (func, params, inject) => (req, res) => {
  const handleResult = (err, r) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(r);
    }
  };

  if (!params && (!inject || inject.length === 0)) {
    func(handleResult);
  } else {
    let paramsS = params || {};
    let injectS = inject || [];

    if (injectS.indexOf('userId') !== -1) {
      // inject { nameWeUse: value }
      const auth = req.headers['Authorization'] || req.headers['authorization'];

      if (auth) {
        let bearerAndCode = auth.split(/\s+/);

        if (bearerAndCode.length !== 2 || !/^[Bb]earer$/.test(bearerAndCode[0])) {
          res.sendStatus(400); // Bad request      
        } else {
          withUserId({ code: bearerAndCode[1] }, (err, userId) => {
            if (err) {
              res.setHeader('WWW-Authenticate', 'Bearer');
              res.sendStatus(401); // Unauthorized
            } else {
              if (injectS.indexOf('body') !== -1) {
                console.log(paramsS);
                console.log(req.body);
                console.log(req.params);
                func({ ...Object.keys(paramsS).map(k => ({ [k]: req.params[paramsS[k]] })).reduce((cur, new) => ({...cur, ...new})), userId, body: req.body }, handleResult);
              } else {
                func({ ...Object.keys(paramsS).map(k => ({ [k]: req.params[paramsS[k]] })).reduce((cur, new) => ({...cur, ...new})), userId }, handleResult);
              }
            }
          });
        }
      } else {
        res.sendStatus(403); // Forbidden
      }
    } else {
      // params { nameWeUse: "name_they_use" }
      func({ ...Object.keys(params).map(k => ({ [k]: req.params[params[k]] })).reduce((cur, new) => ({...cur, ...new})) }, handleResult);
    }
  }
};

module.exports = jsonApiForward;
