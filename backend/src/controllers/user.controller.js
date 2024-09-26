import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  validatePassword,
  validateEmail,
  validateOtp,
  validateUserName
} from "../helpers/test.regex.js";
import { generateRefreshAndAccessTokens } from "../helpers/generateRefreshAndAccessTokens.js";
import {
  accesstokenOptions,
  refreshtokenOptions,
} from "../utils/AccessRefreshTokenOptions.js";
import jwt from "jsonwebtoken";
import { Otp } from "../models/otp.model.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (
    [email, username, password, confirmPassword].some(
      (field) => field?.trim() === ""
    )
  ) {
    return res.status(409).json(new ApiError(400, "All fields are required"));
  }

  if (!validateEmail(email)) {
    return res.status(407).json(new ApiError(407, "email is not valid"));
  }

  if (password !== confirmPassword) {
    return res
      .status(403)
      .json(new ApiError(403, "Password and confirmPassword dosent match"));
  }

  if (!password || password.length < 8) {
    return res
      .status(401)
      .json(new ApiError(401, "Password must be at least 8 characters long"));
  }

  if (!validatePassword(password)) {
    return res
      .status(403)
      .json(
        new ApiError(
          403,
          "password contains at least one special character and number also"
        )
      );
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    return res
      .status(409)
      .json(new ApiError(409, "User with email or username already exists"));
  }

  const user = await User.create({
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    return res
      .status(500)
      .json(new ApiError(500, "Somthing went wrong while registering user"));
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { emailUsername, password } = req.body;
  if (!emailUsername || !password) {
    return res
      .status(400)
      .json(new ApiError(400, "username and email is required"));
  }
  if (!validateEmail(emailUsername) && !validateUserName(emailUsername)) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid email or username format"));
  }
  const user = await User.findOne({
    $or: [{ email: emailUsername }, { username: emailUsername }],
  });
  if (!user) {
    return res.status(404).json(new ApiError(404, "User doesnot exist "));
  }
  // if (!user.isVerified) {
  //   return res.status(404).json(new ApiError(404, "User is not verified"));
  // }
  if (!password || password.length < 8) {
    return res
      .status(401)
      .json(new ApiError(401, "Password must be at least 8 characters long"));
  }
  if (!validatePassword(password)) {
    return res
      .status(408)
      .json(
        new ApiError(
          408,
          "password contains at least one special character and number also"
        )
      );
  }
  const ValidatePassword = await user.isPasswordValid(password);
  if (!ValidatePassword) {
    return res.status(401).json(new ApiError(401, "Invalid User Cradentials"));
  }
  const { refreshtoken, accesstoken } = await generateRefreshAndAccessTokens(
    user?._id
  );
  const Usr = await User.findById(user?._id);
  if (!Usr) {
    return res.status(404).json(new ApiError(404, "User doesnot exist "));
  }
  let RefreshTokenArray = !req?.cookies?.refreshToken
    ? Usr.refreshTokens
    : Usr.refreshTokens.filter((rt) => rt !== req?.cookies?.refreshToken);
  if (req?.cookies?.refreshToken) {
    const foundToken = await User.findOne({
      refreshTokens: req?.cookies?.refreshToken,
    }).exec();
    if (!foundToken) {
      console.log("attempted refresh token reuse at login!");
      RefreshTokenArray = [];
    }
    res.clearCookie("refreshToken", refreshtokenOptions);
  }
  Usr.refreshTokens = [...RefreshTokenArray, refreshtoken];
  await Usr.save({ validateBeforeSave: false });
  const loggedInUser = await User.findById(Usr?._id).select(
    "-password -refreshTokens -resetPasswordToken -resetPasswordTokenExpiry -createdAt -updatedAt"
  );
  return (
    res
      .status(200)
      // .cookie("accessToken", accesstoken, accesstokenOptions)
      .cookie("refreshToken", refreshtoken, refreshtokenOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accesstoken,
          },
          "User logged in successfully"
        )
      )
  );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken = req?.cookies?.refreshToken;
  if (!incommingRefreshToken) {
    return res.status(401).json(new ApiError(401, "No refresh token"));
  }
  // res.clearCookie("accessToken", accesstokenOptions);
  res.clearCookie("refreshToken", refreshtokenOptions);
  const foundUser = await User.findOne({
    refreshTokens: incommingRefreshToken,
  }).exec();
  if (!foundUser) {
    jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const hackedUser = await User.findById(decoded?._id).exec();
        if (!hackedUser) {
          return res
            .status(401)
            .json(new ApiError(401, "Invalid refresh token"));
        }
        hackedUser.refreshTokens = [];
        await hackedUser.save({ validateBeforeSave: false });
      }
    );
    return res.sendStatus(403);
  }
  const newRefreshTokenArray = foundUser.refreshTokens.filter(
    (rt) => rt !== incommingRefreshToken
  );
  jwt.verify(
    incommingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        foundUser.refreshTokens = [...newRefreshTokenArray];
        await foundUser.save({ validateBeforeSave: false });
      }
      if (err || foundUser.username !== decoded.username) {
        return res.sendStatus(403);
      }
      const user = await User.findById(decoded?._id);
      if (!user) {
        return res.status(401).json(new ApiError(401, "Invalid refresh token"));
      }
      if (!user.refreshTokens.includes(incommingRefreshToken)) {
        return res
          .status(401)
          .json(new ApiError(401, "Refresh token is expired or used"));
      }
      const { refreshtoken, accesstoken } =
        await generateRefreshAndAccessTokens(user._id);
      user.refreshTokens = [...newRefreshTokenArray, refreshtoken];
      await user.save({ validateBeforeSave: false });
      return (
        res
          .status(200)
          // .cookie("accessToken", accesstoken, accesstokenOptions)
          .cookie("refreshToken", refreshtoken, refreshtokenOptions)
          .json(new ApiResponse(200, { accesstoken }, "Access Token Refreshed"))
      );
    }
  );
});

const loggedInUser = asyncHandler(async (req, res) => {
  const loginUser = await User.findById(req.user._id).select(
    "-password -refreshTokens"
  );
  if (!loginUser) {
    return res.status(400).json(new ApiError(400, "user is not available"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, loginUser, "loggedIn user returned"));
});

const loggOutUser = asyncHandler(async (req, res) => {
  const cookies = req?.cookies;
  if (!cookies?.refreshToken) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          loginUser,
          "User is already LoggedOut no refresh token is present in cookies"
        )
      );
  }
  const refreshToken = cookies.refreshToken;
  const foundUser = await User.findOne({ refreshTokens: refreshToken }).exec();
  if (!foundUser) {
    return res
      .status(200)
      .clearCookie("refreshToken", refreshtokenOptions)
      .json(new ApiResponse(200, {}, "User is already LoggedOut"));
  }
  foundUser.refreshTokens = foundUser.refreshTokens.filter(
    (rt) => rt !== refreshToken
  );
  const result = await foundUser.save({ validateBeforeSave: false });
  if (!result) {
    return res
      .status(401)
      .json(new ApiError(401, "Something went wrong while logging out"));
  }
  return res
    .status(200)
    .clearCookie("refreshToken", refreshtokenOptions)
    .json(new ApiResponse(200, {}, "User LoggedOut successfuly"));
});
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }
  if (newPassword !== confirmPassword) {
    return res
      .status(401)
      .json(
        new ApiError(401, "new password and confirm password does not match")
      );
  }
  if (
    oldPassword.length < 8 ||
    !validatePassword(oldPassword) ||
    newPassword.length < 8 ||
    !validatePassword(newPassword) ||
    confirmPassword.length < 8 ||
    !validatePassword(confirmPassword)
  ) {
    return res.status(401).json(new ApiError(401, "Somethin is wrong"));
  }
  const user = await User.findById(req?.user?._id);
  const ValidateOldPassword = await user.isPasswordValid(oldPassword);
  if (!ValidateOldPassword) {
    return res.status(400).json(new ApiError(400, "invalid oldPassword"));
  }
  const ValidateNewPassword = await user.isPasswordValid(newPassword);
  if (ValidateNewPassword) {
    return res.status(401).json(new ApiError(401, "New Password cannot be the same as previous one"));
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});
const verifyEmailByOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json(new ApiError(400, "Email and otp is required"));
  }
  if (!validateOtp(otp)) {
    return res
      .status(400)
      .json(new ApiError(400, "OTP must be a 4-digit number"));
  }
  const user = await User.findOne({ email });
  if (!user || user?.isVerified === true) {
    return res
      .status(400)
      .json(new ApiError(400, "User doesnot exist or already verified"));
  }
  const OtpModel = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
  if (OtpModel.length === 0 || !OtpModel) {
    return res
      .status(400)
      .json(new ApiError(400, "Otp doesnot exist in database"));
  }
  if (OtpModel[0].otp !== otp || OtpModel[0].used === true) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid Otp or otp is used"));
  }
  await User.updateOne({ email }, { isVerified: true });
  await Otp.deleteMany({ email });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User is verified successfully"));
});
const resetPasswordByVerificationLink = asyncHandler(async (req, res) => {
  const { password, confirmPassword, resetPasswordToken } = req.body;
  if (!password || !confirmPassword || !resetPasswordToken) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }
  if (password !== confirmPassword) {
    return res
      .status(401)
      .json(
        new ApiError(401, "password and confirm password does not match")
      );
  }
  if (password.length < 8 || !validatePassword(password)) {
    return res
      .status(401)
      .json(
        new ApiError(401, "password not valid")
      );
  }
  if (confirmPassword.length < 8 || !validatePassword(confirmPassword)) {
    return res.status(401).json(new ApiError(401, "confirm psaaword not valid"));
  }
  const userDetails = await User.findOne({resetPasswordToken});
  console.log("userDetails",userDetails)
  if (!userDetails || userDetails.resetPasswordToken==="") {
    return res
      .status(400)
      .json(new ApiError(400, "User doesnot exist or token is used"));
  }
  const currentTime = Date.now();
  if (currentTime > userDetails.resetPasswordTokenExpiry) {
    return res
      .status(400)
      .json(new ApiError(400, "reset password link has been expired"));
  }
  const ValidatePassword = await userDetails.isPasswordValid(password);
  if (ValidatePassword) {
    return res.status(401).json(new ApiError(401, "Password cannot be the same as previous one"));
  }
  userDetails.password=password;
  userDetails.resetPasswordToken="";
  userDetails.refreshTokens=[];
  await userDetails.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successful"));
});
export {
  registerUser,
  loginUser,
  refreshAccessToken,
  loggedInUser,
  loggOutUser,
  changeCurrentPassword,
  verifyEmailByOtp,
  resetPasswordByVerificationLink
};
