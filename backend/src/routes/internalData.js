import express from 'express';
const router = express.Router();
import { handleFinderOfTheMonth } from "../controllers/pet.controller.js";

router.route("/finderOfTheMonth").get(handleFinderOfTheMonth);

export default router;
