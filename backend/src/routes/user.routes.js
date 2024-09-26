import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  loggedInUser,
  loggOutUser,
  verifyEmailByOtp,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import sendEmailVerificationOtp from "../helpers/sendEmailVerificationOtp.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/get-user-profile").get(jwtVerify, loggedInUser);
router.route("/log-out-user").post(jwtVerify, loggOutUser);
router.route("/send-otp-email").post(sendEmailVerificationOtp);
router.route("/verify-email-otp").post(verifyEmailByOtp);

export default router;
