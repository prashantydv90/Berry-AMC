import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./NavBar";
import Footer from "./Footer";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email.trim()) return toast.warning("Please enter your email");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5555/api/forgot-password", { email });
      toast.success(res.data.message);
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full px-2 py-2 border-b-2 focus:outline-none mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleForgotPassword}
            disabled={loading}
            className={`w-full ${loading ? "bg-violet-400" : "bg-violet-600 hover:bg-violet-700"} text-white py-2 rounded font-semibold`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};
