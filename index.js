const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.get('/login', (req, res) => {
    if (req.session.loggedin) {
        return res.redirect('/index.html');
    }
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === 'admin' && password === 'admin') {
        req.session.loggedin = true;
        return res.redirect('/index.html');
    } else {
        res.send('Incorrect Username and/or Password!');
    }
});

app.use((req, res, next) => {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/login');
    }
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
