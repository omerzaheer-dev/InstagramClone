import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const jwtVerify = async (req, res, next) => {
  try {
    const Token =
      req?.headers?.authorization?.replace("Bearer ", "") ||
      req?.headers?.Authorization?.replace("Bearer ", "");
      // req?.cookies?.accessToken;
    if (!Token) {
      return res.status(401).json(new ApiError(401, "Token not available"));
    }
    jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      const user = await User.findById(decoded._id).select(
        "-password -refreshTokens"
      );
      if (!user) {
        return res.status(403).json(new ApiError(403, "Token is expired"));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res
      .status(409)
      .json(new ApiError(409, `invalid access token ${error}`));
  }
};
const IsAdmin = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    if (!userRole || !userRole.includes("admin")) {
      return res.status(409).json(new ApiError(409, "User Role is not Admin"));
    }
    next();
  } catch (error) {
    return res.status(401).json(new ApiError(401, "something went wrong"));
  }
};
export { jwtVerify, IsAdmin };
