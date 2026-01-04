import mongoose from "mongoose";
import dotenv from "dotenv";
import { FDInvestment } from "./app/models/fdInvestment.model.js";

dotenv.config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected for migration");

    const result = await FDInvestment.updateMany(
      {
        investedAtBeginning: { $exists: false },
        investedDate: { $exists: false },
      },
      [
        {
          $set: {
            investedAtBeginning: "$investedValue",
            investedDate: "$date",
          },
        },
      ]
    );

    console.log("Migration result:", result);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
