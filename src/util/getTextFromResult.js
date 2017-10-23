// Removes headers etc. and sends only the text.
const getTextFromResult = callback => (err, res) => {
  if (err) {
    console.log(err);
    if (err.message) {
      console.log(err.message);
    }
    callback(err);
  } else {
    callback(undefined, res.text);
  }
};

module.exports = getTextFromResult;
