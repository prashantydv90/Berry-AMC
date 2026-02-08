import express from "express";
import { getClosedIPOs, getOpenIPOs, getUpcomingIPOs } from "../../controllers/market/ipo.contoller.js";


const ipoRouter = express.Router();

ipoRouter.get("/upcoming", getUpcomingIPOs);
ipoRouter.get("/open", getOpenIPOs);
ipoRouter.get("/closed", getClosedIPOs);

export default ipoRouter;
