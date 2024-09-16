import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
const generateRefreshAndAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User doesnot exist "));
    }
    const accesstoken = user.generateAcessToken();
    const refreshtoken = user.generateRefreshToken();
    return { accesstoken, refreshtoken };
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Something went wrong while generating ref and access tokens"
        )
      );
  }
};
export { generateRefreshAndAccessTokens };
