import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  loggedInUser,
} from "../controllers/user.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/get-user-profile").get(jwtVerify, loggedInUser);

export default router;
