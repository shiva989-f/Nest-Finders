import express from "express"
import multer from "multer"
import { verifyToken } from "../middleware/VerifyToken.js"
import { addProperty, deleteProperty, editProperty, showAllProperties } from "../controllers/SellerController.js"
import { propertyValidaiton } from "../middleware/PropertyValidation.js"

const sellerRouter = express.Router()

const uploader = multer({
  storage: multer.diskStorage({}), // diskStorage is empty so it doesn't store image in any folder, we are just getting the file in backend
  limits: { fileSize: 500000 },
});

sellerRouter.post("/add-property", verifyToken, propertyValidaiton, uploader.array("files", 10),  addProperty)
sellerRouter.post("/edit-property/:propertyId", verifyToken, propertyValidaiton, uploader.array("files", 10), editProperty)
sellerRouter.get("/show-all-properties", verifyToken, showAllProperties)
sellerRouter.get("/delete-property/:propertyId", verifyToken, deleteProperty)

export default sellerRouter