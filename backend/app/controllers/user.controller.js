import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Client } from "../models/client.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail2.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    const existingClient = await Client.findOne({ email });

    // ✅ Case 1: Already verified user
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        message: "Email already exists.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Case 2: User exists but not verified → resend OTP
    if (existingUser && !existingUser.isVerified) {
      existingUser.password = hashedPassword;
      existingUser.name = name;
      existingUser.otp = otp;
      existingUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min validity
      if (existingClient) existingUser.clientId = existingClient._id;
      await existingUser.save();

      await sendVerificationEmail(existingUser.name, email, otp);
      return res.status(200).json({
        message: "Account updated. Please verify your email using OTP.",
        success: true,
      });
    }

    // ✅ Case 3: New user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      otp,
      isVerified: false,
      otpExpires: Date.now() + 10 * 60 * 1000,
      clientId: existingClient ? existingClient._id : null,
    });

    await sendVerificationEmail(newUser.name, email, otp);

    return res.status(201).json({
      message: "Account created. Please verify OTP.",
      success: true,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error", success: false });
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
      return res
        .status(400)
        .json({ message: "Email is required", success: false });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins
    await user.save();

    // Prepare HTML content
    const htmlContent = `
      <div style="font-family:Arial,sans-serif;padding:20px;background:#f8f9fa">
        <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
          <h2 style="color:#4F46E5;text-align:center;margin-bottom:20px">Berry AMC Password Reset</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>We received a request to reset your password. Use the OTP below:</p>
          <div style="text-align:center;margin:30px 0;">
            <span style="
              display:inline-block;
              font-size:24px;
              letter-spacing:4px;
              background-color:#4F46E5;
              color:#fff;
              padding:15px 25px;
              border-radius:8px;
              font-weight:bold;
            ">${otp}</span>
          </div>
          <p style="color:#555">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          <p>Best regards,<br/>Berry AMC Team</p>
        </div>
      </div>
    `;

    // Send email via Web API
    try {
      await sendEmail({
        to: email,
        subject: "🔐 Reset Your Password - Berry AMC",
        html: htmlContent,
      });
      console.log("OTP email sent successfully to", email);
    } catch (err) {
      console.error("Failed to send OTP email:", err);
      return res
        .status(500)
        .json({ message: "Failed to send OTP email", success: false });
    }

    res.json({ message: "OTP sent to your email", success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
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
