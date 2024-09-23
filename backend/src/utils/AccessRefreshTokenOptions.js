import jwt from "jsonwebtoken";
const accesstokenOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 3 * 60 * 60 * 1000,
};
const refreshtokenOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 3 * 24 * 60 * 60 * 1000,
};
export { accesstokenOptions, refreshtokenOptions };
