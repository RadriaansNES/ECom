require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('./utils/passportConfig');
const { sessionMiddleware } = require('./models/db');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const PORT = process.env.PORT || 4242;
const livereload = require('livereload');
const server = livereload.createServer();
const favicon = require('serve-favicon');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
  next();
});

app.use(favicon(__dirname + '/view/pages/src/mermaid logo.png'));

app.use(compression());

app.use(helmet({
  contentSecurityPolicy: false, 
}));

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

app.use('/utils', express.static(__dirname + '/utils', {
  maxAge: '7d',
  etag: false,
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.type('application/javascript');
    }
  },
}));

server.watch(__dirname);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
