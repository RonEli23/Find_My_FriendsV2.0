import { validationResult } from "express-validator";
import { mysqlPool } from "../../app.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { pet_details_schema } from "../models/pet_details.js";

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


// Delete all users
export const handleDeleteAllUser = async (req, res) => {
        try {
                await mysqlPool.query("DELETE FROM users");
                res.status(200).send("All users deleted successfully.");
        } catch (err) {
                console.error("Error deleting users:", err);
                res.status(500).send(err.message);
        }
}

// Delete user
export const handleDeleteUser = async (req, res) => {
        const email = req.params.email;
        if (!email) {
                return res.status(400).send("Email is required");
        }
        try {
                const [result] = await mysqlPool.query("DELETE FROM users WHERE email = ?", [email]);

                if (result.affectedRows === 0) {
                        return res.status(404).send("User not found");
                }

                const mongoResult = await newPet_model.deleteMany({ userEmail: email });

                res.status(200).json({ mysqlDeleted: result.affectedRows, mongoDeleted: mongoResult.deletedCount });
        } catch (err) {
                console.error("Error deleting user:", err);
                res.status(500).send(err.message);
        }
}

// Get all users
export const handleGetAllUsers = async (req, res) => {
        try {
                const [users] = await mysqlPool.query("SELECT * FROM users");
                res.json(users);
        } catch (err) {
                console.error("Error fetching users:", err);
                res.status(500).send(err.message);
        }
}

export const handleContactUser = async (req, res) => {
        const { email } = req.query;

        if (!email) {
                return res.status(400).json({ message: "Email is required" });
        }

        try {
                const pool = mysqlPool;

                const [result] = await pool.query('SELECT email, first_name, last_name, phone_number FROM users WHERE email = ?', [email]);

                if (result.length === 0) {
                        return res.status(404).send("User not found");
                }

                const user = result[0];
                return res.send(user);
        } catch (err) {
                console.error("Error in handleContactUser:", err);
                return res.status(500).send("Internal Server Error");
        }
};

export const handleUserInfo = async (req, res) => {
        const email = req.query.email;
        if (!email) {
                return res.status(400).send("Email is required");
        }

        try {
                const pets = await newPet_model.find({ userEmail: email }).exec();
                res.json(pets || []);
        } catch (err) {
                console.error("Error fetching user pets:", err);
                res.status(500).send(err.message);
        }
}

export const handleContactUs = (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
        }

        const { userFirstName: firstName, userLastName: lastName, userEmail: email, message } = req.body;

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
                        console.error("Error sending email:", error);
                        return res.status(500).json({ status: "ERROR", message: error.message });
                }
                res.json({ status: "Message Sent" });
        });
}

