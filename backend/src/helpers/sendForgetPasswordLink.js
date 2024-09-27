import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { mailSender } from "../utils/mailSender.js";
import {validateEmail} from "../helpers/test.regex.js";
import crypto from "crypto"
const sendForgetPasswordLink = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(new ApiError(400, "email is required"));
  }
  if (!validateEmail(email)) {
    return res.status(407).json(new ApiError(407, "email is not valid"));
  }
  const checkUserPresent = await User.findOne({ email });
  if(!checkUserPresent){
    return res.status(400).json(new ApiError(400, "User not found"))
  }
  let resetPasswordToken;
  let user
  resetPasswordToken = crypto.randomBytes(20).toString("hex"); 
  user = await User.findOne({resetPasswordToken})
  while(user){
    resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user = await User.findOne({resetPasswordToken})
  }
  const updateUser = await User.findOneAndUpdate(
    {email},
    {
        resetPasswordToken,
        resetPasswordTokenExpiry:Date.now()+ 2*60*1000,
    },
    {
        new:true
    }
  )
  const url = `${process.env.CORS_ORIGIN}/update-password/${resetPasswordToken}`
  await mailSender(email,"Password Reset Link",`Your Link for email verification is ${url}. Please click this url to reset your password.`);
  return res
    .status(201)
    .json(new ApiResponse(201, {resetPasswordToken}, "Email sent successfully, please check email and change pwd"));
});
export default sendForgetPasswordLink;
