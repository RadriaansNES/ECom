require('dotenv').config();
require('./routing')(app); // Import the routing file and pass the app instance
const express = require('express');
const app = express();

app.use(express.static('public'));

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});