require('dotenv').config();
const express = require('express');
const routes = require('./routing/routing');

//run server
const app = express(); 
const PORT = process.env.PORT || 4242;

// route middlewares
app.use('/api', routes);

//listen
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
