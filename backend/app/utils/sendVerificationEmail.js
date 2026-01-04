import { sendEmail } from "./sendEmail2.js";

export const sendVerificationEmail = async (name, email, otp) => {
  const html = `
    <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4;padding:30px;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);padding:30px;">
        <h2 style="text-align:center;color:#4F46E5;">Berry AMC</h2>
        <hr style="border:none;height:2px;background:#4F46E5;width:60px;margin:10px auto 25px;" />
        <p style="font-size:16px;color:#333;">Hi <b>${name}</b>,</p>
        <p style="font-size:15px;color:#333;line-height:1.6;">
          Thank you for signing up with <b>Berry AMC</b>!  
          To complete your registration, please verify your email address using the One Time Password (OTP) below:
        </p>
        <div style="text-align:center;margin:30px 0;">
          <span style="display:inline-block;background:#4F46E5;color:#fff;padding:15px 40px;border-radius:8px;font-size:22px;letter-spacing:3px;font-weight:bold;">
            ${otp}
          </span>
        </div>
        <p style="font-size:14px;color:#555;line-height:1.6;">
          This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.
          If you did not request this verification, you can safely ignore this email.
        </p>
        <p style="font-size:14px;color:#777;margin-top:25px;">
          Best regards,<br />
          <b>Berry AMC Team</b><br />
          <a href="https://berryamc.in" style="color:#4F46E5;text-decoration:none;">www.berryamc.in</a>
        </p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      to: email,
      subject: "🔐 Verify Your Email - One Time Password (OTP)",
      html,
    });
    console.log("Verification email sent successfully to", email);
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }
};