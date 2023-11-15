const pricingController = require('./pricingController');

async function createCheckoutSession() {
  try {
    const priceId = await pricingController.createPrice(); // Get Price ID
    const session = await stripe.checkout.sessions.create({
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, 
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
