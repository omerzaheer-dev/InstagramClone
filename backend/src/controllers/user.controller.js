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
import { deleteImageByPublicId, uploadOnCloudinary } from "../utils/cloudinary.js"
import { extractPublicId } from "cloudinary-build-url"
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, gender, bio, password, confirmPassword } = req.body;
  if (
    [email, username, password, confirmPassword, fullName, gender].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(409, "All fields are required except bio use can add it later")
  }
  if (!validateEmail(email)) {
    throw new ApiError(407, "email is not valid")
  }
  if (!validateUserName(username)) {
    throw new ApiError(407, "username is not valid")
  }

  if (password !== confirmPassword) {
    throw new ApiError(405, "Password and confirmPassword dosent match")
  }

  if (!password || password.length < 8) {
    throw new ApiError(401, "Password must be at least 8 characters long")
  }

  if (!validatePassword(password)) {
    throw new ApiError(406, "password contains at least one special character capital letter and number also")
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
  }
  if (gender !== "male" && gender !== "female") {
    throw new ApiError(408, "gender can be male or female only")
  }
  let profilePictureLocalPath;
  if (req.files && Array.isArray(req.files.profilePicture) && req.files.profilePicture.length > 0) {
    profilePictureLocalPath = req.files.profilePicture[0]?.path;
  }
  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath, "profiles");
  if (!profilePicture?.secure_url) {
    throw new ApiError(409, "Error uploading image")
  }
  const user = await User.create({
    fullName,
    bio,
    gender,
    profilePicture: profilePicture?.secure_url || "",
    email,
    password,
    followers: [],
    following: [],
    posts: [],
    bookmarks: [],
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-createdAt -updatedAt -password -refreshTokens -resetPasswordToken -resetPasswordTokenExpiry");

  if (!createdUser) {
    throw new ApiError(500, "Somthing went wrong while registering user")
  }


  const { refreshtoken, accesstoken } = await generateRefreshAndAccessTokens(
    createdUser?._id
  );
  const Usr = await User.findById(createdUser?._id);
  if (!Usr) {
    throw new ApiError(404, "User doesnot exist")
  }
  if (req?.cookies?.refreshToken) {
    const foundToken = await User.findOne({
      refreshTokens: req?.cookies?.refreshToken,
    }).exec();
    if (foundToken) {
      let RefreshTokenArray = foundToken.refreshTokens.filter((rt) => rt !== req?.cookies?.refreshToken);
      foundToken.refreshTokens = RefreshTokenArray
      await foundToken.save({ validateBeforeSave: false });
    }
    res.clearCookie("refreshToken", refreshtokenOptions);
  }
  Usr.refreshTokens = [refreshtoken];
  await Usr.save({ validateBeforeSave: false });
  const loggedInUser = await User.findById(Usr?._id).select(
    "-password -refreshTokens -resetPasswordToken -resetPasswordTokenExpiry -createdAt -updatedAt"
  );

  return res
    .status(200)
    .cookie("refreshToken", refreshtoken, refreshtokenOptions)
    .json(new ApiResponse(200,
      {
        user: loggedInUser,
        accesstoken,
      },
      "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { emailUsername, password } = req.body.data;
  if (!emailUsername || !password) {
    throw new ApiError(400, "username and email is required")
  }
  if (!validateEmail(emailUsername) && !validateUserName(emailUsername)) {
    throw new ApiError(401, "Invalid email or username format")
  }
  const user = await User.findOne({
    $or: [{ email: emailUsername }, { username: emailUsername }],
  });
  if (!user) {
    throw new ApiError(402, "User doesnot exist")
  }
  // if (!user.isVerified) {
  //   return res.status(404).json(new ApiError(404, "User is not verified"));
  // }
  if (!password || password.length < 8) {
    throw new ApiError(403, "Password must be at least 8 characters long")
  }
  if (!validatePassword(password)) {
    throw new ApiError(408, "password contains at least one special character and number also")
  }
  const ValidatePassword = await user.isPasswordValid(password);
  if (!ValidatePassword) {
    throw new ApiError(403, "Invalid User Cradentials")
  }
  const { refreshtoken, accesstoken } = await generateRefreshAndAccessTokens(
    user?._id
  );
  const Usr = await User.findById(user?._id);
  if (!Usr) {
    throw new ApiError(404, "User doesnot exist ")
  }
  let RefreshTokenArray = !req?.cookies?.refreshToken
    ? Usr.refreshTokens
    : Usr.refreshTokens.filter((rt) => rt !== req?.cookies?.refreshToken);
  if (req?.cookies?.refreshToken) {
    const foundToken = await User.findOne({
      refreshTokens: req?.cookies?.refreshToken,
    }).exec();
    if (!foundToken) {
      RefreshTokenArray = [];
    }
    res.clearCookie("refreshToken", refreshtokenOptions);
  }
  Usr.refreshTokens = [...RefreshTokenArray, refreshtoken];
  await Usr.save({ validateBeforeSave: false });
  const loggedInUser = await User.findById(Usr?._id).populate({ path: "posts", sort: { createdAt: -1 } }).select(
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
    throw new ApiError(401, "No refresh token")
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
        console.log("n")
        if (err) return res.sendStatus(403);
        const hackedUser = await User.findById(decoded?._id).exec();
        if (!hackedUser) {
          throw new ApiError(401, "Invalid refresh token")
        }
        hackedUser.refreshTokens = [];
        await hackedUser.save({ validateBeforeSave: false });
      }
    );
    console.log("fty")
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
      const usr = await User.findById(decoded?._id);
      if (!usr) {
        throw new ApiError(401, "Invalid refresh token")
      }
      if (!usr.refreshTokens.includes(incommingRefreshToken)) {
        throw new ApiError(401, "Refresh token is expired or used")
      }
      const { refreshtoken, accesstoken } =
        await generateRefreshAndAccessTokens(usr._id);
      usr.refreshTokens = [...newRefreshTokenArray, refreshtoken];
      await usr.save({ validateBeforeSave: false });
      const loggedInUser = await User.findById(usr._id).select(
        "-password -refreshTokens -resetPasswordToken -resetPasswordTokenExpiry -createdAt -updatedAt"
      );
      return (
        res
          .status(200)
          .cookie("refreshToken", refreshtoken, refreshtokenOptions)
          .json(new ApiResponse(200, {
            accesstoken,
            user: loggedInUser
          }, "Access Token Refreshed"))
      );
    }
  );
});

const loggedInUser = asyncHandler(async (req, res) => {
  const loginUser = await User.findById(req.user._id).select(
    "-password -refreshTokens"
  );
  if (!loginUser) {
    throw new ApiError(400, "user is not available")
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
          "User is already LoggedOut no refresh tokena is present in cookies"
        )
      );
  }
  const refreshToken = cookies?.refreshToken;
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
    throw new ApiError(401, "Something went wrong while logging out")
  }
  return res
    .status(200)
    .clearCookie("refreshToken", refreshtokenOptions)
    .json(new ApiResponse(200, {}, "User LoggedOut successfuly"));
});
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required")
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(401, "new password and confirm password does not match")
  }
  if (
    oldPassword.length < 8 ||
    !validatePassword(oldPassword) ||
    newPassword.length < 8 ||
    !validatePassword(newPassword) ||
    confirmPassword.length < 8 ||
    !validatePassword(confirmPassword)
  ) {
    throw new ApiError(401, "Somethin is wrong")
  }
  const user = await User.findById(req?.user?._id);
  if (!user) {
    throw new ApiError(400, "user not present")
  }
  const ValidateOldPassword = await user.isPasswordValid(oldPassword);
  if (!ValidateOldPassword) {
    throw new ApiError(400, "invalid oldPassword")
  }
  if (newPassword === oldPassword) {
    throw new ApiError(401, "New Password cannot be the same as previous one")
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
    throw new ApiError(400, "Email and otp is required")
  }
  if (email !== req.user.email) {
    throw new ApiError(400, "Something went wrong")
  }

  if (!validateOtp(otp)) {
    throw new ApiError(400, "OTP must be a 4-digit number")
  }
  const user = await User.findOne({ email });
  if (!user || user?.isVerified === true || !user?.role.includes("unverified")) {
    throw new ApiError(401, "User doesnot exist or already verified")
  }
  const OtpModel = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
  if (OtpModel.length === 0 || !OtpModel) {
    throw new ApiError(402, "Otp doesnot exist in database")
  }
  if (OtpModel[0].otp !== otp || OtpModel[0].used === true) {
    throw new ApiError(403, "Invalid Otp or otp is used")
  }
  await User.findOneAndUpdate({ email }, { isVerified: true, role: ["user"] }, { new: true });
  await Otp.deleteMany({ email });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User is verified successfully"));
});
const resetPasswordByVerificationLink = asyncHandler(async (req, res) => {
  const { password, confirmPassword, resetPasswordToken } = req.body;
  if (!password || !confirmPassword || !resetPasswordToken) {
    throw new ApiError(400, "All fields are required")
  }
  if (password !== confirmPassword) {
    throw new ApiError(401, "password and confirm password does not match")
  }
  if (password.length < 8 || !validatePassword(password)) {
    throw new ApiError(401, "password not valid")
  }
  if (confirmPassword.length < 8 || !validatePassword(confirmPassword)) {
    throw new ApiError(401, "confirm psaaword not valid")
  }
  const userDetails = await User.findOne({ resetPasswordToken });
  console.log("userDetails", userDetails)
  if (!userDetails) {
    throw new ApiError(400, "User doesnot exist")
  }
  const currentTime = Date.now();
  if (currentTime > userDetails.resetPasswordTokenExpiry) {
    throw new ApiError(400, "reset password link has been expired")
  }
  const ValidatePassword = await userDetails.isPasswordValid(password);
  if (ValidatePassword) {
    throw new ApiError(401, "Password cannot be the same as previous one")
  }
  userDetails.password = password;
  userDetails.resetPasswordToken = "";
  userDetails.refreshTokens = [];
  await userDetails.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successful"));
});

const getProfile = asyncHandler(async (req, res) => {
  console.log("gft")
  const { _id } = req.params;
  console.log(_id, "gf")
  if (!_id) {
    throw new ApiError(400, "user is not logged in")
  }
  const user = await User.findById(_id).select(
    "-password -refreshTokens -resetPasswordToken -resetPasswordTokenExpiry -createdAt -updatedAt"
  );
  if (!user) {
    throw new ApiError(401, "user is not available")
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "user profile returned"));
});
const editProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    throw new ApiError(400, "Id is required to get profile")
  }
  const { gender, bio } = req.body
  let profilePictureLocalPath;
  if (req.files && Array.isArray(req.files.profilePicture) && req.files.profilePicture.length > 0) {
    profilePictureLocalPath = req.files.profilePicture[0]?.path;
  }
  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath, "profiles");
  const user = await User.findById(_id).select(
    "-password -refreshTokens -resetPasswordToken -resetPasswordTokenExpiry -createdAt -updatedAt"
  );
  if (!user) {
    throw new ApiError(401, "user is not available")
  }
  if (gender) user.gender = gender;
  if (bio) user.bio = bio;
  if (profilePictureLocalPath) {
    if (user.profilePicture !== "") {
      const publicId = extractPublicId(user.profilePicture);
      const deleteCloudinary = await deleteImageByPublicId(publicId);
      if (!deleteCloudinary) {
        throw new ApiError(402, "previous image not deleated")
      } else {
        user.profilePicture = profilePicture?.secure_url;
      }
    } else {
      user.profilePicture = profilePicture?.secure_url;
    }
  }
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user details edited"));
});
const getSuggestedUsers = asyncHandler(async (req, res) => {
  let suggestedUsers;
  const userId = req?.query?.id;
  if (userId) {
    suggestedUsers = await User.find({
      _id: { $ne: userId }
      // , isVerified: true 
    });
  }
  else {
    suggestedUsers = await User.find({});
  }
  if (!suggestedUsers) {
    throw new ApiError(400, "no suggesed users")
  }
  return res
    .status(200)
    .json(new ApiResponse(200, suggestedUsers, "all suggested users"));
});
const followOrUnfollowUser = asyncHandler(async (req, res) => {
  const loggedInUser = req?.user?._id;
  const userToBeFollowed = req.params._id
  if (loggedInUser.toString() === userToBeFollowed) {
    throw new ApiError(400, "you cannot follow to your self")
  }
  const user = await User.findById(loggedInUser);
  const targetUser = await User.findById(userToBeFollowed);
  if (!user || !targetUser) {
    throw new ApiError(400, "something is wrong either no user or target user to follow or unfollow")
  }
  const isFollowing = user.following.includes(userToBeFollowed);
  if (!isFollowing) {
    await User.findOneAndUpdate({ _id: loggedInUser }, { $push: { following: userToBeFollowed } });
    await User.findOneAndUpdate({ _id: userToBeFollowed }, { $push: { followers: loggedInUser } });
    return res
      .status(200)
      .json(new ApiResponse(200, { type: "followed" }, "user followed successfully"));
  } else {
    await User.findOneAndUpdate({ _id: loggedInUser }, { $pull: { following: userToBeFollowed } });
    await User.findOneAndUpdate({ _id: userToBeFollowed }, { $pull: { followers: loggedInUser } });
    return res
      .status(200)
      .json(new ApiResponse(200, { type: "unfollowed" }, "user unfollowed successfully"));
  }
});
export {
  registerUser,
  loginUser,
  refreshAccessToken,
  loggedInUser,
  loggOutUser,
  changeCurrentPassword,
  verifyEmailByOtp,
  resetPasswordByVerificationLink,
  getProfile,
  editProfile,
  getSuggestedUsers,
  followOrUnfollowUser
};
