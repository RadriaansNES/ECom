require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 4242;

app.use(express.static(__dirname));
app.use(cookieParser());

// Import the routing file and use the router
const router = require('./routing/routing');
app.use('', router); // Mount the router under the '/api' path

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
