import express from 'express';
const router = express.Router();
import { handleMostFoundPets } from "../../controllers/pet.controller.js";
import { handleContactUser } from "../../controllers/user.controller.js";

router.route("/MostFoundPets").get(handleMostFoundPets);

router.route("/contactParents").get(handleContactUser);  // was POST

export default router;
