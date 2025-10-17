import express from "express"
import { addInterest } from "../controllers/addInterest.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";

const interestRouter=express.Router();

interestRouter.route('/addinterest/:id').post(isAuthenticated, isAdmin,addInterest);

export default interestRouter;