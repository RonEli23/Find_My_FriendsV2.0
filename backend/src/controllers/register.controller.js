import bcrypt from "bcrypt";
import db_user_details from "../sql/sqlConnection.js";
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
            db_user_details.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', [email], async (err, result) => {
                    if (err) {
                            res.send(err.message);
                            console.log(err.message);
                    }

                    if (result[0].count > 0) {
                            res.send({ message: "User already exists" });
                    }

                    else {
                            // Hash the user's password
                            const hash = await bcrypt.hash(user_password, 10);
                            db_user_details.query('INSERT INTO users (email, first_name, last_name, phone_number, user_password) VALUES (?,?,?,?,?)', [email, first_name, last_name, phone_number, hash], (err, result) => {
                                    if (err) {
                                            res.send(err.message);
                                            console.log(err.message);
                                    }
                                    res.send(result);
                            });
                    }
            });
    }
    catch (err) {
            res.send(err.message);
            console.log(err.message);
    }
};