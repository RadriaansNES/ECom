const { Pool } = require('pg');
const connectionString = process.env.CONNECTION_STRING;

//QUERY IS WORKING. CAN TYPE require('./database'); IN SERVER TO SHOW BOOT, CREDENTIALS. 

async function connectAndQuery() {
  const pool = new Pool({
    connectionString,
  });

  try {
    const result = await pool.query('SELECT * FROM public."Products"');
    console.log(result.rows); // Log or process the query results here

    // When done, you can end the pool
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Call the async function to execute the database query
connectAndQuery(); 
