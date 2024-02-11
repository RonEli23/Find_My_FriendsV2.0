import express from 'express';
const router = express.Router();

import { handleContactUs} from "../../controllers/user.controller.js";
import { handlePetImage } from '../../controllers/pet.controller.js';
import { validate } from "../../middlewares/validator.middleware.js";


router.post("/contactUs", validate("handleContactUs"), handleContactUs)

router.post("/uploadImage", handlePetImage);


export default router;