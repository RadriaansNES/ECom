const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pricingController = require('./controller/pricingController');

module.exports = (app) => {
    //THIS IS THE ROUTE!
    app.post('/create-checkout-session', async (req, res) => {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
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
};