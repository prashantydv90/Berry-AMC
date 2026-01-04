import express from "express"
import { addFDInvestment, addMFInvestment, deleteFDInvestment, deleteMFInvestment, editFDInvestment, editMFInvestment, resetMFInvestment } from "../controllers/addInvestment.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";

const investmentRouter=express.Router();

investmentRouter.route('/addinvestment/mf').post(isAuthenticated, isAdmin,addMFInvestment);
investmentRouter.route('/addinvestment/fd').post(isAuthenticated, isAdmin,addFDInvestment);
investmentRouter.route('/editinvestment/mf/:id').put(isAuthenticated, isAdmin,editMFInvestment);
investmentRouter.route('/editinvestment/fd/:id').put(isAuthenticated, isAdmin,editFDInvestment);
investmentRouter.route('/deleteinvestment/mf/:investmentId').delete(isAuthenticated, isAdmin,deleteMFInvestment);
investmentRouter.route('/deleteinvestment/fd/:investmentId').delete(isAuthenticated, isAdmin,deleteFDInvestment);
investmentRouter.route('/resetInvestment/mf/:id').delete(isAuthenticated, isAdmin,resetMFInvestment);

export default investmentRouter;