import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const returnUsers = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.files.profilePicture[0].path
  console.log("coverImageLocalPath", coverImageLocalPath)
})
export {
  returnUsers
}