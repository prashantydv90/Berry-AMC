import mongoose from "mongoose";

const smeipoWithdrawSchema = new mongoose.Schema(
  {
    ipo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "smeipo",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    valueAtWithdrawal:{
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

export const smeipoWithdraw = mongoose.model("smeipoWithdraw", smeipoWithdrawSchema);
