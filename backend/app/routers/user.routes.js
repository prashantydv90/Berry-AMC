import express from "express"
import {forgotPassword, get1UserDetails, getUser, login, logout, resetPassword, signup, verifyOtp } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const userRouter=express.Router();

userRouter.route('/signup').post(signup);
userRouter.route('/signup/verify-otp').post(verifyOtp);
userRouter.route('/login').post(login);
userRouter.route('/logout').get(logout);
userRouter.route('/check-auth').get(getUser);
userRouter.route('/forgot-password').post(forgotPassword);
userRouter.route("/reset-password").post(resetPassword);
userRouter.route("/getuserdetails/:id").get(isAuthenticated, get1UserDetails)

export default userRouter;