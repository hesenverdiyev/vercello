import express from "express";
import * as userController from "../controllers/userController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as otpController from "../controllers/otpController.js";

const router = express.Router();


router.route('/register').post(userController.createUser);
router.route('/otpcodesend').post(otpController.otpCodeSend);
router.route('/otpverify').post(otpController.otpVerify);
router.route('/resetpassword').post(userController.resetPassword);
router.route('/login').post(userController.loginUser);

export default router;