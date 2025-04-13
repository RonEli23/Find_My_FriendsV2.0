import { mysqlPool } from "../../app.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "./auth.controller.js";

const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

// Handler function for refreshing access tokens
export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  
  
  if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  try {
    const pool = mysqlPool;

    const [result] = await pool.query(
      "SELECT * FROM users INNER JOIN users_refresh_tokens ON users.email = users_refresh_tokens.email WHERE users_refresh_tokens.refresh_token = ?",
      [refreshToken]
    );
    

    if (result.length > 0) {
      const foundUser = result[0];
      jwt.verify(refreshToken, refreshSecretKey, async (err, decoded) => {
        if (err || foundUser.email !== decoded.userEmail) {
          console.log("expired refresh token")
          await deleteRefreshToken(pool, refreshToken);
          return res.sendStatus(403);
        }

        // Refresh token was valid
        const accessToken = generateAccessToken(foundUser);
        const newRefreshToken = generateRefreshToken(foundUser);

        await storeRefreshToken(pool, foundUser.email, newRefreshToken);
        res.cookie("jwt", newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true });
        return res.json({ ...foundUser, accessToken });
      });

    } else {
      // Detected refresh token reuse
      const decoded = jwt.decode(refreshToken);
      if (!decoded || !decoded.userEmail) return res.sendStatus(403);

      const [hackedUser] = await pool.query("SELECT * FROM users WHERE email = ?", [decoded.userEmail]);
      if (hackedUser.length > 0) {
        const userEmail = hackedUser[0].email;
        await deleteRefreshTokenByEmail(pool, userEmail);
      }

      return res.sendStatus(403); // Forbidden
    }
  } catch (err) {
    console.error("Error handling refresh token:", err);
    return res.status(500).send("Internal Server Error");
  }
};

// Function to delete a refresh token by token value
async function deleteRefreshToken(pool, refreshToken) {
  try {
    const [deleteResult] = await pool.query(
      "DELETE FROM users_refresh_tokens WHERE refresh_token = ?",
      [refreshToken]
    );
    if (deleteResult.affectedRows > 0) {
      console.log("Refresh token deleted successfully");
    } else {
      console.log("No refresh tokens found for this token");
    }
  } catch (err) {
    console.error("Error deleting refresh token:", err);
  }
}

// Function to delete all refresh tokens for a given email
async function deleteRefreshTokenByEmail(pool, email) {
  try {
    const [deleteResult] = await pool.query(
      "DELETE FROM users_refresh_tokens WHERE email = ?",
      [email]
    );
    if (deleteResult.affectedRows > 0) {
      console.log("Refresh tokens deleted successfully");
    } else {
      console.log("No refresh tokens found for this email");
    }
  } catch (err) {
    console.error("Error deleting refresh tokens:", err);
  }
}

// Function to store a new refresh token for a user
async function storeRefreshToken(pool, email, refreshToken) {
  try {
    const [insertResult] = await pool.query(
      "INSERT INTO users_refresh_tokens (email, refresh_token) VALUES (?, ?)",
      [email, refreshToken]
    );
    if (insertResult.affectedRows > 0) {
      console.log("Refresh token stored successfully");
    } else {
      console.log("Failed to store refresh token");
    }
  } catch (err) {
    console.error("Error storing refresh token:", err);
  }
}
