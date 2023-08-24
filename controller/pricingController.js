require('dotenv').config();

// Access the Stripe secret key from the environmental variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
async function createPrice() {
  try {
    const price = await stripe.prices.create({
      unit_amount: 2000,
      currency: 'cad',
      product: 'prod_OVoZoiUqWYvxZm', // Replace with your actual product ID
    });
    return price.id;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating price');
  }
}

module.exports = {
  createPrice,
};
