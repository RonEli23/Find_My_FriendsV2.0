import bcrypt from "bcrypt";
import { mysqlPool } from "../../app.js";
import { validationResult } from "express-validator";

// SignUp
export const handleSignUp = async (req, res) => {
        const { email, first_name, last_name, phone_number, user_password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                // Validation errors
                return res.status(400).json({ errors: errors.array() });
        }

        try {
                const pool = await mysqlPool;
                const [existingUsers] = await pool.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', [email]);

                if (existingUsers[0].count > 0) {
                        return res.status(409).json({ message: "User already exists" });
                }

                // Hash the user's password
                const hash = await bcrypt.hash(user_password, 10);

                const [insertResult] = await pool.query(
                        'INSERT INTO users (email, first_name, last_name, phone_number, user_password) VALUES (?,?,?,?,?)',
                        [email, first_name, last_name, phone_number, hash]
                );

                if (insertResult.affectedRows > 0) {
                        // User successfully created
                        return res.status(201).json({ message: "User created successfully" });
                } else {
                        // Failed to create user
                        return res.status(500).json({ message: "Failed to create user" });
                }
        } catch (err) {
                // Handle errors
                console.error("Error handling signUp:", err);
                return res.status(500).json({ message: "Internal Server Error" });
        }
};
