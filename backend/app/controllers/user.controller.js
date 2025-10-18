import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { sendMail, transporter } from "../utils/sendEmail.js";
import { Client } from "../models/client.model.js";
import bcrypt from "bcryptjs";

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    const existingClient = await Client.findOne({ email });

    // Case 1: User already exists and is verified
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        message: "Email already exists.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Case 2: User exists but not verified → resend OTP and update password
    if (existingUser && !existingUser.isVerified) {
      existingUser.password = hashedPassword;
      existingUser.name = name;
      existingUser.otp = otp;
      if (existingClient) existingUser.clientId = existingClient._id; // link client if exists
      await existingUser.save();

      transporter.sendMail({
        from: `"Berry AMC" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: "🔐 Verify Your Email - One Time Password (OTP)",
        html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
        <h2 style="text-align: center; color: #4F46E5;">Berry AMC</h2>
        <hr style="border: none; height: 2px; background: #4F46E5; width: 60px; margin: 10px auto 25px;" />
        <p style="font-size: 16px; color: #333;">
          Hi <b>${existingUser.name}</b>,
        </p>
        <p style="font-size: 15px; color: #333; line-height: 1.6;">
          Thank you for signing up with <b>Berry AMC</b>!  
          To complete your registration, please verify your email address using the One Time Password (OTP) below:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background: #4F46E5; color: #fff; padding: 15px 40px; border-radius: 8px; font-size: 22px; letter-spacing: 3px; font-weight: bold;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #555; line-height: 1.6;">
          This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.
          If you did not request this verification, you can safely ignore this email.
        </p>

        <p style="font-size: 14px; color: #777; margin-top: 25px;">
          Best regards,<br />
          <b>Berry AMC Team</b><br />
          <a href="https://berryamc.in" style="color: #4F46E5; text-decoration: none;">www.myapp.com</a>
        </p>
      </div>
    </div>
  `,
      });

      return res.status(200).json({
        message: "Account created. Please verify OTP.",
        success: true,
      });
    }

    // Case 3: New user → create record
    const user = await User.create({
      email,
      password:hashedPassword,
      name,
      clubId: null,
      otp,
      isVerified: false,
      clientId: existingClient ? existingClient._id : null,
    });

    transporter.sendMail({
      from: `"Berry AMC" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "🔐 Verify Your Email - One Time Password (OTP)",
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
        <h2 style="text-align: center; color: #4F46E5;">Berry AMC</h2>
        <hr style="border: none; height: 2px; background: #4F46E5; width: 60px; margin: 10px auto 25px;" />
        <p style="font-size: 16px; color: #333;">
          Hi <b>${user.name}</b>,
        </p>
        <p style="font-size: 15px; color: #333; line-height: 1.6;">
          Thank you for signing up with <b>Berry AMC</b>!  
          To complete your registration, please verify your email address using the One Time Password (OTP) below:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background: #4F46E5; color: #fff; padding: 15px 40px; border-radius: 8px; font-size: 22px; letter-spacing: 3px; font-weight: bold;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #555; line-height: 1.6;">
          This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.
          If you did not request this verification, you can safely ignore this email.
        </p>

        <p style="font-size: 14px; color: #777; margin-top: 25px;">
          Best regards,<br />
          <b>Berry AMC Team</b><br />
          <a href="https://berryamc.in" style="color: #4F46E5; text-decoration: none;">www.myapp.com</a>
        </p>
      </div>
    </div>
  `,
    });

    return res.status(201).json({
      message: "Account created. Please verify OTP.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};





// OTP Verification Controller
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null; // clear OTP
    await user.save();

    return res.status(200).json({ message: "OTP Verified Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false,
      });
    }

    const token = await jwt.sign(
      { userId: user._id, name: user.name, email: user.email,clientId:user.clientId,role: user.role, },
      process.env.SECRET_KEY,
      {
        expiresIn: "365d",
      }
    );

    user = {
      _id: user._id,
      email: user.email,
      name: user.name,
      clientId:user.clientId,
      role: user.role,
    };
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 365 * 24 * 60 * 60 * 1000,
        secure: true,
      })
      .json({
        message: `Welcome back ${user.name}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};


export const get1UserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};



export const getUser=async(req,res)=>{
  try {
    
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No token' });

    const user = jwt.verify(token, process.env.SECRET_KEY);
    res.json({ user });

  } catch (error) {
    console.log(error);
  }
}



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email is required", success: false });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found", success: false });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    // Send email
    // await transporter.sendMail({
    //   from: `"Berry AMC" <${process.env.EMAIL_FROM}>`,
    //   to: email,
    //   subject: "🔐 Reset Your Password - Berry AMC",
    //   html: `
    //     <div style="font-family:Arial;padding:20px;background:#f8f9fa">
    //       <h2 style="color:#4F46E5">Berry AMC Password Reset</h2>
    //       <p>Hello <b>${user.name}</b>,</p>
    //       <p>Use the OTP below to reset your password:</p>
    //       <h3 style="text-align:center; background:#4F46E5;color:white;padding:10px;border-radius:8px;">${otp}</h3>
    //       <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
    //       <br/>
    //       <p>Best regards,<br/>Berry AMC Team</p>
    //     </div>
    //   `,
    // });

const htmlContent = `
<div style="font-family:Arial;padding:20px;background:#f8f9fa">
  <h2 style="color:#4F46E5">Berry AMC Password Reset</h2>
  <p>Hello <b>${user.name}</b>,</p>
  <p>Use the OTP below to reset your password:</p>
  <h3 style="text-align:center; background:#4F46E5;color:white;padding:10px;border-radius:8px;">${otp}</h3>
  <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
  <br/>
  <p>Best regards,<br/>Berry AMC Team</p>
</div>
`;

try {
  const info = await sendMail({
    to: email,
    subject: "🔐 Reset Your Password - Berry AMC",
    html: htmlContent,
  });
  console.log("Email sent successfully:", info.response);
} catch (err) {
  console.error("Failed to send email:", err);
}





    res.json({ message: "OTP sent to your email", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are required", success: false });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found", success: false });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP", success: false });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    await user.save();

    res.json({ message: "Password reset successful", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
