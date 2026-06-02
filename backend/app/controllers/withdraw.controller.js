import mongoose from "mongoose";
import { FDInvestment } from "../models/fdInvestment.model.js";
import { FDWithdraw } from "../models/fdwithdraw.model.js";
import { Client } from "../models/client.model.js";
import { updateFDs } from "../utils/fdCalculation.js";

export const withdrawFD = async (req, res) => {
  const { fdId } = req.params;
  const { amount, date, fdValueAtWithdrawal } = req.body;

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
    const fd = await FDInvestment.findById(fdId).session(session);

    if (!fd) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "FD not found",
      });
    }

    if (amount > fdValueAtWithdrawal) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Amount greater than FD total value",
      });
    }

    const client = await Client.findById(fd.client).session(session);
    if (!client) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const amountAdjustedinLT=Number(fd.totalValue)-Number(fdValueAtWithdrawal);

    // 1️⃣ Create withdrawal record
    const [withdraw] = await FDWithdraw.create(
      [
        {
          fd: fd._id,
          amount,
          fdValueAtWithdrawal,
          withdrawalDate: date,
        },
      ],
      { session },
    );

    // 2️⃣ PARTIAL WITHDRAWAL
    if (Number(fdValueAtWithdrawal)>Number(amount)) {
      client.FDTotalValue =
        Number(client.FDTotalValue) - Number(fd.totalValue);

      client.FDTotalInvested =
        Number(client.FDTotalInvested) - Number(fd.investedValue);

      client.FDLTReturns =
        Number(client.FDLTReturns) - Number(amountAdjustedinLT);

      fd.totalValue -= amount;
      fd.investedValue = fd.totalValue;

      fd.investedValue = Number(fdValueAtWithdrawal) - Number(amount);
      fd.totalValue = fd.investedValue;
      fd.date = new Date(date);

      // Update client totals (incremental)

      client.FDTotalValue =
        Number(client.FDTotalValue) + Number(fd.investedValue);

      client.FDTotalInvested =
        Number(client.FDTotalInvested) + Number(fd.investedValue);

      fd.FDWithdrawals.push(withdraw._id);

      await fd.save({ session });
      await client.save({ session });
    }

    // 3️⃣ FULL WITHDRAWAL (FD CLOSE)
    else {
      // Update client totals
      client.FDTotalValue =
        Number(client.FDTotalValue) - Number(fd.totalValue);

      client.FDTotalInvested =
        Number(client.FDTotalInvested) - Number(fd.investedValue);

      client.FDLTReturns =
        Number(client.FDLTReturns) - Number(amountAdjustedinLT);

      if (client.FDTotalInvested < 1) {
        client.FDTotalValue = 0;
        client.FDTotalInvested = 0;
      }


      // Update FD instead of deleting
      fd.totalValue = 0;
      fd.investedValue = 0;
      fd.rate = 0;
      fd.status = "closed";
      

      fd.FDWithdrawals.push(withdraw._id);

      await fd.save({ session });
      await client.save({ session });
    }

    await session.commitTransaction();
    transactionCommitted = true;

    await updateFDs();

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
