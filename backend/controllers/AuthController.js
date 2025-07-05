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
import { uploadFile } from "../Cloudinary/CloudinaryConfig.js";
import fs from "fs";

const clientURL = process.env.CLIENT_URL;

// Signup Function http://localhost:3000/api/auth/signup
export const Signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required!", success: false });
    }
    // find user, hash the password create verification token, save the data
    const hashedPassword = await bcryptjs.hash(password, 10);
    const OTP = createOtp();
    const existingUser = await User.findOne({ email });
    // if user exist and if user is verified
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          message: "User already exist, Please Login!",
          success: false,
        });
      } else {
        existingUser.verificationToken = OTP;
        existingUser.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000;
        await existingUser.save();
        sendVerificationEmail(existingUser.email, OTP);
        return res.status(200).json({
          message:
            "User already exist, We've sent you a E-Mail for verification!",
          user: { ...existingUser._doc, password: undefined },
          success: true,
        });
      }
    }

    // If new user then upload user image in cloudinary
    if (!req.file) {
      return res.status(400).json({
        message: "Profile picture is required!",
        success: false,
      });
    }
    const upload = await uploadFile(req.file.path);
    fs.unlinkSync(req.file.path); // Delete local file after upload
    if (!upload) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      profilePicUrl: upload.secure_url,
      profilePicId: upload.public_id,
      verificationToken: OTP,
      verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000,
    });
    await newUser.save();
    sendVerificationEmail(newUser.email, OTP);
    res.status(201).json({
      message: "OTP send to your e-mail",
      user: { ...newUser._doc, password: undefined },
      success: true,
    });
  } catch (error) {
    console.error("Signup Error:", error); // Add this
    res.status(500).json({
      message: "Something went wrong",
      error: error.message, // Return readable message
      success: false,
    });
  }
};

// Verify email Function http://localhost:3000/api/auth/verify-email
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
    sendWelcomeEmail(user.email, user.username);
    generateJwtSetCookie(res, user._id, user.role);

    res.status(200).json({
      message: "User verified successfully!",
      user: { ...user._doc, password: undefined },
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

// Login Function http://localhost:3000/api/auth/login
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

    generateJwtSetCookie(res, user._id, user.role);
    res.status(200).json({
      message: "Login successfully!",
      user: { ...user._doc, password: undefined },
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

// Logout Function http://localhost:3000/api/auth/logout
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully!", success: true });
};

// Forgot Password Function http://localhost:3000/api/auth/forgot-password
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
    sendResetPasswordEmail(email, `${clientURL}/reset-password/${resetToken}`);
    res.status(200).json({
      message: "We've send you reset link on your email!",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
};

// Reset Password Function http://localhost:3000/api/auth/reset-password
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

// Check Authentication Function http://localhost:3000/api/auth/check-auth
export const checkAuth = async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found, Please Loin!", success: false });

    res
      .status(200)
      .json({ message: "User found successfully!", user, success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", success: false });
  }
};
