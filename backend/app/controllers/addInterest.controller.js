import { AddInterest } from "../models/addInterest.model.js";
import { Client } from "../models/client.model.js";
import { MFInvestment } from "../models/mfInvestment.model.js";

export const addInterest = async (req, res) => {
  try {
    const { startMonth, endMonth, returns } = req.body;
    const clientId = req.params.id;

    if (!startMonth || !endMonth || !returns) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    if (new Date(startMonth) > new Date(endMonth)) {
      return res.status(400).json({
        message: "Invalid End Date",
        success: false,
      });
    }
    const lastInterest = await AddInterest.findOne({ client: clientId }).sort({
      endMonth: -1,
    });

    if (
      lastInterest &&
      new Date(lastInterest.endMonth) > new Date(startMonth)
    ) {
      return res.status(400).json({
        message: "Invalid Date",
        success: false,
      });
    }

    // ✅ Check client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        message: "Client not found",
        success: false,
      });
    }

    // ✅ Find all MF investments for this client within the period
    const investmentsInPeriod = await MFInvestment.find({
      client: clientId,
      date: {
        // $gte: new Date(startMonth),
        $lte: new Date(endMonth),
      },
    });

    let totalInvestmentValue = 0;
    if (investmentsInPeriod.length > 0) {
      totalInvestmentValue = investmentsInPeriod.reduce(
        (sum, inv) => sum + Number(inv.investedValue || 0),
        0
      );
    }

    // latest return

    // ✅ Get all previous returns strictly before this period
    const previousReturns = await AddInterest.find({
      client: clientId,
      endMonth: { $lt: new Date(startMonth) },
    });

    // ✅ Sum all previous returns
    const lastReturnTotal = previousReturns.reduce(
      (sum, ret) => sum + Number(ret.returns || 0),
      0
    );

    // ✅ Compute totalValue = (last return’s totalValue) + (sum of investments in period) + (returns)
    const finalTotalValue =
      Number(lastReturnTotal) + Number(totalInvestmentValue) + Number(returns);

    // ✅ Create the interest entry
    const newInterest = await AddInterest.create({
      client: clientId,
      startMonth,
      endMonth,
      returns,
      totalValue: finalTotalValue,
    });

    // ✅ Link this interest to the client record
    client.MFPeriodicInterest.push(newInterest._id);
    client.MFTotalValue = Number(client.MFTotalValue) + Number(returns);
    client.MFReturns = Number(client.MFReturns) + Number(returns);
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

export const editReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { startMonth, endMonth, returns } = req.body;

    if (!startMonth || !endMonth || returns === undefined) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    if (new Date(startMonth) > new Date(endMonth)) {
      return res.status(400).json({
        message: "Invalid date range",
        success: false,
      });
    }

    // ✅ Fetch return record
    const returnRecord = await AddInterest.findById(id);
    if (!returnRecord) {
      return res.status(404).json({
        message: "Return record not found",
        success: false,
      });
    }

    // ✅ Fetch client via returnRecord.client
    const client = await Client.findById(returnRecord.client);
    if (!client) {
      return res.status(404).json({
        message: "Client not found",
        success: false,
      });
    }

    // ✅ Ensure this is the latest return (only last one can be edited)
    const latestReturn = await AddInterest.findOne({ client: client._id }).sort(
      { endMonth: -1 }
    );
    if (latestReturn._id.toString() !== id) {
      return res.status(400).json({
        message: "Only the latest return can be edited",
        success: false,
      });
    }

    // ✅ Check for overlap with previous return
    const previousInterest = await AddInterest.findOne({
      client: client._id,
      _id: { $ne: id },
    }).sort({ endMonth: -1 });

    if (
      previousInterest &&
      new Date(previousInterest.endMonth) > new Date(startMonth)
    ) {
      return res.status(400).json({
        message: "Invalid Date: Overlaps with previous return period",
        success: false,
      });
    }

    // ✅ Recalculate investments that fall in the new date range
    const investmentsInPeriod = await MFInvestment.find({
      client: client._id,
      date: {
        $gte: new Date(startMonth),
        $lte: new Date(endMonth),
      },
    });

    const totalInvestmentValue = investmentsInPeriod.reduce(
      (sum, inv) => sum + Number(inv.investedValue || 0),
      0
    );

    // ✅ Get the previous return’s total value (for continuity)
    const prevReturnTotal = previousInterest
      ? Number(previousInterest.totalValue)
      : 0;

    // ✅ Calculate new total value
    const newReturnValue = Number(returns);
    const updatedTotalValue =
      prevReturnTotal + totalInvestmentValue + newReturnValue;

    // ✅ Adjust client total (remove old returns, add new)
    const oldReturnValue = Number(returnRecord.returns || 0);
    const diff = newReturnValue - oldReturnValue;
    client.MFTotalValue = Number(client.MFTotalValue) + diff;
    client.MFReturns = Number(client.MFReturns) + diff;

    // ✅ Update the return record
    returnRecord.startMonth = startMonth;
    returnRecord.endMonth = endMonth;
    returnRecord.returns = newReturnValue;
    returnRecord.totalValue = updatedTotalValue;

    await returnRecord.save();
    await client.save();

    return res.status(200).json({
      message: "Return updated successfully",
      success: true,
      data: returnRecord,
    });
  } catch (error) {
    console.error("Error editing return:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteInterest = async (req, res) => {
  try {
    const { interestId } = req.params;

    if (!interestId) {
      return res.status(400).json({
        message: "Interest ID required",
        success: false,
      });
    }

    // ✅ Find the interest record
    const interest = await AddInterest.findById(interestId);
    if (!interest) {
      return res.status(404).json({
        message: "Interest record not found",
        success: false,
      });
    }

    // ✅ Find the client
    const client = await Client.findById(interest.client);
    if (!client) {
      return res.status(404).json({
        message: "Client not found",
        success: false,
      });
    }

    // ✅ Update client's totals
    client.MFTotalValue -= Number(interest.returns || 0);
    if (client.MFTotalValue < 0) client.MFTotalValue = 0; // safety
    client.MFReturns -= Number(interest.returns || 0);
    if (client.MFReturns < 0) client.MFReturns = 0; // safety

    // ✅ Remove interest from client record
    client.MFPeriodicInterest = client.MFPeriodicInterest.filter(
      (id) => id.toString() !== interestId
    );

    await client.save();

    // ✅ Delete the interest record
    await interest.deleteOne();

    return res.status(200).json({
      message: "Interest deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting interest:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
