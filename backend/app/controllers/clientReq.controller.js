import { Client } from "../models/client.model.js";
import { ClientReq } from "../models/clientReq.model.js";

export const ClientReqData = async (req, res) => {
  try {
    const { name, phone, email, address, PAN } = req.body;

    // ✅ Validate input
    if (!email || !phone || !name || !address || !PAN) {
      return res.status(400).json({
        message: "Missing required fields. Please fill all details.",
        success: false,
      });
    }

    // ✅ Check if client already exists (by email, phone, or PAN)
    const existingClient = await Client.findOne({ $or: [{ email }, { phone }, { PAN }] });
    if (existingClient) {
      return res.status(409).json({
        message: "You are already registered as our investor.",
        success: false,
      });
    }

    const existingClientReq = await ClientReq.findOne({ $or: [{ email }, { phone }, { PAN }] });
    if (existingClientReq) {
      return res.status(409).json({
        message: "Your request is already submitted. Please wait for approval.",
        success: false,
      });
    }

    // ✅ Step 1: Create client request
    const clientReq = await ClientReq.create({
      name,
      phone,
      email,
      address,
      PAN,
    });

    return res.status(201).json({
      message: "Your request has been submitted successfully.",
      success: true,
      data: {
        clientReq,
      },
    });

  } catch (error) {
    console.error("Error while submitting client request:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
      success: false,
      error: error.message,
    });
  }
};



export const getClientRequests = async (req, res) => {
  try {
    const requests = await ClientReq.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching investor requests", error: error.message });
  }
};


// Delete a client request
export const deleteClientRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ClientReq.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Investor request not found" });
    }

    await ClientReq.findByIdAndDelete(id);

    res.json({ success: true, message: "Client request deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting client request", error: error.message });
  }
};
