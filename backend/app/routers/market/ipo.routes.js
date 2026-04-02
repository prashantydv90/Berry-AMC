import express from "express";
import { getClosedIPOs, getOpenIPOs, getUpcomingIPOs } from "../../controllers/market/ipo.contoller.js";
import { IPO } from "../../models/markets/ipo.model.js";


const ipoRouter = express.Router();

ipoRouter.get("/upcoming", getUpcomingIPOs);
ipoRouter.get("/open", getOpenIPOs);
ipoRouter.get("/closed", getClosedIPOs);
ipoRouter.get("/:id", async (req, res) => {
  try {
    const ipo = await IPO.findById(req.params.id);
    res.json({ data: ipo });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

export default ipoRouter;
