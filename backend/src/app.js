import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(passport.initialize());
const publicDirPath = process.cwd();
app.use(express.static(`${publicDirPath}/src/public`));
app.use(cookieParser());

// routes
import userRoutes from "./routes/user.routes.js";
import tryRoutes from "./routes/try.routes.js"
//routes decelaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/try", tryRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
export { app };
