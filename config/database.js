const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

// Create connection pool for Aiven
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  ssl: {
    ca: fs.readFileSync('./ca.pem')
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promise-based pool
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Connected to Aiven MySQL successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

module.exports = { pool, promisePool, testConnection };
