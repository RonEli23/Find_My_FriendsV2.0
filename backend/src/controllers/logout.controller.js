import db_user_details from "../sql/sqlConnection.js";

/**
 * Handles the logout logic.
 * Clears the refresh token from the database and clears the cookie on the client side.
 */
export const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  console.log(JSON.stringify(cookies));
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;

  try {
    const pool = await db_user_details;

    const [result] = await pool.query(
      "SELECT * FROM users_refresh_tokens WHERE refresh_token = ?",
      [refreshToken]
    );

    if (result.length > 0) {
      // Clear the refresh token in the database
      await deleteRefreshToken(pool, refreshToken);

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204); // No content
    } else {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204); // No content
    }
  } catch (err) {
    console.error("Error handling logout:", err);
    return res.status(500).send("Internal Server Error");
  }
};

/**
 * Deletes a refresh token from the database.
 * @param {object} pool - The database pool.
 * @param {string} refreshToken - The refresh token to delete.
 */
async function deleteRefreshToken(pool, refreshToken) {
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
