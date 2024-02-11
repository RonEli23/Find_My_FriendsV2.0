import express from 'express';
const router = express.Router();
import { handleDeleteAllUser, handleGetAllUsers, handleUserInfo, handleDeleteUser } from '../../controllers/user.controller.js';

router.route('/')
    .get(handleGetAllUsers)
    //.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    //.put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    .delete(/*verifyRoles(ROLES_LIST.Admin), */handleDeleteAllUser);

router.route('/:email')
    .delete(handleDeleteUser)
    .get(handleUserInfo)




export default router;