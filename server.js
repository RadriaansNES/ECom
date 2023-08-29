require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy; 
const { pool, sessionMiddleware } = require('./models/db'); 

const app = express();
const PORT = process.env.PORT || 4242;

app.use(express.static(__dirname));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session()); 

//Define your user serialization and deserialization functions
passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize the user ID to the session
});

passport.deserializeUser((id, done) => {
    // Deserialize the user from the user ID stored in the session
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
        if (err) {
            return done(err);
        }
        const user = result.rows[0];
        done(null, user);
    });
});


// Configure the Passport Local Strategy for user login
passport.use(
    new LocalStrategy((username, password, done) => {
        pool.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
            if (err) {
                console.error('Database error:', err); // Log database error
                return done(err);
            }

            if (!result.rows.length) {
                console.log('User not found for username:', username); // Log username not found
                return done(null, false, { message: 'Incorrect username.' });
            }

            const user = result.rows[0];

            // Compare the provided password with the stored password hash
            if (user.password !== password) {
                console.log('Incorrect password for username:', username); // Log incorrect password
                return done(null, false, { message: 'Incorrect password.' });
            }

            console.log('User logged in successfully:', username); // Log successful login
            return done(null, user);
        });
    })
);




// Import the routing file and use the router
const router = require('./routing/routing');
app.use('', router); 

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
