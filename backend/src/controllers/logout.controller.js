import db_user_details from "../sql/sqlConnection.js";

export const handleLogout = async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  try {
    db_user_details.query(
      "SELECT * FROM users WHERE refresh_token = ?",
      [refreshToken],
      async (err, result) => {
        if (err) {
          res.send(err.message);
          console.log(err.message);
        }

        if (result.length > 0) {
          let foundUser = result[0];
          console.log(foundUser);
          // Delete refreshToken in db
          db_user_details.query("UPDATE users SET refresh_token = ? WHERE email = ?", ["", foundUser.email], async (err, result) => {
            if (err) {
                res.send(err.message);
                console.log(err.message);
              }
          })
         
          res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          });
          res.sendStatus(204);
        } else {
          res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          });
          return res.sendStatus(204);
        }
      }
    );
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
};
