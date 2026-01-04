import mongoose from "mongoose";

const fdWithdrawSchema = new mongoose.Schema(
  {
    fd: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FDInvestment",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    fdValueAtWithdrawal:{
        type: Number,
        required:true,
    },
    withdrawalDate:{
      type:Date,
      required:true
    }
  },
  { timestamps: true }
);

export const FDWithdraw = mongoose.model("FDWithdraw", fdWithdrawSchema);
