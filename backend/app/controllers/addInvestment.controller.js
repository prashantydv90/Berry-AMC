import { AddInterest } from "../models/addInterest.model.js";
import { Client } from "../models/client.model.js";
import { FDInvestment } from "../models/fdInvestment.model.js";
import { MFInvestment } from "../models/mfInvestment.model.js";
import { updateFDs } from "../utils/fdCalculation.js";

export const addMFInvestment = async (req, res) => {
  try {
    const { clientId, investedValue, totalValue, date } = req.body;

    // Validate input
    if (!clientId || !investedValue || !totalValue || !date) {
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
    
    if (investedValue < 0) {
      const withdrawal = Math.abs(investedValue); // positive number

      const totalValue = Number(client.MFTotalValue || 0);
      const totalInvested = Number(client.MFTotalInvested || 0);
      const totalReturns = Number(client.MFReturns || 0);

      // Safety check
      if (totalValue === 0) return;

      // Proportion of returns in portfolio
      const returnRatio = totalReturns / totalValue;

      // Split withdrawal
      let returnWithdrawn = withdrawal * returnRatio;
      let principalWithdrawn = withdrawal - returnWithdrawn;

      // ✅ ROUND RETURN PART (see below)
      returnWithdrawn = Math.round(returnWithdrawn);
      principalWithdrawn = withdrawal - returnWithdrawn;

      // Update totals
      client.MFTotalValue = totalValue - withdrawal;
      client.MFTotalInvested = totalInvested - principalWithdrawn;
      client.MFReturns = totalReturns - returnWithdrawn;
      // totalValue=client.MFTotalInvested;
    } else {
      client.MFTotalValue =
        Number(client.MFTotalValue || 0) + Number(investedValue);
      client.MFTotalInvested =
        Number(client.MFTotalInvested || 0) + Number(investedValue);
    }

    const newInvestment = await MFInvestment.create({
      client: clientId,
      investedValue,
      totalValue: investedValue > 0 ? totalValue : client.MFTotalInvested,
      date,
    });

    // Push reference into client
    client.MFInvestments.push(newInvestment._id);

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
    if (!clientId || !investedValue || !totalValue || !date) {
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

    const currDate = new Date();
    const inputDate = new Date(date);
    if (inputDate > currDate) {
      return res.status(400).json({
        message: "Invalid Date",
        success: false,
      });
    }

    // Create investment
    const newInvestment = await FDInvestment.create({
      client: clientId,
      investedValue,
      investedAtBeginning: investedValue,
      investedDate: date,
      totalValue: investedValue,
      date,
      rate: 12,
    });

    // Push reference into client
    client.FDInvestments.push(newInvestment._id);
    client.FDTotalValue =
      Number(client.FDTotalValue || 0) + Number(investedValue);
    client.FDTotalInvested =
      Number(client.FDTotalInvested || 0) + Number(investedValue);
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

export const editMFInvestment = async (req, res) => {
  try {
    const investmentId = req.params.id;
    const {
      investedValue: newInvestedValueRaw,
      totalValue: newTotalValueRaw,
      date: newDateRaw,
    } = req.body;

    if (!investmentId)
      return res
        .status(400)
        .json({ message: "Investment ID required", success: false });

    const investment = await MFInvestment.findById(investmentId);
    if (!investment)
      return res
        .status(404)
        .json({ message: "Investment not found", success: false });

    const client = await Client.findById(investment.client);
    if (!client)
      return res
        .status(404)
        .json({ message: "Client not found", success: false });

    // Capture old values before overwriting
    const oldInvestedValue = Number(investment.investedValue || 0);
    const oldTotalValue = Number(investment.totalValue || 0);
    const oldDate = investment.date ? new Date(investment.date) : null;

    // Parse new incoming values (fall back to old if not provided)
    const newInvestedValue =
      newInvestedValueRaw !== undefined
        ? Number(newInvestedValueRaw)
        : oldInvestedValue;
    const newTotalValue =
      newTotalValueRaw !== undefined ? Number(newTotalValueRaw) : oldTotalValue;
    const newDate = newDateRaw ? new Date(newDateRaw) : oldDate;

    // --- 1) Update client totals by removing old investment contribution
    client.MFTotalInvested =
      Number(client.MFTotalInvested || 0) - oldInvestedValue;
    client.MFTotalValue = Number(client.MFTotalValue || 0) - oldTotalValue;

    // --- 2) Update the investment document
    investment.investedValue = newInvestedValue;
    investment.totalValue = newTotalValue;
    if (newDate) investment.date = newDate;
    await investment.save();

    // --- 3) Add new investment contribution back to client totals
    client.MFTotalInvested = Number(client.MFTotalInvested) + newInvestedValue;
    client.MFTotalValue = Number(client.MFTotalValue) + newTotalValue;
    await client.save();

    // --- 5) Update returns (AddInterest) according to the logic you specified:
    //    * If return.endDate > oldDate (i.e., previously included old investment)
    //       - and newDate > return.endDate -> remove oldInvestedValue from that return
    //       - and newDate <= return.endDate -> it still includes the investment => shift by delta
    //    * If return.endDate <= oldDate (previously excluded)
    //       - and newDate <= return.endDate -> now it should include newInvestedValue => add newInvestedValue
    // Note: we iterate all returns for the client and apply above rules.
    const allReturns = await AddInterest.find({ client: client._id }).sort({
      endDate: 1,
    });

    for (const ret of allReturns) {
      // Normalize endDate for comparison (assume stored as Date)
      const retEnd = ret.endMonth ? new Date(ret.endMonth) : null;
      if (!retEnd) continue;

      // Compare with old and new dates (if oldDate is null treat as not included)
      const wasIncluded = oldDate ? retEnd > oldDate : false;
      const nowIncluded = newDate ? retEnd > newDate : false;

      if (wasIncluded && nowIncluded) {
        // Previously included and still included -> shift by delta (new - old)
        const delta = newInvestedValue - oldInvestedValue;
        ret.totalValue = Number(ret.totalValue || 0) + delta;
        await ret.save();
      } else if (wasIncluded && !nowIncluded) {
        // Previously included but now excluded -> remove old invested value
        ret.totalValue = Number(ret.totalValue || 0) - oldInvestedValue;
        await ret.save();
      } else if (!wasIncluded && nowIncluded) {
        // Previously excluded but now included -> add new invested value
        ret.totalValue = Number(ret.totalValue || 0) + newInvestedValue;
        await ret.save();
      } else {
        // neither included before nor now -> no change
        continue;
      }
    }

    return res.status(200).json({
      message: "Investment updated successfully",
      success: true,
      data: investment,
    });
  } catch (error) {
    console.error("Error editing MF investment:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteMFInvestment = async (req, res) => {
  try {
    const { investmentId } = req.params;
    if (!investmentId) {
      return res.status(400).json({
        message: "Investment ID required",
        success: false,
      });
    }

    // Fetch the investment
    const investment = await MFInvestment.findById(investmentId);
    if (!investment)
      return res.status(404).json({
        message: "Investment not found",
        success: false,
      });

    // Fetch the client
    const client = await Client.findById(investment.client);
    if (!client)
      return res.status(404).json({
        message: "Client not found",
        success: false,
      });

    // Fetch all returns (sorted by endMonth)
    const returnsList = await AddInterest.find({ client: client._id }).sort({
      endMonth: 1,
    });

    // Track if we modified any returns or client values
    let clientValueAdjustment = 0;

    for (const ret of returnsList) {
      if (new Date(ret.endMonth) >= new Date(investment.date)) {
        ret.totalValue =
          Number(ret.totalValue || 0) - Number(investment.investedValue || 0);
        if (ret.totalValue < 0) ret.totalValue = 0;

        if (Number(ret.totalValue) === Number(ret.returns)) {
          // Delete return (no active investment supports it)
          await AddInterest.findByIdAndDelete(ret._id);

          // Remove return reference
          client.MFPeriodicInterest = client.MFPeriodicInterest.filter(
            (id) => id.toString() !== ret._id.toString()
          );

          // Adjust total value
          clientValueAdjustment -= Number(ret.returns || 0);
        } else {
          await ret.save();
        }
      }
    }

    // Update client totals safely
    client.MFTotalInvested -= Number(investment.investedValue || 0);
    client.MFTotalValue -=
      Number(investment.investedValue || 0) + Math.abs(clientValueAdjustment);
    client.MFReturns -= Math.abs(clientValueAdjustment);

    if (client.MFTotalInvested < 0) client.MFTotalInvested = 0;
    if (client.MFTotalValue < 0) client.MFTotalValue = 0;
    if (client.MFReturns < 0) client.MFReturns = 0;

    // Remove investment reference
    client.MFInvestments = client.MFInvestments.filter(
      (id) => id.toString() !== investmentId
    );

    // Save once — prevents version conflict
    await client.save({ validateModifiedOnly: true });

    // Delete investment last
    await MFInvestment.findByIdAndDelete(investmentId);

    return res.status(200).json({
      message: "MF Investment deleted successfully and returns adjusted",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting MF investment:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const editFDInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const { investedValue, date } = req.body;

    // Validation
    if (!investedValue || !date) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const fd = await FDInvestment.findById(id);
    if (!fd)
      return res.status(404).json({
        message: "FD investment not found",
        success: false,
      });

    const client = await Client.findById(fd.client);
    if (!client)
      return res.status(404).json({
        message: "Client not found",
        success: false,
      });

    const currDate = new Date();
    const inputDate = new Date(date);
    if (inputDate > currDate) {
      return res.status(400).json({
        message: "Invalid Date",
        success: false,
      });
    }

    fd.investedValue = Number(investedValue);
    fd.investedAtBeginning=Number(investedValue);
    fd.date = date;
    fd.investedDate=date;

    await fd.save();

    await updateFDs();

    return res.status(200).json({
      message: "FD Investment updated successfully",
      success: true,
      data: fd,
    });
  } catch (error) {
    console.error("Error editing FD investment:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteFDInvestment = async (req, res) => {
  try {
    const { investmentId } = req.params;
    if (!investmentId)
      return res
        .status(400)
        .json({ message: "Investment ID required", success: false });

    const investment = await FDInvestment.findById(investmentId);
    if (!investment)
      return res
        .status(404)
        .json({ message: "Investment not found", success: false });

    const client = await Client.findById(investment.client);
    if (client) {
      client.FDTotalInvested -= Number(investment.investedValue);
      client.FDTotalValue -= Number(investment.totalValue);
      client.FDInvestments = client.FDInvestments.filter(
        (id) => id.toString() !== investmentId
      );
      if (client.FDInvestments.length === 0) {
        client.FDTotalInvested = 0;
        client.FDTotalValue = 0;
      }
      await client.save();
    }

    await investment.deleteOne();
    await updateFDs();

    return res.status(200).json({
      message: "FD Investment deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting FD investment:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const resetMFInvestment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Client ID required", success: false });
    }

    const client = await Client.findById(id);
    if (!client) {
      return res
        .status(404)
        .json({ message: "Client not found", success: false });
    }

    // --- Step 1: Delete all linked MF investments ---
    if (client.MFInvestments && client.MFInvestments.length > 0) {
      await MFInvestment.deleteMany({ _id: { $in: client.MFInvestments } });
    }

    // --- Step 2: Delete all linked periodic interest records ---
    if (client.MFPeriodicInterest && client.MFPeriodicInterest.length > 0) {
      await AddInterest.deleteMany({ _id: { $in: client.MFPeriodicInterest } });
    }

    // --- Step 3: Reset arrays and totals in client document ---
    client.MFInvestments = [];
    client.MFPeriodicInterest = [];
    client.MFTotalInvested = "0";
    client.MFTotalValue = "0";
    client.MFReturns="0";

    await client.save();

    return res.status(200).json({
      message: "All MF investments and related interests removed successfully.",
      success: true,
      client,
    });
  } catch (error) {
    console.error("Error resetting investments:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
