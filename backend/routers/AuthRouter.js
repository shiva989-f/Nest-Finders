import express from "express";
import { forgotPassword, login, logout, resetPassword, Signup, verifyEmail } from "../controllers/AuthController.js";

const authRouter = express.Router()

authRouter.post("/signup", Signup)
authRouter.post("/verify-email", verifyEmail)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.post("/forgot-password", forgotPassword)
authRouter.post("/reset-password", resetPassword)

export default authRouter