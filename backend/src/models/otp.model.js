import mongoose from "mongoose";
import { mailSender } from "../utils/mailSender.js";
import otpTemplate from "../mail/templates/emailVerificationTemplate.js";

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    const otpVerificationLink = `${process.env.CORS_ORIGIN}/account/verify-email`;
    await mailSender(
      email,
      "Verification Email from StudyNotion",
      otpTemplate(otp, otpVerificationLink)
    );
  } catch (error) {
    throw error;
  }
}

OtpSchema.pre("save", async function (next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

export const Otp = mongoose.model("Otp", OtpSchema);
