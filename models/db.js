const { Pool } = require('pg');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);

const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString,
});

// Function to initialize tables
const initializeTables = async () => {
  try {
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        telephone VARCHAR(20),
        address TEXT,
        city VARCHAR(255),
        postal_code VARCHAR(20),
        country VARCHAR(255),
        hashed_password BYTEA NOT NULL,
        salt BYTEA NOT NULL
      );
    `);

    // Create session table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS session (
        sid VARCHAR NOT NULL PRIMARY KEY,
        sess TEXT NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
    `);

    console.log('Tables initialized');
  } catch (err) {
    console.error('Error initializing tables:', err);
  }
};


initializeTables();

const sessionMiddleware = session({
  store: new PgSession({
    pool,
    tableName: 'session',
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 },
});

module.exports = { pool, sessionMiddleware };
