import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
const generateRefreshAndAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User doesnot exist ")
    }
    const accesstoken = user.generateAcessToken();
    const refreshtoken = user.generateRefreshToken();
    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating ref and access tokens")
  }
};
export { generateRefreshAndAccessTokens };
