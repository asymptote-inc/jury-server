// Removes headers etc. and sends only the text. 
const getTextFromResult = callback => (err, res) => {
  console.log(callback);
  if (err) {
    callback(err);
  } else {
    callback(undefined, res.text);
  }
};

module.exports = getTextFromResult;
