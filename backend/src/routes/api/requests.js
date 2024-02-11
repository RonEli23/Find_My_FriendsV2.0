import express from 'express';
const router = express.Router();
import { handlePetImage, handlePetDetails } from '../../controllers/pet.controller.js';
import { handleContactUs, handleContactUser } from "../../controllers/user.controller.js";
import { validate } from "../../middlewares/validator.middleware.js";

router.post("/uploadImage", handlePetImage);

router.post("/petDetails", validate('handlePetDetails'), handlePetDetails);

router.route("/contactParents").get(handleContactUser);  // was POST


export default router;