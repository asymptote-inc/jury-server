const request = require('superagent');

const Answer = require('../models/answer');
const Question = require('../models/question');
const api = require('../api/crowd9Api');

function getUserUnansweredQuestions(userId, callback) {
  Answer.find({ userId }) // find answers by user
    .exec((err, res) => {
      if (err) {
        callback(err);
      } else {
        Question.find()
          .where('question_id') // questions user has not answered
          .nin(res.map(ans => ans.question_id))
          .sort('field answer_count')
          .limit(10) // limit to 10 questions
          .exec((errq, resq) => {
            if (errq) {
              callback(errq);
            } else {
              if (resq.length >= 10) {
                // at least (actually limited to) 10 questions?
                callback(undefined, resq);
              } else {
                // if not, fetch next 10
                api.getAllToAnswerQuestions((erra, resa) => {
                  if (erra) {
                    callback(erra);
                  } else {
                    const questions = JSON.parse(resa);
                    Question.create(questions, (errm, resm) => {
                      if (errm) {
                        callback(errm);
                      } else {
                        callback(
                          undefined,
                          resq.concat(questions.slice(0, 10 - resq.length))
                        );
                      }
                    });
                  }
                });
              }
            }
          });
      }
    });
}

module.exports = getUserUnansweredQuestions;
