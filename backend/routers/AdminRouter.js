import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import { deleteProperty, deleteUser, showAllProperties, showAllUsers } from "../controllers/AdminController.js";

const adminRouter = express.Router()

// User Management apis
adminRouter.get("/show-all-users", verifyToken, showAllUsers)
adminRouter.get("/delete-user/:userId", verifyToken, deleteUser)

// Properties Management apis
adminRouter.get("/show-all-properties", verifyToken, showAllProperties)
adminRouter.get("/delete-property/:propertyId", verifyToken, deleteProperty)

export default adminRouter