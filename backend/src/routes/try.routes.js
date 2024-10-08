import { Router } from "express";
import { returnUsers } from "../controllers/try.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/users").get(jwtVerify,returnUsers);

export default router;