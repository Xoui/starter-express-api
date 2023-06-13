const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');

// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session handling
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  })
);

// Serve the login.html page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// POST request to handle login form submission
app.post('/login', (req, res) => {
  // Retrieve the username and password from the request body
  const { username, password } = req.body;

  // Perform authentication logic (replace with your own logic)
  const isAuthenticated = checkCredentials(username, password);

  if (isAuthenticated) {
    // Set a flag in the session indicating successful authentication
    req.session.isAuthenticated = true;
    res.redirect('index.html'); // Redirect to the index.html page
  } else {
    res.redirect('/?error=authentication'); // Redirect back to the login page with an error message
  }
});

// Middleware to check authentication before serving protected routes
const authenticateMiddleware = (req, res, next) => {
  // Check if the user is authenticated
  if (req.session.isAuthenticated) {
    next(); // User is authenticated, proceed to the next middleware or route
  } else {
    res.redirect('/'); // User is not authenticated, redirect to the login page
  }
};

// Serve the protected content (index.html) only if authenticated
app.get('/index.html', authenticateMiddleware, (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Serve static files from the public folder
app.use(express.static('public'));

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Example authentication logic (replace with your own logic)
function checkCredentials(username, password) {
  // Perform username and password validation
  // Return true if the credentials are valid, false otherwise
  return  (username === 'admin' && password === 'password');
}
