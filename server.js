require('dotenv').config();
const express = require('express');
const app = express(); // Initialize the Express app instance

app.use(express.static(__dirname));

const PORT = process.env.PORT || 4242;

// Import the routing file and pass the app instance
require('./routing/routing')(app);

// Define a route handler for the root path ("/")
app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html'); // Adjust the file path as needed
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});