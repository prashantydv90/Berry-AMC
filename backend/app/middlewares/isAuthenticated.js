import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false
      });
    }

    // ✅ Fetch user from DB
    const user = await User.findById(decode.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    // ✅ Attach to req
    req.user = user;
    req.id = decode.userId;

    next();
  } catch (error) {
    console.log("Auth error:", error);
    return res.status(500).json({
      message: "Authentication failed",
      success: false
    });
  }
};


export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};
