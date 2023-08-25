require('dotenv').config();
const PORT = process.env.PORT || 4242;

// Access the Stripe secret key from the environmental variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();
app.use(express.static('public'));
const pricingController = require('./controller/pricingController');


const YOUR_DOMAIN = 'C:/Users/ryaan/Desktop/Code/ECom/view/index.html';

//Check if its running locally, or hosted. Use the respective link in html 
app.get('/', async (req, res) => {
    const PORT = process.env.PORT || 4242;
    
    // Create a script block to set the PORT as a global variable
    const script = `<script>var PORT = ${PORT};</script>`;

    // Send the HTML file along with the script block
    res.sendFile(__dirname + '/path/to/your/index.html', { additionalScript: script });
});



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

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});