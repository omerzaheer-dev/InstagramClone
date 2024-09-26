const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
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
export { validateEmail, validatePassword, validateOtp };
