const { Pool } = require('pg');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session); 

const connectionString = process.env.CONNECTION_STRING;

// Create a pool for database connections
const pool = new Pool({
  connectionString,
});

// Initialize express-session with connect-pg-simple
const sessionMiddleware = session({
  store: new PgSession({
    pool, 
    tableName: 'session', 
  }),
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }, // Session expires after 30 days
});

module.exports = { pool, sessionMiddleware };
  