import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/UsersModel.js";
import { createOtp } from "../utils/CreateOTP.js";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../nodemailer/Email.js";
import { generateJwtSetCookie } from "../utils/generateJWTandSetInCookie.js";

const clientURL = process.env.CLIENT_URL;

export const Signup = async (req, res) => {
  try {
    const { username, email, password, role, profilePic } = req.body;
    if (!username || !email || !password || !role || !profilePic) {
      return res
        .status(400)
        .json({ message: "All fields are required!", success: false });
    }
    // find user, hash the password create verification token, save the data
    const hashedPassword = await bcryptjs.hash(password, 10);
    const OTP = createOtp();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          message: "User already exist, Please Login!",
          success: false,
        });
      } else {
        existingUser.verificationToken = OTP;
        existingUser.verificationTokenExpiresAt = Date.now() + 10 * 60 * 10000;
        await existingUser.save();
        await sendVerificationEmail(existingUser.email, OTP);
        return res.status(200).json({
          message:
            "User already exist, We've sent you a E-Mail for verification!",
          user: { ...existingUser._doc, password: undefined },
          success: true,
        });
      }
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      profilePic,
      verificationToken: OTP,
      verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
    });
    await newUser.save();
    await sendVerificationEmail(newUser.email, OTP);
    res.status(201).json({
      message: "OTP send to your e-mail",
      user: { ...newUser._doc, password: undefined },
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code)
      return res
        .status(400)
        .json({ message: "No OTP is entered!", success: false });
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user)
      return res.status(404).json({
        message: "Invalid OTP, try with correct OTP!",
        success: false,
      });

    // If OTP is valid
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.username);
    await generateJwtSetCookie(res, user._id);

    res
      .status(200)
      .json({ message: "User verified successfully!", user, success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required!", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not exist, Please login!", success: false });
    }

    if (user) {
      if (!user.isVerified) {
        return res.status(404).json({
          message: "User is not verified, Please signup with same email!",
          success: false,
        });
      }
    }

    const matchPassword = await bcryptjs.compare(password, user.password);
    if (!matchPassword)
      return res
        .status(401)
        .json({ message: "Incorrect password!", success: false });

    await generateJwtSetCookie(res, user._id);
    res.status(200).json({ message: "Login successfully!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully!", success: true });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ message: "Invalid or empty email field!", success: false });
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found!", success: false });

    if (user) {
      if (!user.isVerified) {
        return res.status(401).json({
          message: "User is not verified please signup!",
          success: false,
        });
      }
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    await user.save();
    await sendResetPasswordEmail(
      email,
      `${clientURL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      message: "We've send you reset link on your email!",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;
    if (!resetToken || !password) {
      return res.send(400).json({ message: "Bad request!", success: false });
    }
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found!", success: false });

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    res
      .status(200)
      .json({ message: "Password changed successfully!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};
