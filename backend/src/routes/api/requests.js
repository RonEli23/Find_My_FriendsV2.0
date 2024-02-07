import express from 'express';
const router = express.Router();
import { handlePetImage, handlePetDetails } from '../../controllers/pet.controller.js';
import { handleContactUs } from "../../controllers/user.controller.js";
import { validate } from "../../middlewares/validator.middleware.js";

router.post("/contact", validate("handleContactUs"), handleContactUs)

router.post("/uploadImage", handlePetImage);

router.post("/petDetails", validate('handlePetDetails'), handlePetDetails);

export default router;