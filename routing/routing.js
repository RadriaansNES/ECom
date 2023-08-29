const express = require('express');
const router = express.Router(); // Create a router instance
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pricingController = require('../controller/pricingController');
const passport = require('passport'); // Import Passport

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

// Define the route for user login
router.post('/login', passport.authenticate('local', {
  successRedirect: '../view/account/dashboard.html', // Redirect to the dashboard on success
  failureRedirect: '../view/account/login.html', // Redirect to login page on failure
}));

// Define the route for the /account page
router.get('/account', ensureAuthenticated, (req, res) => {
  // Redirect to the dashboard if authenticated
  // Redirect to login page if not authenticated
  res.redirect('../view/account/dashboard.html');
});

// Function to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('../view/account/login.html'); // Redirect to login page if not authenticated
}


module.exports = router; // Export the router
