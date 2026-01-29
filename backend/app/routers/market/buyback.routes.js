// routes/buybacks.js
import express from "express";
import { Buyback } from "../../models/markets/buyback.model.js";
import { insertBuybacks } from "../../controllers/market/buyback.controller.js";


const buybackRouter = express.Router();

buybackRouter.get("/buybacks", async (req, res) => {
  const data = await Buyback.find()
    .sort({ broadcastAt: -1 })
    .limit(100);
  res.json(data);
});

buybackRouter.post('/insert',insertBuybacks);

export default buybackRouter;

