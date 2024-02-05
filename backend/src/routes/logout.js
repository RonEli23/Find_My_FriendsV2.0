import express from 'express';
const router = express.Router();
import {handleLogout} from "../controllers/logout.controller.js"

router.post('/', handleLogout);

export default router;