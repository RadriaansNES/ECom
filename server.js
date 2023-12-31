require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('./utils/passportConfig'); 
const { sessionMiddleware } = require('./models/db');
const app = express();
const PORT = process.env.PORT || 4242;
const livereload = require('livereload');
const server = livereload.createServer();
const favicon = require('serve-favicon');


app.use(favicon(__dirname + '/view/pages/src/mermaid logo.png')); 
app.use(express.static(__dirname + '/view/pages', {
  maxAge: '7d', 
  etag: false, 
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session()); 

const router = require('./routing/routing');
app.use('', router); 

//Serve JavaScript files with correct MIME 
app.use('/utils', express.static(__dirname + '/utils', {
  maxAge: '7d',
  etag: false,
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.type('application/javascript');
    }
  }
}));

server.watch(__dirname);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
