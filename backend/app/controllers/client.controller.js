import mongoose from "mongoose";
import { AddInterest } from "../models/addInterest.model.js";
import { Client } from "../models/client.model.js";
import { FDInvestment } from "../models/fdInvestment.model.js";
import { FDWithdraw } from "../models/fdwithdraw.model.js";
import { MFInvestment } from "../models/mfInvestment.model.js";
import { smeipo } from "../models/smeipo.model.js";
import { smeipoWithdraw } from "../models/smeipo.withdraw.model.js";
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
        path: "SMEIPOInvestments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "smeipoWithdrawals",
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



export const deleteClient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid client ID",
    });
  }

  const session = await mongoose.startSession();

  try {
    let deletedSummary = null;

    await session.withTransaction(async () => {
      const client = await Client.findById(id).session(session);

      if (!client) {
        const error = new Error("Client not found");
        error.statusCode = 404;
        throw error;
      }

      // 1. Find all investment records owned by this client.
      const [fds, mfs, smeipos] = await Promise.all([
        FDInvestment.find({ client: id }).select("_id").session(session),
        MFInvestment.find({ client: id }).select("_id").session(session),
        smeipo.find({ client: id }).select("_id").session(session),
      ]);

      const fdIds = fds.map((fd) => fd._id);
      const mfIds = mfs.map((mf) => mf._id);
      const smeipoIds = smeipos.map((ipo) => ipo._id);

      // 2. Delete FD withdrawal history.
      const fdWithdrawals = await FDWithdraw.deleteMany(
        { fd: { $in: fdIds } },
        { session }
      );

      // 3. Delete SME IPO withdrawal history.
      const smeipoWithdrawals = await smeipoWithdraw.deleteMany(
        { ipo: { $in: smeipoIds } },
        { session }
      );

      // 4. Delete periodic interest records belonging to this client.
      const interests = await AddInterest.deleteMany(
        { client: id },
        { session }
      );

      // 5. Delete investment records.
      const deletedFDs = await FDInvestment.deleteMany(
        { client: id },
        { session }
      );

      const deletedMFs = await MFInvestment.deleteMany(
        { client: id },
        { session }
      );

      const deletedSMEIPOs = await smeipo.deleteMany(
        { client: id },
        { session }
      );

      // 6. Remove the client reference from any associated user account.
      // This preserves the login account but prevents a dangling clientId.
      await User.updateMany(
        { clientId: client._id },
        { $unset: { clientId: "" } },
        { session }
      );

      // 7. Delete the client only after its dependent records are removed.
      await Client.deleteOne({ _id: client._id }, { session });

      deletedSummary = {
        client: 1,
        fdInvestments: deletedFDs.deletedCount,
        fdWithdrawals: fdWithdrawals.deletedCount,
        mfInvestments: deletedMFs.deletedCount,
        smeipoInvestments: deletedSMEIPOs.deletedCount,
        smeipoWithdrawals: smeipoWithdrawals.deletedCount,
        periodicInterests: interests.deletedCount,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Client and associated records deleted successfully",
      deleted: deletedSummary,
    });
  } catch (error) {
    console.error("Error deleting client:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode === 404
          ? error.message
          : "Failed to delete client and associated records",
      error:
        error.statusCode === 404
          ? undefined
          : error.message,
    });
  } finally {
    await session.endSession();
  }
};
