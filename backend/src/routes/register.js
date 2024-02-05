import express from 'express';
const router = express.Router();
import {handleSignUp} from "../controllers/register.controller.js";
import { validate } from "../middlewares/validator.middleware.js";

router.post('/', validate("handleSignUp"),handleSignUp);

export default router;