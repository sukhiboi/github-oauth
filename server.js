const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.static('./build'));
app.use(cookieParser());

app.locals.sessions = [];
app.locals.lastId = 0;

const createNewSession = function (accessToken) {
  const id = app.locals.lastId++;
  app.locals.sessions.push({ accessToken, id });
  return id;
};

const deleteSession = function (id) {
  app.locals.sessions = app.locals.sessions.filter(session => session.id == id);
};

const getSession = function (id) {
  const session = app.locals.sessions.find(session => session.id == id);
  return session;
};

const {
  authorizeUser,
  getUserDetailsByAccessToken,
  getGithubAccessToken,
} = require('./github.auth');

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/getUserDetails', (req, res) => {
  const loginError = { err: 'You are not logged in. Please login' };
  const session = getSession(req.cookies.id);
  if (!session) return res.json(loginError);
  getUserDetailsByAccessToken(session.accessToken)
    .then(data => res.json(data))
    .catch(() => res.json(loginError));
});

app.get('/api/login', authorizeUser);

app.get('/api/callback', (req, res) => {
  const code = req.query.code;
  getGithubAccessToken(code).then(token => {
    res.cookie('id', createNewSession(token));
    res.redirect('/signedUp');
  });
});

app.get('/logout', (req, res) => {
  deleteSession(req.cookies.id);
  res.clearCookie('id');
  res.redirect('/');
});

app.listen(5000, () => console.log('server listening on 5000'));
