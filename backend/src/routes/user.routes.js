import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  loggedInUser,
  loggOutUser,
  verifyEmailByOtp,
  resetPasswordByVerificationLink
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import sendEmailVerificationOtp from "../helpers/sendEmailVerificationOtp.js";
import sendForgetPasswordLink from "../helpers/sendForgetPasswordLink.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
  {
    name: "profilePicture",
    maxCount: 1
  },
]), registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/get-user-profile").get(jwtVerify, loggedInUser);
router.route("/log-out-user").get(loggOutUser);
router.route("/send-otp-email").post(sendEmailVerificationOtp);
router.route("/verify-email-otp").post(verifyEmailByOtp);
router.route("/forgot-password-email").post(sendForgetPasswordLink);
router.route("/reset-password-by-link").patch(resetPasswordByVerificationLink);

export default router;
