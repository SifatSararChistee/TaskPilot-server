const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();



app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://task-pilot.vercel.app',
    'https://task-pilot-server-git-main-sifus-projects-614a8279.vercel.app'        
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Handle preflight explicitly
app.options('*', cors());


let pool;

if (!pool) {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
      ca: fs.readFileSync(
        path.join(process.cwd(), 'ca.pem')
      )
    },

    waitForConnections: true,
    connectionLimit: 5,   // ✅ serverless-safe
    queueLimit: 0
  });
}

const promisePool = pool.promise();

const testConnection = async () => {
  try {
    await promisePool.query('SELECT 1');
    console.log('✅ Connected to Aiven MySQL');
    return true;
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    return false;
  }
};

module.exports = { pool, promisePool, testConnection };
