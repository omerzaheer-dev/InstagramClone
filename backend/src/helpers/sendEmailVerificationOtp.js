import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import { MaxLimit } from "../models/MaxLimit.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  validateEmail,
  validateOtp,
} from "../helpers/test.regex.js";
function isWithinSame24Hours(dateArray) {
  const timestamps = dateArray.map(date => date.getTime());
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);
  return (maxTimestamp - minTimestamp < 86400000);
}
const canSendOtp = async (userId) => {
  const otpLimit = 5;
  let maxLimitModel = await MaxLimit.findOne({ userId });
  if (!maxLimitModel) {
    await MaxLimit.create({
      userId,
      otpRequestsTimestamp: [new Date()],
    });
    return true;
  }
  if (maxLimitModel.otpRequestsTimestamp.length >= otpLimit) {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneMinAgo = new Date(now.getTime() - 1 * 60 * 1000);
    const lastOtpTimestamps = maxLimitModel.otpRequestsTimestamp.slice(-otpLimit);
    if (isWithinSame24Hours(lastOtpTimestamps) && oneDayAgo <= lastOtpTimestamps[otpLimit - 1]) {
      return false;
    } else {
      maxLimitModel.otpRequestsTimestamp.push(new Date());
      await maxLimitModel.save();
      return true;
    }
  } else {
    maxLimitModel.otpRequestsTimestamp.push(new Date());
    await maxLimitModel.save();
    return true;
  }

}
const sendEmailVerificationOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required")
  }
  if (!validateEmail(email)) {
    throw new ApiError(407, "email is not valid")
  }
  const checkUserPresent = await User.findOne({ email });
  if (!checkUserPresent || checkUserPresent.isVerified === true) {
    throw new ApiError(400, "no user found or user is verified")
  }
  const canSndOtp = await canSendOtp(checkUserPresent._id)
  if (!canSndOtp) {
    throw new ApiError(407, "You have reached maximum limit of sending OTP please try again after 24 hours")
  }
  let otp = Math.floor(1000 + Math.random() * 9000);
  while (!validateOtp(otp)) {
    otp = Math.floor(1000 + Math.random() * 9000);
  }
  let result = await Otp.findOne({ otp });
  while (result) {
    otp = Math.floor(1000 + Math.random() * 9000);
    while (!validateOtp(otp)) {
      otp = Math.floor(1000 + Math.random() * 9000);
    }
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
    throw new ApiError(400, "otp model not created")
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Otp sent successfully"));
});
export default sendEmailVerificationOtp;
