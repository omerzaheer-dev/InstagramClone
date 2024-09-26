import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";
const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, //true for port 465 https connection
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "E-Learnity",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
  } catch (error) {
    console.log(error.message);
    throw new ApiError(402, "Error while sending mail to the user");
  }
};

export { mailSender };
