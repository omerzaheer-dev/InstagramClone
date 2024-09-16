import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validatePassword, validateEmail } from "../helpers/test.regex.js";
import { generateRefreshAndAccessTokens } from "../helpers/generateRefreshAndAccessTokens.js";

const accesstokenOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: process.env.ACCESS_TOKEN_EXPIRY,
};
const refreshtokenOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: process.env.REFRESH_TOKEN_EXPIRY,
};

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
  const user = await User.findOne({
    $or: [{ email: emailUsername }, { username: emailUsername }],
  });
  if (!user) {
    return res.status(404).json(new ApiError(404, "User doesnot exist "));
  }
  if (!user.isVerified) {
    return res.status(404).json(new ApiError(404, "User is not verified"));
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
  const ValidatePassword = await user.isPasswordValid(password);
  if (!ValidatePassword) {
    return res.status(401).json(new ApiError(401, "Invalid User Cradentials"));
  }
  const { refreshtoken, accesstoken } = await generateRefreshAndAccessTokens(
    user._id
  );
  const User = await User.findById(user._id);
  const cookies = req?.cookies;
  let RefreshTokenArray = !cookies?.refreshToken
    ? User.refreshTokens
    : User.refreshTokens.filter((rt) => rt !== cookies?.refreshToken);
  User.refreshTokens = [...RefreshTokenArray, refreshtoken];
  await User.save({ validateBeforeSave: false });
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshTokens"
  );
  return res
    .status(200)
    .cookie("accessToken", accesstoken, accesstokenOptions)
    .cookie("refreshToken", refreshtoken, refreshtokenOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accesstoken,
          refreshtoken,
        },
        "User logged in successfully"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req?.cookies?.refreshToken || req?.body?.refreshtoken;
  if (!incommingRefreshToken) {
    return res.status(401).json(new ApiError(401, "No refresh token"));
  }
  res.clearCookie("accessToken", accesstokenOptions);
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
        User.refreshTokens = [];
        await User.save({ validateBeforeSave: false });
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
        return res.sendStatus(403);
      }
      if (err || foundUser._id !== decoded._id) {
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
      return res
        .status(200)
        .cookie("accessToken", accesstoken, accesstokenOptions)
        .cookie("refreshToken", refreshtoken, refreshtokenOptions)
        .json(
          new ApiResponse(
            200,
            { accesstoken, refreshtoken },
            "Access Token Refreshed"
          )
        );
    }
  );
});

export { registerUser };
