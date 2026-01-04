
import mongoose from "mongoose";
import { FDInvestment } from "../models/fdInvestment.model.js";
import { FDWithdraw } from "../models/fdwithdraw.model.js";
import { Client } from "../models/client.model.js";
import { updateFDs } from "../utils/fdCalculation.js";

export const withdrawFD = async (req, res) => {
  const { fdId } = req.params;
  const { amount,date } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid withdrawal amount",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const fd = await FDInvestment.findById(fdId).session(session);

    if (!fd) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "FD not found",
      });
    }

    if (amount > fd.totalValue) {
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

    // 1️⃣ Create withdrawal record
    const [withdraw] = await FDWithdraw.create(
      [
        {
          fd: fd._id,
          amount,
          fdValueAtWithdrawal:fd.totalValue,
          withdrawalDate:date,
        },
      ],
      { session }
    );

    // 2️⃣ PARTIAL WITHDRAWAL
    if (amount < fd.totalValue) {
        client.FDTotalValue -= amount;
      client.FDTotalInvested -= fd.investedValue;

      fd.totalValue -= amount;
      fd.investedValue = fd.totalValue;
      fd.date = new Date(date);

      // Update client totals (incremental)
      
      client.FDTotalInvested += fd.investedValue;

      fd.FDWithdrawals.push(withdraw._id);

      await fd.save({ session });
      await client.save({ session });
    }

    // 3️⃣ FULL WITHDRAWAL (FD CLOSE)
    else {
      // Remove all withdrawals
      await FDWithdraw.deleteMany({ fd: fd._id }).session(session);

      // Update client totals
      client.FDTotalValue -= fd.totalValue;
      client.FDTotalInvested -= fd.investedValue;
      if(client.FDTotalValue<1){
        client.FDTotalValue=0;
        client.FDTotalInvested=0;
      }

      // Remove FD reference from client
      client.FDInvestments.pull(fd._id);

      await client.save({ session });

      // Delete FD
      await FDInvestment.deleteOne({ _id: fd._id }).session(session);
    }

    await session.commitTransaction();
    session.endSession();

    // Recalculate interest after commit
    await updateFDs();

    return res.status(200).json({
      success: true,
      message: "Amount withdrawn successfully",
      data: withdraw,
    });

  } catch (error) {
    await session.abortTransaction();
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
