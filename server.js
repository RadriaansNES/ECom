require('dotenv').config();
const PORT = process.env.PORT || 4242;
const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});