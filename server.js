require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('./utils/passportConfig'); 
const { sessionMiddleware } = require('./models/db');
const app = express();
const PORT = process.env.PORT || 4242;
const livereload = require('livereload');
const server = livereload.createServer();

// Serve static files with cache headers
app.use(express.static(__dirname, {
  maxAge: '7d', // Set cache max age to 7 days (604800 seconds)
  etag: false, // Disable ETag to simplify caching behavior
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session()); 

// Import the routing file and use the router
const router = require('./routing/routing');
app.use('', router); 

server.watch(__dirname);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});