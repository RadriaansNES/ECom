const { Pool } = require('pg');
const connectionString = process.env.CONNECTION_STRING;

//QUERY IS WORKING. CAN TYPE require('./database'); IN SERVER TO SHOW BOOT, CREDENTIALS. 

async function connectAndQuery() {
  const pool = new Pool({
    connectionString,
  });

  try {
   

    // When done, you can end the pool
    //await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Call the async function to execute the database query
connectAndQuery(); 
