import mongoose from "mongoose";

const fdinvestmentSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    investedAtBeginning: {type: Number,required: true},
    investedValue: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    date:{ type: Date, required: true }, 
    investedDate:{type:Date, required:true},  
    rate:{type:Number,required:true},
    
    FDWithdrawals:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"FDWithdraw"
      }
    ],
  },
  { timestamps: true }
);

export const FDInvestment = mongoose.model("FDInvestment", fdinvestmentSchema);




// import mongoose from "mongoose";

// const fdinvestmentSchema = new mongoose.Schema(
//   {
//     client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    
//     investedValue: { type: Number, required: true },
//     totalValue: { type: Number, required: true },
//     date:{ type: Date, required: true },   
//     rate:{type:Number,required:true}, 
//   },
//   { timestamps: true }
// );

// export const FDInvestment = mongoose.model("FDInvestment", fdinvestmentSchema);
