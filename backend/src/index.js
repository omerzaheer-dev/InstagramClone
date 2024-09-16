import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});
import { app } from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection failed ", err);
  });
