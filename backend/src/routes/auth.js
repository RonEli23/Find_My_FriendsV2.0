import express from 'express';
const router = express.Router();

import {handleSignIn} from "../controllers/auth.controller.js"
import { validate } from "../middlewares/validator.middleware.js";

router.post('/', validate('handleSignIn'),handleSignIn);

export default router;