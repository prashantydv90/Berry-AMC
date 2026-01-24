import express from "express";
import { sendContactEmail } from "../controllers/contactUs.controller.js";


const contactUsRouter = express.Router();

contactUsRouter.post("/contact", sendContactEmail);

export default contactUsRouter;
