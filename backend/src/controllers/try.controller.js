import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const returnUsers = asyncHandler(async (req,res)=>{
    const users = await User.find();
    if(!users){
    return res
      .status(400)
      .json(new ApiError(400, "no user found"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,users,"User registered successfully"));
})
export {
    returnUsers
}