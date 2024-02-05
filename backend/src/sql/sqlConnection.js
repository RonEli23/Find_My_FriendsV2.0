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
                const databases = result.map(result => result.Database);

                // Check if the user exists
                if (databases.includes(database_name)) {
                        console.log("Database already exists");
                }

                // Create users_details database if it doesn't exist
                else {
                        const user_details_database = 'CREATE DATABASE IF NOT EXISTS users_details';
                        db_user_details.query(user_details_database, (err) => {
                                if (err) throw err;
                                console.log("Database created");
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
                                if (tables.includes('users')) {
                                        console.log("Table already exists");
                                }

                                // Create user_table if it doesn't exist
                                else {
                                        const user_table = 'CREATE TABLE users (email VARCHAR(40) PRIMARY KEY, first_name VARCHAR(20) NOT NULL, last_name VARCHAR(20) NOT NULL, phone_number VARCHAR(10), user_password VARCHAR(255) NOT NULL, refresh_token VARCHAR(200))';
                                        db_user_details.query(user_table, (err) => {
                                                if (err) throw err;
                                                console.log("Table created");
                                        });
                                }
                        });
                });
        });
});

export default db_user_details;