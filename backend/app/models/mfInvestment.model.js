import mongoose from "mongoose";

const mfinvestmentSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    investedValue: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    date:{ type: Date, required: true }, 

    // ✅ Store multiple interests for this investment
    periodicInterest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddInterest",
      },
    ],
  },
  { timestamps: true }
);

export const MFInvestment = mongoose.model("MFInvestment", mfinvestmentSchema);
