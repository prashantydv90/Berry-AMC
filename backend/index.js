import express from "express"
import mongoose from "mongoose";
import cron from "node-cron";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./app/routers/user.routes.js";
import clientRouter from "./app/routers/client.routes.js";
import clientReqRouter from "./app/routers/clientReq.routes.js";
import investmentRouter from "./app/routers/investment.routes.js";
import interestRouter from "./app/routers/interest.routes.js";
import { updateFDs } from "./app/utils/fdCalculation.js";
import cookieParser from "cookie-parser";
import contactUsRouter from "./app/routers/contactUs.routes.js";
import withdrawRouter from "./app/routers/withdraw.routes.js";

dotenv.config();

console.log(process.env.EMAIL_USER)
const app=express();
app.use(express.json())
app.use(cookieParser());

const corsOptions={
  origin:process.env.CURL,
  credentials:true
}
app.use(cors(corsOptions));

app.use('/api',userRouter);
app.use('/api',clientRouter);
app.use('/api',clientReqRouter);
app.use('/api',investmentRouter);
app.use('/api',interestRouter);
app.use('/api',contactUsRouter);
app.use('/api',withdrawRouter);

app.get("/ping", (req, res) => {
  res.status(200).send("alive");
});



cron.schedule("0 0 * * *", () => {
  console.log("⏰ Running daily FD updater...");
  updateFDs();
});

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 2223,()=>{
        console.log("server listen on PORT",process.env.PORT || 5556);
    })
}).catch((err)=>{
    console.log("mongo connection error",err);
})