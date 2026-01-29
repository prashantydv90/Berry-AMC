// models/Buyback.js
import mongoose from "mongoose";

const buybackSchema = new mongoose.Schema({
  symbol: String,
  companyName: String,
  desc: String,
  details: String,
  broadcastAt: { type: Date, required: true },
  pdfUrl: String,
}, { timestamps: true });

buybackSchema.index(
  { symbol: 1, broadcastAt: 1 },
  { unique: true }
);

export const Buyback = mongoose.model("Buyback", buybackSchema);

