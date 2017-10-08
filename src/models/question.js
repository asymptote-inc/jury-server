const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionId: String,
  question: String,
  answersPerQuestion: Number,
  answerCount: Number
});

const Question = mongoose.model('Question', questionSchema);

exports.Question = Question;
