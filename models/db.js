const { Pool } = require('pg');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);

const connectionString = process.env.CONNECTION_STRING;

const pool = new Pool({
  connectionString,
});


pool.query(`CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess TEXT NOT NULL,
  expire TIMESTAMP(6) NOT NULL
)`);

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
