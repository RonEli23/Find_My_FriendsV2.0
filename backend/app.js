import express from 'express';
import cors from 'cors';
import { corsOptions } from './src/config/corsOptions.js';
import { } from 'dotenv/config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import registerRouter from "./src/routes/register.js";
import authRouter from "./src/routes/auth.js";
import refreshRouter from "./src/routes/refresh.js";
import logoutRouter from "./src/routes/logout.js";
import dataRouter from "./src/routes/internalData.js";
import publicRequestsRouter from "./src/routes/api/publicRequests.js";
import requestsRouter from "./src/routes/api/requests.js";
import usersRouter from "./src/routes/api/users.js";
import internalDataRouter from "./src/routes/internalData.js";
import { verifyJWT } from './src/middlewares/verifyJWT.middleware.js'

const port = process.env.PORT || 8080;
const uri_mongo = process.env.MONGODB_URI_LOCAL;
const app = express();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./pets'));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/register', registerRouter); // change from userSignUp at front
app.use('/auth', authRouter); // change from userSignIn at front
app.use('/refresh', refreshRouter);
app.use('/logout', logoutRouter);
app.use("/internalData", internalDataRouter);
app.use('/publicRequests', publicRequestsRouter);

app.use(verifyJWT);
app.use('/requests', requestsRouter);
app.use('/users', usersRouter);
app.use('/data', dataRouter);

//app.use('/route', router);

const connection = async () => {
  const uri = uri_mongo;
  await mongoose.connect(uri);
  app.listen(port, () => console.log(`Listen on port ${port}`));
}
connection().catch(err => console.log(err.message));