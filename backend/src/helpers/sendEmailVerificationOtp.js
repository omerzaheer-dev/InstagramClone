import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const sendEmailVerificationOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(new ApiError(400, "email is required"));
  }
  const checkUserPresent = await User.findOne({ email });
  if (!checkUserPresent || checkUserPresent.isVerified === true) {
    return res
      .status(400)
      .json(new ApiError(400, "no user found or user is verified"));
  }
  let otp = Math.floor(1000 + Math.random() * 9000);
  let result = await Otp.findOne({ otp });
  while (result) {
    otp = Math.floor(1000 + Math.random() * 9000);
    result = await Otp.findOne({ otp });
  }
  const otpWithEmail = await Otp.find({ email });
  if (otpWithEmail) {
    await Otp.updateMany({ email }, { $set: { used: true } });
  }
  const otpModel = await Otp.create({
    email,
    otp,
  });
  if (!otpModel) {
    return res.status(400).json(new ApiError(400, "otp model not created"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Otp sent successfully"));
});
export default sendEmailVerificationOtp;
