import mongoose from "mongoose";

const addInterestSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    startMonth: { type: String, required: true },
    endMonth: { type: String, required: true }, 
    totalValue: {type:String, required:true},
    returns: { type: Number, required: true }, 
  },
  { timestamps: true }
);

export const AddInterest = mongoose.model("AddInterest", addInterestSchema);
