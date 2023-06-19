import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: null // Setting maxAge to null
    }
  })
);

app.get('/login', (req, res) => {
  req.session.destroy(); // destroy session
  res.sendFile(join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
  console.log(req.body); // log the received data
  const username = req.body.username;
  const password = req.body.password;

  if (username === 'admin' && password === 'password') {
    req.session.loggedin = true;
    return res.redirect('/index.html');
  } else {
    return res.send('Incorrect Username and/or Password!');
  }
});

app.use((req, res, next) => {
  if (req.session.loggedin || req.path === '/login') {
    next();
  } else {
    req.session.destroy(); // destroy session
    res.redirect('/login');
  }
});

app.get('/', (req, res) => {
  res.redirect('/index.html');
});

app.get('/index.html', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.get('/site/index.html', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'ultraviolet', 'site', 'index.html'));
});

app.use('/ultraviolet', express.static(join(__dirname, 'public', 'ultraviolet')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
