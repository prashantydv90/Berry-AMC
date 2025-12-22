
// import sgMail from "@sendgrid/mail";
// import dotenv from "dotenv";
// dotenv.config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// /**
//  * Send an email via SendGrid Web API
//  * @param {string} to - Recipient email
//  * @param {string} subject - Email subject
//  * @param {string} html - HTML content
//  */

// export const sendEmail = async ({ to, subject, html }) => {
//   try {
//     const msg = {
//       to,
//       from: process.env.EMAIL_FROM,
//       subject,
//       html,
//     };
//     await sgMail.send(msg);
//     console.log("Email sent successfully to", to);
//   } catch (error) {
//     console.error("Error sending email:", error.response ? error.response.body : error);
//     throw error;
//   }
// };





import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const res = await axios.post(
      "https://api.smtp2go.com/v3/email/send",
      {
        api_key: process.env.SMTP2GO_API_KEY,
        to,
        sender: process.env.EMAIL_FROM,
        subject,
        html_body: html,
      }
    );

    if (res.data.data.failed > 0) {
      throw new Error("SMTP2GO failed to send email");
    }

    console.log("Email sent (SMTP2GO API) →", to);
  } catch (err) {
    console.error("SMTP2GO API error:", err.response?.data || err.message);
    throw err;
  }
};
