import jwt from 'jsonwebtoken';

const accessSecretKey = process.env.ACCESS_SECRET_KEY;

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    console.log(token);
    jwt.verify(
        token,
        accessSecretKey,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            //req.user = decoded.username; //notice - maby will cause some problems
            next();
        }
    );
}
