import { validationResult } from "express-validator";
import db_user_details from "../sql/sqlConnection.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { pet_details_schema } from "../models/pet_details.js";
import bcrypt from "bcrypt";

const newPet_model = mongoose.model("newPet", pet_details_schema);

const conMail = process.env.CON_MAIL;
const conPas = process.env.CON_PAS;

const contactEmail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
                user: conMail,
                pass: conPas,
        },
});

contactEmail.verify((error) => {
        if (error) {
                console.log(error);
        } else {
                console.log("Ready to Send");
        }
});

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

// SignIn
export const handleSignIn = async (req, res) => {
        const { email, user_password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                // Validation errors
                return res.status(400).json({ errors: errors.array() });
        }

        try {
                // db_user_details.query('SELECT * FROM users WHERE email = ? AND user_password = ?', [email, user_password], (err, result) => {
                db_user_details.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
                        if (err) {
                                res.send(err.message);
                                console.log(err.message);
                        }

                        if (result.length > 0) {
                                const isMatch = await bcrypt.compare(user_password, result[0].user_password);
                                if (isMatch) {
                                        res.send(result[0]);
                                }
                                else {
                                        res.send({ message: "Password is not the same" });
                                }
                        } else {
                                res.send({ message: "User not found" });
                        }
                });
        }
        catch (err) {
                res.send(err.message);
                console.log(err.message);
        }
};

// Delete all users
export const handleDeleteAllUser = async (req, res) => {
        db_user_details.query("DELETE FROM users", (err) => {
                if (err) {
                        res.send(err.message);
                        console.log(err.message);
                }
        });
}

// Delete user
export const handleDeleteUser = async (req, res) => {
        const { email } = req.body;
        db_user_details.query("DELETE FROM users WHERE email = ?", [email], async (err) => {
                if (err) {
                        console.log(err.message);
                        res.send(err.message);
                }
                else {
                        try {
                                let result = await newPet_model.deleteMany({ userEmail: email })
                                res.status(200).json(result);
                        }
                        catch (err) {
                                res.send(err.message);
                        }
                }
        });
}

// Get all users
export const handleGetAllUsers = async (req, res) => {
        try {
                db_user_details.query('SELECT * FROM users', (err, result) => {
                        if (err) {
                                res.send(err.message);
                                console.log(err.message);
                        }
                        res.send(result);
                });
        }
        catch (err) {
                console.log(err.message);
        }
}

export const handleContactUser = async (req, res) => {
        const { email } = req.body;
        try {
                db_user_details.query('SELECT email, first_name, last_name, phone_number FROM users WHERE email = ?', [email], (err, result) => {
                        if (err) {
                                console.log("err: " + err.message);
                                res.send(err.message);
                        }
                        else if (result[0] == undefined) {
                                res.send("user not found");
                        }
                        res.send(result[0]);
                });
        }
        catch (err) {
                console.log(err.message);
        }
}

export const handleUserInfo = async (req, res) => {
        const email = req.query.email;
        try {
                //mongo
                const query = newPet_model.find({ userEmail: email })
                const result = await query.exec();
                res.json(result);
        }
        catch (err) {
                console.log(err.message);
        }
}

export const handleContactUs = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                // Validation errors
                return res.status(400).json({ errors: errors.array() });
        }
        const firstName = req.body.userFirstName;
        const lastName = req.body.userLastName;
        const email = req.body.userEmail;
        const message = req.body.message;
        const mail = {
                from: `${firstName} ${lastName}`,
                to: conMail,
                subject: `יש לך פנייה חדשה מ-${firstName} ${lastName}`,
                html: `<p>שם: ${firstName} ${lastName}</p>
                 <p>אימייל: ${email}</p>
                 <p>תוכן ההודעה: ${message}</p>`,
        };

        contactEmail.sendMail(mail, (error) => {
                if (error) {
                        res.json({ status: "ERROR" });
                } else {
                        res.json({ status: "Message Sent" });
                }
        });
}

