import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

import userRoutes from "./routes/user.routes.js";
import tryRoutes from "./routes/try.routes.js"
//routes decelaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/try", tryRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
export { app };
