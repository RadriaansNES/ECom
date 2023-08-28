require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express(); // Initialize the Express app instance

app.use(express.static(__dirname));
app.use(cookieParser());

const PORT = process.env.PORT || 4242;

// Import the routing file and pass the app instance
require('./routing/routing')(app);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});