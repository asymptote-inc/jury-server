const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question_id: String,
  question: {
    revision_id: String,
    revision_text: String
  },
  answers_per_question: Number,
  answer_count: Number
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
