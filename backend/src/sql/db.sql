CREATE DATABASE users_details;
use users_details;
CREATE TABLE users (email VARCHAR(40) PRIMARY KEY, first_name VARCHAR(20) NOT NULL, last_name VARCHAR(20) NOT NULL, phone_number VARCHAR(10), user_password VARCHAR(255) NOT NULL, refresh_token VARCHAR(200));