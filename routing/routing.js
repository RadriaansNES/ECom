require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();
const pricingController = require('./controller/pricingController');


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
