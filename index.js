const express = require('express');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const bodyParser = require('body-parser');

const config = require('./config');

const register = require('./src/auth/register');
const testAccess = require('./src/auth/testAccess');
const login = require('./src/auth/login');
const api = require('./src/api/crowd9Api');
const jsonApiCall = require('./src/util/jsonApiForward');

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));

const port = process.env.PORT || 80;
const environment = process.env.NODE_ENV || 'development';

mongoose.Promise = Bluebird;
mongoose.connect(config.mongoDbConnectionString, { useMongoClient: true, promiseLibrary: Bluebird });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
  res.sendStatus(200); // Ok
});

app.post('/register', (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  register(req.body, err => {
    if (err) {
      res.status(400); // Bad request
      res.send({ error: err.message });
    } else {
      res.status(201); // Created
      res.send(req.body);
    }
  });
});

app.post('/login', (req, res) => {
  const userAgent = req.headers['User-Agent'] || req.headers['user-agent'];

  login({ ...req.body, userAgent }, (err, result) => {
    if (err) {
      res.status(400); // Bad request
      res.send({ error: err.message });
    } else {
      res.status(200);
      res.send({ code: result.code });
    }
  });
});

app.get('/touch', (req, res) => {
  const auth = req.headers['Authorization'] || req.headers['authorization'];

  if (auth) {
    testAccess(auth.split(/\s+/)[1], err => {
      if (err) {
        res.setHeader('WWW-Authenticate', 'Bearer');
        res.sendStatus(401); // Unauthorized
      } else {
        res.sendStatus(200); // OK
      }
    });
  } else {
    res.sendStatus(403); // Forbidden
  }
});

app.get('/api', jsonApiCall(api.getClientJob));

app.get('/api/training_questions', jsonApiCall(api.getAllTrainingQuestions));

app.get('/api/to_answer_questions', jsonApiCall(api.getAllToAnswerQuestions));

app.get('/api/next10_unanswered_questions', jsonApiCall(api.getNext10UnansweredQuestions));

app.get('/api/answered_questions', jsonApiCall(api.getAllAnsweredQuestions));

app.post('/api/questions/:question_id/answers/:worker_nonce', (req, res) => { }); // TODO derive nonce by auth

app.get('/api/workers/:worker_nonce', (req, res) => { }); // TODO derive nonce by auth

app.get('/api/workers/:worker_nonce/quality_summary', (req, res) => { }); // TODO derive nonce by auth

app.get('/api/answers', jsonApiCall(api.getAllAnswers));

app.get('/api/questions/:question_id/answers', (req, res) => { }); // TODO

app.get('/api/quality_summary', jsonApiCall(api.getQuality));

// app.get('/active_jobs', (req, res) => { });

// app.post('/active_jobs/:client_job_key', (req, res) => { });

// app.post('/questions', (req, res) => { });

// app.patch('/questions', (req, res) => { });

// app.delete('/active_jobs/:client_job_key', (req, res) => { });

// app.get('/question_groups', (req, res) => { });

// app.get('/scored_answers', (req, res) => { });

// app.get('/question_groups/:question_group_id', (req, res) => { });

// app.delete('/questions/:question_group_id/:question_id', (req, res) => { });

// app.patch('/questions/:question_group_id/:question_id', (req, res) => { });

app.listen(port, () => {
  console.log(`${environment} server listening on port ${port}.`)
});
