const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('../models/db');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
        if (err) {
            return done(err);
        }
        const user = result.rows[0];
        done(null, user);
    });
});

passport.use(
    new LocalStrategy((username, password, done) => {
        pool.query('SELECT * FROM users WHERE username = $1', [username], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return done(err);
            }

            if (!result.rows.length) {
                console.log('User not found for username:', username);
                return done(null, false, { message: 'Incorrect username.' });
            }

            const user = result.rows[0];

            if (user.password !== password) {
                console.log('Incorrect password for username:', username);
                return done(null, false, { message: 'Incorrect password.' });
            }

            console.log('User logged in successfully:', username);
            return done(null, user);
        });
    })
);

module.exports = passport;
