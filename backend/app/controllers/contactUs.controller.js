import { contactEmail } from "../utils/emailTemplate.js";
import { transporter } from "../utils/sendEmail.js";

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Send email to Berry AMC support
    const { subject, html } = contactEmail({ name, email, phone, message });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "prashantpky90@gmail.com",
      subject,
      html,
    });

    return res.status(200).json({
      message: "Message sent successfully. Our team will get back to you soon.",
      success: true,
    });

  } catch (error) {
    console.error("Error sending contact email:", error);
    return res.status(500).json({
      message: "Failed to send message. Please try again later.",
      success: false,
    });
  }
};
