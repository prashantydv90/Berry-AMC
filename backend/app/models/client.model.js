import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, required: true }, // ✅ Changed to String (safer for leading zeros, country codes)
    address: { type: String, required: true },
    PAN: { type: String, unique: true, required: true, uppercase: true },
    MFTotalInvested:{type:String, default: "0"},
    MFTotalValue:{type:String, default: "0"},
    MFReturns:{type:String, default: "0"},
    FDTotalInvested:{type:String,default:"0"},
    FDTotalValue:{type:String, default: "0"},

    MFPeriodicInterest:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"AddInterest"
      }
    ],

    // ✅ A client can have multiple investments
    MFInvestments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MFInvestment",
      },
    ],

    FDInvestments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FDInvestment",
      },
    ],
    
  },
  { timestamps: true }
);

export const Client = mongoose.model("Client", clientSchema);
