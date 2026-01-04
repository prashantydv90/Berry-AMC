import express from "express"
import { addInterest, deleteInterest, editReturn } from "../controllers/addInterest.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";

const interestRouter=express.Router();

interestRouter.route('/addinterest/:id').post(isAuthenticated, isAdmin,addInterest);
interestRouter.route('/editinterest/:id').put(isAuthenticated, isAdmin,editReturn );
interestRouter.route('/deleteinterest/:interestId').delete(isAuthenticated, isAdmin,deleteInterest);

export default interestRouter;