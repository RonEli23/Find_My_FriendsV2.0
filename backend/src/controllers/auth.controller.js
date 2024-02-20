import { validationResult } from "express-validator";
import db_user_details from "../sql/sqlConnection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
const accessSecretKey = process.env.ACCESS_SECRET_KEY;

// Function to generate a JWT
const generateAccessToken = (user) => {
  // JWT payload containing user information
  const payload = {
    username: user.first_name + " " + user.last_name,
  };

  // JWT options: expiresIn specifies the token's expiration time (e.g., 1 hour)
  const options = {
    expiresIn: "1m",
  };

  // Generate and return the JWT
  const token = jwt.sign(payload, accessSecretKey, options);
  return token;
};

const generateRefreshToken = (user) => {
  // JWT payload containing user information
  const payload = {
    username: user.first_name + " " + user.last_name,
  };

  // JWT options: expiresIn specifies the token's expiration time (e.g., 1 hour)
  const options = {
    expiresIn: "1.5m",
  };

  // Generate and return the JWT
  const token = jwt.sign(payload, refreshSecretKey, options);
  return token;
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
    db_user_details.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          res.send(err.message);
          console.log(err.message);
        }

        if (result.length > 0) {
          let user = result[0];
          const isMatch = await bcrypt.compare(
            user_password,
            result[0].user_password
          );
          if (isMatch) {
            //Generate an access token
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            db_user_details.query("UPDATE users SET refresh_token = ? WHERE email = ?", [refreshToken, email], (err, result) => {
                if (err) {
                    console.error("Error updating refresh token:", err);
                    res.status(500).send("Internal Server Error");
                } else {
                    // Check if the update was successful
                    if (result.affectedRows > 0) {
                        res.cookie("jwt", refreshToken, { 
                          httpOnly: true,
                          sameSite: 'None',
                          secure: true 
                        });
                        delete user.refresh_token;
                        res.json({ ...user, accessToken });
                    } else {
                        res.status(404).send("User not found"); // Adjust the status code and message accordingly
                    }
                }
            });
 
            // res.send(result[0]);
          } else {
            res.send({ message: "Password is not the same" });
          }
        } else {
          res.send({ message: "User not found" });
        }
      }
    );
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
};
