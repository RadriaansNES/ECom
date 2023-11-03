require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
async function createPrice() {
  try {
    const price = await stripe.prices.create({
      unit_amount: 2000,
      currency: 'cad',
      product: 'prod_OVoZoiUqWYvxZm', //From stripe Web
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
