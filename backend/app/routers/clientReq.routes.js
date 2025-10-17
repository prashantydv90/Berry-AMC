import express from "express"
import { ClientReqData, deleteClientRequest, getClientRequests } from "../controllers/clientReq.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js";

const clientReqRouter=express.Router();

clientReqRouter.route('/client-req').post(ClientReqData);
clientReqRouter.route('/getclientreqs').get(isAuthenticated, isAdmin,getClientRequests);
clientReqRouter.route('/deletereq/:id').delete(isAuthenticated, isAdmin,deleteClientRequest);

export default clientReqRouter;