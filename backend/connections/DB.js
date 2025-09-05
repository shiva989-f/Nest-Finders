import mongoose from "mongoose";

export const connectDatabase = () => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@nestfinder.tzupwyo.mongodb.net/?retryWrites=true&w=majority&appName=NestFinder`
    )
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log(error);
    });
};
