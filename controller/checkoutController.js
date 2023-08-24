require('dotenv').config();

// Access the Stripe secret key from the environmental variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pricingController = require('./pricingController');

async function createCheckoutSession() {
  try {
    const priceId = await pricingController.createPrice(); // Get the Price ID
    const session = await stripe.checkout.sessions.create({
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Use the Price ID obtained from pricingController
          quantity: 1,
        },
      ],
      mode: 'payment',
    });
    return session;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating checkout session');
  }
}

module.exports = {
  createCheckoutSession,
};
