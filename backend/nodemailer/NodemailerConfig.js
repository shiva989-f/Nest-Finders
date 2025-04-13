import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465, // GMail Port (fixed)
  // Sender email
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});
