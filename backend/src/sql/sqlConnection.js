import mysql from 'mysql2/promise';

// Configuration settings from environment variables
const db_config = {
  host: process.env.DB_MYSQL_HOST,
  user: process.env.DB_MYSQL_USER,
  password: process.env.DB_MYSQL_PASSWORD,
  database: process.env.DB_MYSQL_NAME,
};

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

// Retry function to connect to MySQL
async function connectWithRetry() {
  let attempts = 0;
  let connection;

  while (attempts < MAX_RETRIES) {
    try {
      // Try to create a connection to MySQL server
      connection = await mysql.createConnection(db_config);
      console.log("MySQL connected successfully");
      return connection; // Return the connection once it's successful
    } catch (error) {
      attempts += 1;
      console.error(`MySQL connection attempt ${attempts} failed: ${error.message}`);
      if (attempts < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY)); // Wait before retrying
      } else {
        throw new Error('MySQL connection failed after multiple attempts');
      }
    }
  }
}

// Function to initialize the database
export async function initializeDatabase() {
  let connection;
  try {
    // Retry to connect to MySQL
    connection = await connectWithRetry();

    // Create 'users_details' database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS users_details');
    console.log("Database 'users_details' created or already exists");

    // Close the initial connection to create a new connection with the selected database
    await connection.end();

    // Create a new connection pool with the 'users_details' database
    const pool = mysql.createPool({
      ...db_config,
      database: 'users_details',
    });

    // Define table creation queries
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(40) PRIMARY KEY,
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(20) NOT NULL,
        phone_number VARCHAR(10),
        user_password VARCHAR(255) NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS users_refresh_tokens (
        token_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255),
        refresh_token VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
      )`,
    ];

    // Create the tables if they do not exist
    for (let i = 0; i < tables.length; i++) {
      await pool.query(tables[i]);
    }

    console.log("Tables 'users' and 'users_refresh_tokens' created or already exist");

    return pool;
  } catch (error) {
    console.error("Error initializing database:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end(); // Make sure to close the initial connection
    }
  }
}
