
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email via SendGrid Web API
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM,
      subject,
      html,
    };
    await sgMail.send(msg);
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error.response ? error.response.body : error);
    throw error;
  }
};
