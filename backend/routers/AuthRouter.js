import express from "express";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPassword,
  Signup,
  verifyEmail,
} from "../controllers/AuthController.js";

import {
  loginValidation,
  signupValidation,
} from "../middleware/AuthValidation.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import multer from "multer";
const authRouter = express.Router();

const uploader = multer({
  storage: multer.diskStorage({}), // diskStorage is empty so it doesn't store image in any folder, we are just getting the file in backend
  limits: { fileSize: 500000 },
});

// uploader.single is a multer middleware that handles single file uploads
// 'file' is the name of the field in the form that contains the file
authRouter.post("/signup", signupValidation, uploader.single("file"), Signup);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/login", loginValidation, login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/logout", logout);
authRouter.get("/check-auth", verifyToken, checkAuth);

export default authRouter;
