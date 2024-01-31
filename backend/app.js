import express from 'express';
import router from './src/routes/route.js';
import cors from 'cors';
import { } from 'dotenv/config';
import mongoose from 'mongoose';

const port = process.env.PORT || 8080;
const uri_mongo = process.env.MONGODB_URI_LOCAL;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./pets'));
app.use(express.json());

app.use('/route', router);

const connection = async () => {
  const uri = uri_mongo;
  await mongoose.connect(uri);
  app.listen(port, () => console.log(`Listen on port ${port}`));
}
connection().catch(err => console.log(err.message));