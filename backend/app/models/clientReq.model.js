import mongoose from "mongoose";

const clientReqSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, required: true }, // ✅ Changed to String (safer for leading zeros, country codes)
    address: { type: String, required: true },
    PAN: { type: String, unique: true, required: true, uppercase: true },
  },
  { timestamps: true }
);

export const ClientReq = mongoose.model("ClientReq", clientReqSchema);
