import { contactEmail } from "../utils/emailTemplate.js";
import { sendEmail } from "../utils/sendEmail2.js";



export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const { subject, html } = contactEmail({ name, email, phone, message });

    await sendEmail({
      to: "support@berryamc.in",
      subject,
      html,
      from: `"${name}" <no-reply@berryamc.com>`,
    });

    res.status(200).json({
      message: "Message sent successfully. Our team will get back to you soon.",
      success: true,
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({
      message: "Failed to send message. Please try again later.",
      success: false,
    });
  }
};
