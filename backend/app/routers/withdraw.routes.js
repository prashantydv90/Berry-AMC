import express from "express"
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";
import { withdrawFD } from "../controllers/withdraw.controller.js";
import { withdrawSMEIPO } from "../controllers/smeipo.withdraw.controller.js";


const withdrawRouter=express.Router();

withdrawRouter.route('/fdwithdraw/:fdId').post(isAuthenticated, isAdmin,withdrawFD);
withdrawRouter.route('/smeipowithdraw/:smeipoId').post(isAuthenticated, isAdmin,withdrawSMEIPO);

export default withdrawRouter;
