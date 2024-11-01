import { Router } from "express";
import { sendMessage, recieveMessages } from "../controllers/message.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:recieverId/send-message").post(jwtVerify, sendMessage);
router.route("/:recieverId/recieve-message").post(jwtVerify, recieveMessages);
export default router;
