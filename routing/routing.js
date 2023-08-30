const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pricingController = require('../controller/pricingController');
const passport = require('passport'); 

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
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
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
