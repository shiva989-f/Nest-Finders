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

import {loginValidation, signupValidation,
} from "../middleware/AuthValidation.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import multer from "multer";
const authRouter = express.Router();

const uploader = multer({
  storage: multer.diskStorage({}), // diskStorage is empty so it doesn't store image in any folder, we are just getting the file in backend
  limits: { fileSize: 500000 },
});

authRouter.post("/signup", signupValidation, uploader.single("file"), Signup);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/login", loginValidation, login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/logout", logout);
authRouter.get("/check-auth", verifyToken, checkAuth);

export default authRouter;
