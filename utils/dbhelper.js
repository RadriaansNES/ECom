const crypto = require('crypto');
const db = require('../models/db');

function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function checkIfIdExists(id) {
  const query = {
    text: 'SELECT COUNT(*) FROM users WHERE id = $1',
    values: [id],
  };
  const result = await db.pool.query(query);
  return parseInt(result.rows[0].count) > 0;
}

async function checkIfUsernameExists(username) {
  const query = {
    text: 'SELECT COUNT(*) FROM users WHERE username = $1',
    values: [username],
  };
  const result = await db.pool.query(query);
  return parseInt(result.rows[0].count) > 0;
}

async function createUser(username, psw, first_name, last_name, telephone, address, city, postal_code, country, req) {
    if (psw !== req.body['repeat psw']) {
      throw new Error("Passwords do not match. Please try again.");
    }
  
    let id;
    let isIdUnique = false;
    while (!isIdUnique) {
      id = generateRandomInteger(100000, 999999);
      const result = await checkIfIdExists(id);
      if (!result) {
        isIdUnique = true;
      }
    }
  
    const usernameExists = await checkIfUsernameExists(username);
    if (usernameExists) {
      throw new Error("Username already exists. Please use a different username.");
    }
  
    const salt = crypto.randomBytes(16);
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(psw, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
        if (err) {
          reject(err);
          return;
        }
  
        const query = {
          text: 'INSERT INTO users (id, username, first_name, last_name, telephone, address, city, postal_code, country, hashed_password, salt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
          values: [
            id,
            username,
            first_name,
            last_name,
            telephone,
            address,
            city,
            postal_code,
            country,
            hashedPassword,
            salt,
          ],
        };
  
        try {
          await db.pool.query(query);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  
  module.exports = {
    createUser,
  };