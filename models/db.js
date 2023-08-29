const { Pool } = require('pg');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session); // Import connect-pg-simple

const connectionString = process.env.CONNECTION_STRING;

// Create a pool for database connections
const pool = new Pool({
  connectionString,
});

// Initialize express-session with connect-pg-simple
const sessionMiddleware = session({
  store: new PgSession({
    pool, // Use the PostgreSQL pool
    tableName: 'session', // Replace with your preferred table name
  }),
  secret: process.env.SESSION_SECRET, // Replace with your session secret
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // Session expires after 30 days
});

module.exports = { pool, sessionMiddleware };
