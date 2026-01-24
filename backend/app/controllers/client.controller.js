import { Client } from "../models/client.model.js";
import { FDInvestment } from "../models/fdInvestment.model.js";
import { MFInvestment } from "../models/mfInvestment.model.js";
import { User } from "../models/user.model.js";
import { clientApprovalEmail } from "../utils/emailTemplate.js";
import {   transporter } from "../utils/sendEmail.js";
import { sendEmail } from "../utils/sendEmail2.js";

// Add Client
export const addClient = async (req, res) => {
  try {
    const { name, phone, email, address, PAN } = req.body;

    if (!email || !phone || !name || !address || !PAN) {
      return res.status(400).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    // Check if already exists
    const existingClient = await Client.findOne({
      $or: [{ email }, { phone }, { PAN }],
    });

    if (existingClient) {
      return res.status(409).json({
        message: "Client already exists",
        success: false,
      });
    }

    // Create client
    const client = await Client.create({
      name,
      phone,
      email,
      address,
      PAN,
    });

    const { subject, html } = clientApprovalEmail(client.name);

    // Send email
    await sendEmail({
      to: client.email,
      subject,
      html,
      from: "Berry AMC Support <no-reply@berryamc.com>",
    });

    const user = await User.findOne({ email });

    if (user) {
      user.clientId = client._id;
      await user.save(); // <-- important to await this
    }

    return res.status(201).json({
      message: "Client added successfully",
      success: true,
      data: client,
    });
  } catch (error) {
    console.error("Error adding client:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// Get all clients (with investments populated)
export const getClientDetails = async (req, res) => {
  try {
    const requests = await Client.find({})
      .populate("FDInvestments")
      .populate("MFInvestments")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching client details",
      error: error.message,
    });
  }
};

// Get single client details (with investments populated)
export const get1ClientDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id)
      .populate({
        path: "MFInvestments",
        options: { sort: { createdAt: -1 } },
         // newest first
      })
      .populate({
        path: "FDInvestments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "FDWithdrawals",
          options: { sort: { createdAt: -1 } },
        }, // newest first
      })
      .populate({
        path: "MFPeriodicInterest",
        options: { sort: { createdAt: -1 } }, // newest first
      });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching client details",
      error: error.message,
    });
  }
};
