import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail", // or "outlook", "yahoo"

  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
});


