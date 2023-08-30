const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pricingController = require('../controller/pricingController');
const passport = require('passport');
const crypto = require('crypto');
const db = require('../models/db');
const { hash } = require('bcryptjs');

// Define the route on the router
router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        //this one actually controls quantity
        price: await pricingController.createPrice(),
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://www.google.ca',
    cancel_url: 'https://www.facebook.com',
  });

  res.redirect(303, session.url);
});

// Route to handle login attempts
router.post('/login', passport.authenticate('local', {
  successRedirect: '../view/account/dashboard.html',
  failureRedirect: '../view/account/login.html?error=1' // Redirect with an error parameter
}));

// Logout
router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//Signup
router.post('/signup', async function (req, res, next) {
  const { username, psw, first_name, last_name, telephone, address, city, postal_code, country } = req.body;

  // Check if passwords match
  if (psw !== req.body['repeat psw']) {
    // Passwords do not match, display an error message
    return res.status(400).send("Passwords do not match. Please try again.");
  }

  // Generate a random 'id' integer
  let id;
  let isIdUnique = false;
  while (!isIdUnique) {
    id = generateRandomInteger(100000, 999999); // Function to generate a random integer
    // Check if the generated 'id' already exists in the database
    const result = await checkIfIdExists(id);
    if (!result) {
      isIdUnique = true;
    }
  }

  // Check if the username (formerly 'email') already exists in the database
  const usernameExists = await checkIfUsernameExists(username);
  if (usernameExists) {
    return res.status(400).send("Username already exists. Please use a different username.");
  }

  // Generate a salt and hash the password
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(psw, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
    if (err) { return next(err); }

    // Insert the user data into the database
    const query = {
      text: 'INSERT INTO users (id, username, first_name, last_name, telephone, address, city, postal_code, country, hashed_password, salt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      values: [
        id,
        username,
        first_name,
        last_name,
        telephone,
        address,
        city,
        postal_code,
        country,
        hashedPassword,
        salt,
      ],
    };

    try {
      await db.pool.query(query);
      // User successfully inserted, you can now redirect or send a response as needed.
      res.redirect('/'); // Redirect to a success page or any other route you prefer.
    } catch (error) {
      console.error("Error inserting user:", error);
      return res.status(500).send("An error occurred while creating your account.");
    }
  });
});

// Function to generate a random integer within a range
function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to check if 'id' already exists in the database
async function checkIfIdExists(id) {
  const query = {
    text: 'SELECT COUNT(*) FROM users WHERE id = $1',
    values: [id],
  };
  const result = await db.pool.query(query);
  return parseInt(result.rows[0].count) > 0;
}

// Function to check if 'username' (formerly 'email') already exists in the database
async function checkIfUsernameExists(username) {
  const query = {
    text: 'SELECT COUNT(*) FROM users WHERE username = $1',
    values: [username],
  };
  const result = await db.pool.query(query);
  return parseInt(result.rows[0].count) > 0;
}



















// Route to access the accounts page if authenticated
router.get('/account', ensureAuthenticated, (req, res) => {
  // Redirect to the dashboard if authenticated
  res.redirect('../view/account/dashboard.html');
});

// Function to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('../view/account/login.html');
}


module.exports = router; 
