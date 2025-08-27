import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/VerifyToken.js";
import {
  addProperty,
  deleteProperty,
  editProperty,
  getProperty,
  showAllProperties,
} from "../controllers/SellerController.js";
import { propertyValidation } from "../middleware/PropertyValidation.js";

const sellerRouter = express.Router();

const uploader = multer({
  storage: multer.diskStorage({}), // diskStorage is empty so it doesn't store image in any folder, we are just getting the file in backend
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

sellerRouter.post(
  "/add-property",
  verifyToken,
  propertyValidation,
  uploader.array("files", 10),
  addProperty
);

sellerRouter.post(
  "/edit-property/:propertyId",
  verifyToken,
  propertyValidation,
  uploader.array("files", 10),
  editProperty
);
sellerRouter.get("/show-all-properties", verifyToken, showAllProperties);
sellerRouter.get("/get-property/:propertyId", verifyToken, getProperty);
sellerRouter.get("/delete-property/:propertyId", verifyToken, deleteProperty);

export default sellerRouter;
