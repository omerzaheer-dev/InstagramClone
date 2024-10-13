import { Router } from "express";
import { returnUsers } from "../controllers/try.controller.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/users").post(upload.fields([
    {
        name: "profilePicture",
        maxCount: 1
    },
]), returnUsers);

export default router;