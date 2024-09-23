import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
const isTokenExpire = async (token) => {
  try {
    if (!token) {
      return true;
    }
    const decodedToken = jwt.decode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    return res
      .status(407)
      .json(new ApiError(407, "error while token decoding"));
  }
};
export default isTokenExpire;
