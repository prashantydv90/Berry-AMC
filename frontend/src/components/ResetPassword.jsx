import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { NavBar } from "./NavBar";
import Footer from "./Footer";

export const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const email = location.state?.email || "";

  const handleResetPassword = async () => {
    if (!otp.trim() || !newPassword.trim()) {
      toast.warning("Please enter all fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5555/api/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast.success(res.data.message);
      setTimeout(() => navigate("/user/login"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-2 py-2 border-b-2 focus:outline-none mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full px-2 py-2 border-b-2 focus:outline-none mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="off"
          />
          <button
            onClick={handleResetPassword}
            disabled={isLoading}
            className={`w-full py-2 rounded font-semibold text-white transition-colors ${
              isLoading ? "bg-violet-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"
            }`}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};
