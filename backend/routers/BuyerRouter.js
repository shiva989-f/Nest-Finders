import express from "express";
import { verifyToken } from "../middleware/VerifyToken.js";
import {
  addToFavorites,
  getProperty,
  increaseViewsCount,
  removeFromFavorites,
  showAllFavorites,
  showProperties,
} from "../controllers/BuyerController.js";

const buyerRouter = express.Router();

buyerRouter.get("/show-properties", verifyToken, showProperties);
buyerRouter.get(
  "/increase-property-views/:propertyId",
  verifyToken,
  increaseViewsCount
);
buyerRouter.get(
  "/add-to-favorites/:propertyId",
  verifyToken,
  addToFavorites
);
buyerRouter.get(
  "/remove-from-favorites/:propertyId",
  verifyToken,
  removeFromFavorites
);
buyerRouter.get("/show-all-favorites", verifyToken, showAllFavorites);
buyerRouter.get("/get-property/:propertyId", verifyToken, getProperty);

export default buyerRouter;
