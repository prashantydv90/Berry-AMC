import express from "express"
import { addClient, deleteClient, get1ClientDetails, getClientDetails } from "../controllers/client.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";

const clientRouter=express.Router();

clientRouter.route('/addClient').post(isAuthenticated, isAdmin,addClient);
clientRouter.route('/getClientDetails').get(isAuthenticated, isAdmin,getClientDetails);
clientRouter.route('/get1ClientDetails/:id').get(isAuthenticated,get1ClientDetails);
clientRouter.route("/deleteClient/:id").delete(isAuthenticated, isAdmin, deleteClient);

export default clientRouter;