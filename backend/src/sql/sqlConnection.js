import mysql from 'mysql2/promise';

const db_config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

async function initializeDatabase() {
  try {
    // Create a connection to MySQL server
    const connection = await mysql.createConnection({
      host: db_config.host,
      user: db_config.user,
      password: db_config.password,
    });

    // Create 'users_details' database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS users_details');
    console.log("Database 'users_details' created or already exists");

    // Close the connection to create a new connection with the selected database
    await connection.end();

    // Create a new connection with the 'users_details' database
    const pool = mysql.createPool({
      ...db_config,
      database: 'users_details',
    });

    // Use the pool to create tables
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

    for (let i = 0; i < tables.length; i++) {
      await pool.query(tables[i]);
    }

    console.log("Tables 'users' and 'users_refresh_tokens' created or already exist");

    return pool;
  } catch (error) {
    console.error("Error initializing database:", error.message);
    throw error;
  }
}

const db_user_details = initializeDatabase();

export default db_user_details;
