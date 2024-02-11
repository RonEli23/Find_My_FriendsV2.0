import express from 'express';
const router = express.Router();
import {handleLogout} from "../controllers/logout.controller.js"

router.get('/', handleLogout);

export default router;