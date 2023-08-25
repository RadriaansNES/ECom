const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// Define a route for creating a checkout session
/*
router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await checkoutController.createCheckoutSession();
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the session.' });
  }
});

module.exports = router;
*/