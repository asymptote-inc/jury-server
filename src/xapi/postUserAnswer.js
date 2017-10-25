const request = require('superagent');

const Answer = require('../models/answer');
const Question = require('../models/question');
const User = require('../models/user');
const api = require('../api/crowd9Api');

function postUserAnswer(userId, questionId, body, callback) {
  Answer.find({
    question_id: questionId,
    userId
  }).exec((errFindAnswer, resAnswer) => {
    if (errFindAnswer) {
      callback(errFindAnswer);
    } else if (resAnswer.length > 0) {
      callback(new Error('You already answered that question. '));
    } else {
      // Set correct contents
      let answer;
      if (body.skipped) {
        answer = new Answer({
          userId,
          question_id: questionId,
          skipped: true
        });
      } else {
        answer = new Answer({
          userId,
          question_id: questionId,
          answer: body.answer
        });
      }

      answer.save(errSaveAnswer => {
        if (errSaveAnswer) {
          callback(errSaveAnswer);
        } else {
          if (body.skipped) {
            // Nothing except answer to save
            callback(undefined, { status: 'OK' });
          } else {
            // Send answer, Update user stuff + question stuff
            api.postUserAnswerToQuestion(
              { questionId, userId, body },
              (err, res) => {
                if (err) {
                  callback(err);
                } else {
                  callback(undefined, { status: 'OK' });
                }
              }
            );

            let value =
              10 * !!body.answer.toxic +
              5 * !!body.answer.obscene +
              5 * !!body.answer.identityHate +
              5 * !!body.answer.insult +
              5 * !!body.answer.threat;

            User.findOneAndUpdate(
              { userId },
              { $inc: { coins: value } }
            ).exec((errUser, resUser) => {
              //
            });

            Question.findOneAndUpdate(
              { question_id: questionId },
              { $inc: { answer_count: 1 } }
            ).exec((errQuestion, resQuestion) => {
              if (errQuestion || !resQuestion) {
                //
              } else {
                if (
                  resQuestion.answer_count >= resQuestion.answers_per_question
                ) {
                  resQuestion.remove();
                }
              }
            });
          }
        }
      });
    }
  });
}

module.exports = postUserAnswer;
