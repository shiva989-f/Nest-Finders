import express from 'express'
import { verifyToken } from '../middleware/VerifyToken.js'
import { addToFavourites, increaseViewsCount, showAllFavourites, showProperties } from '../controllers/UserController.js'

const userRouter = express.Router()

userRouter.get("/show-properties", verifyToken, showProperties)
userRouter.get("/increase-property-views/:propertyId", verifyToken, increaseViewsCount)
userRouter.get("/add-to-favourties/:propertyId", verifyToken, addToFavourites)
userRouter.get("/show-all-favourites/", verifyToken, showAllFavourites)

export default userRouter