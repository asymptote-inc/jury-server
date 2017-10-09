const request = require('superagent');

const config = require('../../config');

const clean = require('../util/getTextFromResult');

const url = config.crowd9ApiUrl;
const cjk = config.clientJobKey;

module.exports = {
  getClientJob: callback => {
    request.get(`${url}/client_jobs/${cjk}`, clean(callback));
  },

  getAllTrainingQuestions: callback => {
    request.get(`${url}/client_jobs/${cjk}/training_questions`, clean(callback));
  },

  getAllToAnswerQuestions: callback => {
    request.get(`${url}/client_jobs/${cjk}/to_answer_questions`, clean(callback));
  },

  getNext10UnansweredQuestions: callback => {
    request.get(`${url}/client_jobs/${cjk}/next10_unanswered_questions`, clean(callback));
  },

  getAllAnsweredQuestions: callback => {
    request.get(`${url}/client_jobs/${cjk}/answered_questions`, clean(callback));
  },

  postUserAnswerToQuestion: ({ questionId, userId }, callback) => {
    request.post(`${url}/client_jobs/${cjk}/questions/${questionId}/answers/${userId}`, clean(callback));
  },

  getUserSubmittedAnswers: ({ userId }, callback) => {
    request.get(`${url}/client_jobs/${cjk}/workers/${userId}`, clean(callback));
  },

  getUserQuality: ({ userId }, callback) => {
    request.get(`${url}/client_jobs/${cjk}/workers/${userId}/quality_summary`, clean(callback));
  },

  getAllAnswers: callback => {
    request.get(`${url}/client_jobs/${cjk}/answers`, clean(callback));
  },

  getAllAnswersToQuestion: ({ questionId }, callback) => {
    request.get(`${url}/client_jobs/${cjk}/questions/${questionId}/answers`, clean(callback));
  },

  getQuality: callback => {
    request.get(`${url}/client_jobs/${cjk}/quality_summary`, clean(callback));
  }
};
