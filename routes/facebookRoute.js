import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();


router.route('/').get(userController.UserFromFacebook);
// router.route('/').get(userController.createUserWithFacebook);


export default router;