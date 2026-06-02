import mongoose from "mongoose";

const smeipoSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    investedAtBeginning: { type: Number, required: true },
    investedValue: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    date: { type: Date, required: true },
    investedDate: { type: Date, required: true },
    rate: { type: Number, required: true },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },

    smeipoWithdrawals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "smeipoWithdraw",
      },
    ],
  },
  { timestamps: true },
);

export const smeipo = mongoose.model("smeipo", smeipoSchema);


