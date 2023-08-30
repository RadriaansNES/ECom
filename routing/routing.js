const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const passport = require('passport');
const { createUser } = require('../utils/dbhelper');

// Define the route on the router
router.post('/create-checkout-session', async (req, res) => {
 
  const cookieData = req.cookies.shoppingCart; // Adjust the cookie name as needed

  // Parse the cookie data
  const cartItems = JSON.parse(cookieData);

  // Create a checkout session with the dynamically generated line_items
  const session = await stripe.checkout.sessions.create({
    line_items: cartItems.map(item => ({
      price: item["price-id"], // Use the 'price-id' from the cookie as the price ID
      quantity: item.quantity, // Use the quantity from the cookie
    })),
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

  try {
    await createUser(username, psw, first_name, last_name, telephone, address, city, postal_code, country, req);
    // User successfully inserted, can now redirect or send a response 
    res.redirect('../view/account/login.html?success=1');
  } catch (error) {
    return res.redirect('../view/account/signup.html?error=1');
  }
});

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
