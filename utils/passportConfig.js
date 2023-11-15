const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
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
    new LocalStrategy(async (username, password, done) => {
        const userQuery = 'SELECT * FROM users WHERE username = $1';
        const userResult = await pool.query(userQuery, [username]);

        if (!userResult.rows.length) {
            console.log('User not found for username:', username);
            return done(null, false, { message: 'Incorrect username.' });
        }

        const user = userResult.rows[0];
        const salt = user.salt; 

        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return done(err);
            }

            if (user.hashed_password.toString('hex') !== hashedPassword.toString('hex')) {
                console.log('Incorrect password for username:', username);
                return done(null, false, { message: 'Incorrect password.' });
            }

            console.log('User logged in successfully:', username);
            return done(null, user);
        });
    })
);

module.exports = passport;
