import express from 'express';
import router from './src/routes/route.js';
import cors from 'cors';
import { } from 'dotenv/config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import {verifyJWT} from "../middlewares/verifyJWT.middleware.js";

const port = process.env.PORT || 8080;
const uri_mongo = process.env.MONGODB_URI_LOCAL;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./pets'));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/register', require('./routes/register')); // change from userSignUp at front
app.use('/auth', require('./routes/auth')); // change from userSignIn at front
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/requests', require('./routes/api/requests'));
app.use('/users', require('./routes/api/users'));
app.use('/data', require('./routes/api/internalData'));

//app.use('/route', router);

const connection = async () => {
  const uri = uri_mongo;
  await mongoose.connect(uri);
  app.listen(port, () => console.log(`Listen on port ${port}`));
}
connection().catch(err => console.log(err.message));