const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const passport = require('passport');
const { createUser } = require('../utils/dbhelper');

// Define the route on the router
router.post('/create-checkout-session', async (req, res) => {

  const cookieData = req.cookies.shoppingCart; // Adjust the cookie name as needed

  // Parse the cookie data
  const cartItems = JSON.parse(cookieData);

  // Create a checkout session with the dynamically generated line_items
  const session = await stripe.checkout.sessions.create({
    line_items: cartItems.map(item => ({
      price: item["price-id"], // Use the 'price-id' from the cookie as the price ID
      quantity: item.quantity, // Use the quantity from the cookie
    })),
    mode: 'payment',
    success_url: 'https://www.google.ca',           // GOTTTTTA UPDDDAAAAAAAAAATE
    cancel_url: 'https://www.facebook.com',
  });

  res.redirect(303, session.url);
});

// Route to handle login attempts
router.post('/login', passport.authenticate('local', {
  successRedirect: '/account/dashboard.html',
  failureRedirect: '/account/login.html?error=1', 
}));

// Logout
router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

//Signup
router.post('/signup', async function (req, res, next) {
  const { username, psw, first_name, last_name, telephone, address, city, postal_code, country } = req.body;

  try {
    await createUser(username, psw, first_name, last_name, telephone, address, city, postal_code, country, req);
    res.redirect('/account/login.html?success=1');
  } catch (error) {
    return res.redirect('/account/signup.html?error=1');
  }
});

// Route to access the accounts page if authenticated
router.get('/account', ensureAuthenticated, (req, res) => {
  res.redirect('/account/dashboard.html');
});

// Route to check if user is authenticated
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send('Authenticated');
  } else {
    res.status(401).send('Unauthorized');
  }
});

router.get('/user-data', (req, res) => {
  if (req.isAuthenticated()) {
    const userData = req.user;
    res.json(userData);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Function to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/account/login.html');
}

function generateRandomOrderID(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1));
}

//webhook route to add succesful orders to db
router.post('/stripe-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Generate a random order_id
      const order_id = generateRandomOrderID(8);

      // Insert the order details into the database here
      const client = await pool.connect();

      try {
        // Start a database transaction
        await client.query('BEGIN');

        // Insert the order into the 'order_final' table
        const insertOrderQuery = `
          INSERT INTO order_final (order_id, product_id, total, created_at)
          VALUES ($1, $2, $3, NOW())
          RETURNING order_id;
        `;

        // Calculate the total amount based on session.line_items (you need to implement this)
        const totalAmount = calculateTotalAmount(session.line_items);

        // Execute the insert query
        const result = await client.query(insertOrderQuery, [
          order_id,
          session.line_items.map(item => item.price.product).join(','), // Replace with your logic to get product_ids
          totalAmount,
        ]);

        // Commit the transaction
        await client.query('COMMIT');
      } catch (error) {
        // Handle any errors and roll back the transaction if necessary
        await client.query('ROLLBACK');
        throw error;
      } finally {
        // Release the database client back to the pool
        client.release();
      }
    }

    res.status(200).end();
  } catch (err) {
    res.status(400).send('Webhook Error: ' + err.message);
  }
});

module.exports = router; 
