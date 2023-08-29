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


router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard', // Redirect to a success page
    failureRedirect: '../view/account/login.htmlzzzzzzzzzzzzzzzzz', // Redirect to login page on failure
  }));

  router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send('Welcome to the dashboard!');
});

// Function to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // Redirect to login page if not authenticated
}

module.exports = router; // Export the router
