import { Client } from "../models/client.model.js";
import { FDInvestment } from "../models/fdInvestment.model.js";
import { MFInvestment } from "../models/mfInvestment.model.js";
import { updateFDs } from "../utils/fdCalculation.js";

export const addMFInvestment = async (req, res) => {
  try {
    const { clientId, investedValue, totalValue } = req.body;

    // Validate input
    if (!clientId  || !investedValue || !totalValue) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    // Check client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        message: "Client not found",
        success: false,
      });
    }

    // Create investment
    const newInvestment = await MFInvestment.create({
      client: clientId,
      investedValue,
      totalValue,
    });

    // Push reference into client
  client.MFInvestments.push(newInvestment._id);
  client.MFTotalValue = Number(client.MFTotalValue || 0) + Number(investedValue);
  client.MFTotalInvested = Number(client.MFTotalInvested || 0) + Number(investedValue);
  await client.save();


    return res.status(201).json({
      message: "Investment added successfully",
      success: true,
      data: newInvestment,
    });
  } catch (error) {
    console.error("Error adding investment:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};



export const addFDInvestment = async (req, res) => {
  try {
    const { clientId, investedValue, totalValue, date } = req.body;

    // Validate input
    if (!clientId  || !investedValue || !totalValue || !date) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    // Check client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        message: "Client not found",
        success: false,
      });
    }

    const currDate=new Date();
    const inputDate = new Date(date);
    if(inputDate>currDate){
      return res.status(400).json({
        message: "Invalid Date",
        success:false,
      })
    }

    // Create investment
    const newInvestment = await FDInvestment.create({
      client: clientId,
      investedValue,
      totalValue:investedValue,
      date,
      rate:12,
    });

    

    // Push reference into client
    client.FDInvestments.push(newInvestment._id);
    client.FDTotalValue = Number(client.FDTotalValue || 0) + Number(investedValue);
    client.FDTotalInvested = Number(client.FDTotalInvested || 0) + Number(investedValue);
    await client.save();

    await updateFDs();

    return res.status(201).json({
      message: "Investment added successfully",
      success: true,
      data: newInvestment,
      
    });
  } catch (error) {
    console.error("Error adding investment:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};