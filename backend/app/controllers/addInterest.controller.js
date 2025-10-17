import { AddInterest } from "../models/addInterest.model.js";
import { Client } from "../models/client.model.js";
import { MFInvestment } from "../models/mfInvestment.model.js";

export const addInterest = async (req, res) => {
  try {
    const { startMonth, endMonth, returns } = req.body;

    if ( !startMonth || !endMonth || !returns) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const clientId=req.params.id;

    // ✅ Check investment exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        message: "Client not found",
        success: false,
      });
    }

    if(startMonth>endMonth){
      return res.status(400).json({
        message: "Invalid End Date",
        success:false
      })
    }

    // ✅ Create interest
    const newInterest = await AddInterest.create({
      client: clientId,
      startMonth,
      endMonth,
      returns,
      totalValue:Number(client.MFTotalValue)+Number(returns),
    });
   
    // ✅ Push reference into investment
    client.MFPeriodicInterest.push(newInterest._id);
    client.MFTotalValue=Number(client.MFTotalValue)+Number(returns);
    await client.save();

    return res.status(201).json({
      message: "Interest added successfully",
      success: true,
      data: newInterest,
    });
  } catch (error) {
    console.error("Error adding interest:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
