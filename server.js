require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('./utils/passportConfig'); 
const { sessionMiddleware } = require('./models/db');
const app = express();
const PORT = process.env.PORT || 4242;

app.use(express.static(__dirname));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session()); 

// Import the routing file and use the router
const router = require('./routing/routing');
app.use('', router); 

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
