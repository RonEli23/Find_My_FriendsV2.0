import mysql from 'mysql2';

const db_user_details = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
});

const database_name = process.env.DATABASE;

// Connect to MySQL server
db_user_details.connect((err) => {
        if (err) throw err;
        console.log("Connected to MySQL database");

        // Query to get list of all the databases of the user
        db_user_details.query('SHOW DATABASES', (err, result) => {
                if (err) throw err;

                // Extract the database names from the result
                const database = result.map(result => result.Database);

                 // Check if DB exists
                 if (database.includes(database_name)) {
                        console.log("Database already exists");
                }
    

                // Create users_details database if it doesn't exist
                else {
                        const user_details_database = 'CREATE DATABASE IF NOT EXISTS users_details';
                        db_user_details.query(user_details_database, (err) => {
                                if (err) throw err;
                                console.log("user_details database created");
                        });
                }

                // Use the database
                db_user_details.query(`USE ${database_name}`, (err) => {
                        if (err) throw err;

                        // Query to get list of all the tables of the user
                        db_user_details.query('SHOW TABLES', (err, result) => {
                                if (err) throw err;

                                // Extract the table names from the result
                                const tables = result.map(row => Object.values(row)[0]);

                                // Check if the user exists
                                if (tables.includes('users') && tables.includes('users_refresh_tokens')) {
                                        console.log("Tables already exist");
                                }

                                // Create user_table if it doesn't exist
                                else {
                                        const user_table = 'CREATE TABLE users (email VARCHAR(40) PRIMARY KEY, first_name VARCHAR(20) NOT NULL, last_name VARCHAR(20) NOT NULL, phone_number VARCHAR(10), user_password VARCHAR(255) NOT NULL)';
                                        db_user_details.query(user_table, (err) => {
                                                if (err) throw err;
                                                console.log("users Table created");
                                        });

                                        const users_refresh_tokens = 'CREATE TABLE users_refresh_tokens (token_id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255),refresh_token VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE)';
                                        db_user_details.query(users_refresh_tokens, (err) => {
                                                if (err) throw err;
                                                console.log("users_refresh_tokens table created");
                                        });
                                }
                        });
                });
        });
});

export default db_user_details;