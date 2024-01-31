import express from 'express';
const router = express.Router();

import { handlePetImage, handlePetDetails, handleMostFoundPets } from '../controllers/pet.controller.js';
import { handleSignUp, handleSignIn, handleDeleteAllUser, handleGetAllUsers, handleContactUser, handleUserInfo, handleDeleteUser, handleContactUs } from '../controllers/user.controller.js';
import { validate } from "../middlewares/validator.middleware.js";

router.post("/uploadImage", handlePetImage);

router.post("/petDetails", validate('handlePetDetails'), handlePetDetails);

router.get("/MostFoundPets", handleMostFoundPets);

router.post("/userSignUp", validate('handleSignUp'), handleSignUp);

router.post("/userSignIn", validate('handleSignIn'), handleSignIn);

router.post("/deleteUser", handleDeleteUser);

router.post("/deleteAll", handleDeleteAllUser); // run: curl http://localhost:8080/route/deleteAll -X POST

router.post("/conactParents", handleContactUser)

router.post("/contact", validate("handleContactUs"), handleContactUs)

router.get("/userInfo", handleUserInfo)

router.get("/getAll", handleGetAllUsers);

export default router;