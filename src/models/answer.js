const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: String,
  questionId: String,
  answer: String,
  answerDescription: String
});

const Answer = mongoose.model('Answer', answerSchema);

exports.Answer = Answer;
