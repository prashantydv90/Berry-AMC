import mongoose from "mongoose";

const ipoSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    series: {
      type: String,
      enum: ["EQ", "SME"],
      required: true,
    },

    issueStartDate: {
      type: Date,
      required: true,
    },

    issueEndDate: {
      type: Date,
      required: true,
    },

    priceBand: {
      type: String, // "₹857 – ₹900"
      required: true,
    },

    issueSize: {
      type: Number, // number of shares
      required: true,
    },

    overallSubscription: {
      type: String, // "0.81x", "--"
      default: "--",
    },

    status: {
      type: String,
      enum: ["Open", "Closed", "Upcoming"],
      required: true,
      index: true,
    },

  },
  {
    timestamps: true,
  }
);

export const IPO = mongoose.model("IPO", ipoSchema);
