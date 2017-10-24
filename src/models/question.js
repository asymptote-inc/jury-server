const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question_id: String,
  question: {
    revision_id: String,
    revision_text: String
  },
  answers_per_question: {type: Number, default: 10},
  answer_count: {type: Number, default: 0}
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
