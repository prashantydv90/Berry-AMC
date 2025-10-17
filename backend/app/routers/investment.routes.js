import express from "express"
import { addFDInvestment, addMFInvestment } from "../controllers/addInvestment.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";

const investmentRouter=express.Router();

investmentRouter.route('/addinvestment/mf').post(isAuthenticated, isAdmin,addMFInvestment);
investmentRouter.route('/addinvestment/fd').post(isAuthenticated, isAdmin,addFDInvestment);

export default investmentRouter;