const express = require('express');
const mongoose = require('mongoose');
const Bluebird = require('bluebird');
const bodyParser = require('body-parser');

const config = require('./config');

const register = require('./src/auth/register');
const login = require('./src/auth/login');
const testAccess = require('./src/auth/testAccess');
const auth = require('./src/auth/authMiddleware');
const logout = require('./src/auth/logout');
const api = require('./src/api/crowd9Api');
const jsonApiCall = require('./src/api/jsonApiForward');

const app = express();
const router = express.Router();
router.use('/api', auth);
router.use('/xapi', auth);
app.use(bodyParser.json({ type: 'application/json' }));
app.use('/', router);

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

app.post('/logout', (req, res) => {
  const auth = req.headers['Authorization'] || req.headers['authorization'];

  if (auth) {
    let bearerAndCode = auth.split(/\s+/);

    if (bearerAndCode.length !== 2 || !/^[Bb]earer$/.test(bearerAndCode[0])) {
      res.sendStatus(400); // Bad request      
    } else {
      logout({ code: bearerAndCode[1] }, (err, userId) => {
        if (err) {
          res.setHeader('WWW-Authenticate', 'Bearer');
          res.sendStatus(401); // Unauthorized
        } else {
          res.sendStatus(200); // OK
        }
      });
    }
  } else {
    res.sendStatus(403); // Forbidden
  }
});

app.get('/touch', (req, res) => {
  const auth = req.headers['Authorization'] || req.headers['authorization'];

  if (auth) {
    let bearerAndCode = auth.split(/\s+/);

    if (bearerAndCode.length !== 2 || !/^[Bb]earer$/.test(bearerAndCode[0])) {
      res.sendStatus(400); // Bad request      
    } else {
      testAccess({ code: bearerAndCode[1] }, (err, userId) => {
        if (err) {
          res.setHeader('WWW-Authenticate', 'Bearer');
          res.sendStatus(401); // Unauthorized
        } else {
          res.sendStatus(200); // OK
        }
      });
    }
  } else {
    res.sendStatus(403); // Forbidden
  }
});

app.get('/api', jsonApiCall(api.getClientJob));

app.get('/api/training_questions', jsonApiCall(api.getAllTrainingQuestions));

app.get('/api/to_answer_questions', jsonApiCall(api.getAllToAnswerQuestions));

app.get('/api/next10_unanswered_questions', jsonApiCall(api.getNext10UnansweredQuestions));

app.get('/api/answered_questions', jsonApiCall(api.getAllAnsweredQuestions));

app.post('/api/questions/:question_id/answers/user', jsonApiCall(api.postUserAnswerToQuestion, { "questionId": "question_id" }, ['userId'])); // TODO derive nonce by auth

app.get('/api/workers/user', jsonApiCall(api.getUserSubmittedAnswers, {}, ['userId'])); // TODO derive nonce by auth

app.get('/api/workers/user/quality_summary', jsonApiCall(api.getUserQuality, {}, ['userId'])); // TODO derive nonce by auth

app.get('/api/answers', jsonApiCall(api.getAllAnswers));

app.get('/api/questions/:question_id/answers', jsonApiCall(api.getAllAnswersToQuestion, { "questionId": "question_id" })); // TODO

app.get('/api/quality_summary', jsonApiCall(api.getQuality));

app.listen(port, () => {
  console.info(`${environment} server listening on port ${port}.`)
});
