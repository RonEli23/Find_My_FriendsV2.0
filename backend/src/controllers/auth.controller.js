import { validationResult } from "express-validator";
import { mysqlPool } from "../../app.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
const accessSecretKey = process.env.ACCESS_SECRET_KEY;

// Function to generate a JWT
export const generateAccessToken = (user) => {
  const payload = { userEmail: user.email };
  const options = { expiresIn: "15m" };
  return jwt.sign(payload, accessSecretKey, options);
};

export const generateRefreshToken = (user) => {
  const payload = { userEmail: user.email };
  const options = { expiresIn: "1d" };
  return jwt.sign(payload, refreshSecretKey, options);
};

// SignIn
export const handleSignIn = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  const { email, user_password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Validation errors
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const pool = mysqlPool;

    const [result] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (result.length > 0) {
      let user = result[0];
      const isMatch = await bcrypt.compare(user_password, user.user_password);
      if (isMatch) {
        //Generate an access token
        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        if (cookies?.jwt) {
          /*User logs in but never uses RT and does not logout 
          2) RT is stolen
          3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in*/
          const refreshToken = cookies.jwt;
          const [foundToken] = await pool.query(
            "SELECT * FROM users_refresh_tokens WHERE refresh_token = ?",
            [refreshToken]
          );

          // Detected refresh token reuse!
          if (!foundToken.length) {
            console.log('Attempted refresh token reuse at login!');
            // Clear out ALL previous refresh tokens
            await clearAllRefreshTokens(user.email);
          } else {
            await deleteRefreshToken(refreshToken);
          }

          res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

        }

        const insertResult = await pool.query(
          "INSERT INTO users_refresh_tokens (email, refresh_token) VALUES (?, ?)",
          [email, newRefreshToken]
        );

        // Check if the update was successful
        if (insertResult[0].affectedRows > 0) {
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true
          });
          console.log("Updated refresh token");
          return res.json({ ...user, accessToken });
        } else {
          return res.status(404).json("User not found"); // Adjust the status code and message accordingly
        }
      } else {
        return res.status(401).json({ message: "Password is not the same" });
      }
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error handling signIn:", err);
    return res.status(500).json("Internal Server Error");
  }
};



async function deleteRefreshToken(refreshToken) {
  const pool = mysqlPool;
  try {
    const deleteResult = await pool.query(
      "DELETE FROM users_refresh_tokens WHERE refresh_token = ?",
      [refreshToken]
    );
    if (deleteResult[0].affectedRows > 0) {
      console.log("Refresh token deleted successfully");
    } else {
      console.log("No refresh tokens found for this token");
    }
  } catch (err) {
    console.error("Error deleting refresh token:", err);
  }
}

async function clearAllRefreshTokens(email) {
  const pool = mysqlPool;
  try {
    await pool.query(
      "DELETE FROM users_refresh_tokens WHERE email = ?",
      [email]
    );
    console.log("All refresh tokens deleted successfully for user:", email);
  } catch (err) {
    console.error("Error clearing all refresh tokens:", err);
  }
}
