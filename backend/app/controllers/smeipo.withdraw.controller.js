import mongoose from "mongoose";
import { smeipo } from "../models/smeipo.model.js";
import { smeipoWithdraw } from "../models/smeipo.withdraw.model.js";
import { Client } from "../models/client.model.js";
import { updateSMEIPOs } from "../utils/smeipoCalculation.js";

export const withdrawSMEIPO = async (req, res) => {
  const { smeipoId } = req.params;
  const { amount, date, valueAtWithdrawal } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid withdrawal amount",
    });
  }

  const session = await mongoose.startSession();
  let transactionCommitted = false;

  try {
    session.startTransaction();

    const ipo = await smeipo.findById(smeipoId).session(session);

    if (!ipo) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "SME IPO investment not found",
      });
    }

    if (amount > valueAtWithdrawal) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Amount greater than SME IPO value",
      });
    }

    const client = await Client.findById(ipo.client).session(session);

    if (!client) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const amountAdjustedinLT =
      Number(ipo.totalValue) - Number(valueAtWithdrawal);

    // Create withdrawal record
    const [withdraw] = await smeipoWithdraw.create(
      [
        {
          ipo: ipo._id,
          amount,
          valueAtWithdrawal,
          withdrawalDate: date,
        },
      ],
      { session },
    );

    // PARTIAL WITHDRAWAL
    if (amount < valueAtWithdrawal) {

      client.SMEIPOTotalValue =
        Number(client.SMEIPOTotalValue) - Number(ipo.totalValue);

      client.SMEIPOTotalInvested =
        Number(client.SMEIPOTotalInvested) - Number(ipo.investedValue);

      client.SMEIPOLTReturns =
        Number(client.SMEIPOLTReturns) - Number(amountAdjustedinLT);

      ipo.investedValue = Number(valueAtWithdrawal) - Number(amount);
      ipo.totalValue = ipo.investedValue;

      ipo.date = new Date(date);

      client.SMEIPOTotalValue =
        Number(client.SMEIPOTotalValue) + Number(ipo.investedValue);

      client.SMEIPOTotalInvested =
        Number(client.SMEIPOTotalInvested) + Number(ipo.investedValue);

      ipo.smeipoWithdrawals.push(withdraw._id);

      await ipo.save({ session });
      await client.save({ session });
    }

    // FULL WITHDRAWAL
    else {
      client.SMEIPOTotalValue =
        Number(client.SMEIPOTotalValue) - Number(ipo.totalValue);

      client.SMEIPOTotalInvested =
        Number(client.SMEIPOTotalInvested) - Number(ipo.investedValue);

      client.SMEIPOLTReturns =
        Number(client.SMEIPOLTReturns) - Number(amountAdjustedinLT);

      if (client.SMEIPOTotalInvested < 1) {
        client.SMEIPOTotalValue = 0;
        client.SMEIPOTotalInvested = 0;
      }

      ipo.totalValue = 0;
      ipo.investedValue = 0;
      ipo.rate = 0;
      ipo.status = "closed";

      ipo.smeipoWithdrawals.push(withdraw._id);

      await ipo.save({ session });
      await client.save({ session });
    }

    await session.commitTransaction();
    transactionCommitted = true;

    await updateSMEIPOs();

    return res.status(200).json({
      success: true,
      message: "Amount withdrawn successfully",
      data: withdraw,
    });
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction();
    }

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Amount withdrawal failed",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
