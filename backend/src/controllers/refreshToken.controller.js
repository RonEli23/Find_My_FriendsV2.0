import db_user_details from "../sql/sqlConnection.js";
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
    expiresIn: "10s",
  };

  // Generate and return the JWT
  const token = jwt.sign(payload, accessSecretKey, options);
  return token;
};

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
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
          // evaluate jwt
          jwt.verify(refreshToken, refreshSecretKey, (err, decoded) => {
            let username = foundUser.first_name + " " + foundUser.last_name;
            if (err || username !== decoded.username)
              return res.sendStatus(403);

            const accessToken = generateAccessToken(foundUser);

            res.json({ accessToken });
          });
        } else {
          return res.sendStatus(403); //Forbidden
        }
      }
    );
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
};
