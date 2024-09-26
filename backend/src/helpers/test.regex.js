const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const usernameRegex = /^[a-z](?!.*[_.]{2})[a-z0-9._]{2,29}$/;
const otpRegex = /^\d{4}$/;
const validateEmail = (email) => {
  return emailRegex.test(email);
};
const validatePassword = (password) => {
  return passwordRegex.test(password);
};
const validateOtp = (otp) => {
  return otpRegex.test(otp);
};
const validateUserName = (username) => {
  return usernameRegex.test(username);
};
export { validateEmail, validatePassword, validateOtp , validateUserName };
