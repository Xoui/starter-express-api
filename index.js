const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: null // Setting maxAge to null
    }
}));

app.get('/login', (req, res) => {
    req.session.destroy(); // destroy session
    res.sendFile(path.join(__dirname, 'login.html'));
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
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
