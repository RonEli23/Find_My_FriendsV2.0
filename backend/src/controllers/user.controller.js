import { validationResult } from "express-validator";
import db_user_details from "../sql/sqlConnection.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { pet_details_schema } from "../models/pet_details.js";
import jwt from "jsonwebtoken";

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
        db_user_details.query("DELETE FROM users", (err) => {
                if (err) {
                        res.send(err.message);
                        console.log(err.message);
                }
        });
}

// Delete user
export const handleDeleteUser = async (req, res) => {
        console.log(req.params);
        const email  = req.params.email;
        console.log("email is" + email);
        if(!email) {res.status(400);}
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
        const { email } = req.query;
        
        try {
          const pool = await db_user_details;
      
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
        console.log("hi")
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

