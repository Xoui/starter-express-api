const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  })
);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const isAuthenticated = checkCredentials(username, password);

  if (isAuthenticated) {
    req.session.isAuthenticated = true;
    res.redirect('/index.html');
  } else {
    res.redirect('/?error=authentication');
  }
});

const authenticateMiddleware = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/');
  }
};

app.get('/index.html', authenticateMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function checkCredentials(username, password) {
  return (username === 'admin' && password === 'admin');
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
