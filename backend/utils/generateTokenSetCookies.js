import jwt from "jsonwebtoken";

export const generateJwtSetCookie = (res, userId, userRole) => {
  const token = jwt.sign({ userId, userRole }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
