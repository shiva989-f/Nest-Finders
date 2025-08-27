import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routers/AuthRouter.js";
import { connectDatabase } from "./connections/DB.js";
import adminRouter from "./routers/AdminRouter.js";
import sellerRouter from "./routers/SellerRouter.js";
import buyerRouter from "./routers/BuyerRouter.js";

dotenv.config();

// Connect to database
connectDatabase();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
// credentials: true, allow us to fetch cookies from frontend
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/buyer", buyerRouter);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
