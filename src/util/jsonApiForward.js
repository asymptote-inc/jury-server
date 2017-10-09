const jsonApiForward = (func, params) => (req, res) => {
  const handleResult = (err, r) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(r);
    }
  };

  if (!params || params.length === 0) {
    func(handleResult);
  } else {
    // TODO Create a mapping between custom names used in functions and api params.
    func({ ...params.map(k => ({ [k]: req.params[k] })) }, handleResult);
  }
};

module.exports = jsonApiForward;