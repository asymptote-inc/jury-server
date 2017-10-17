const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: String,
  question_id: String,
  answer: {
    readableAndInEnglish: String,
    toxic: String,
    obscene: String,
    identityHate: String,
    insult: String,
    comments: String
  }
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
