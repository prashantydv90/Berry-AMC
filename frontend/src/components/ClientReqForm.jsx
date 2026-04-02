import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, CheckCircle2 } from "lucide-react";
import { NavBar } from "./NavBar";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import { useUser } from "./UserContext";
import { Navigate, useNavigate } from "react-router-dom";

export const ClientRequestForm = ({ onClose }) => {
  const navigate=useNavigate();
  const {user}=useUser();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    PAN: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // ✅ Success popup state

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5555/api/client-req", formData);
      setSuccess(true); // ✅ Show success popup
      setFormData({ name: "", phone: "", email: "", address: "", PAN: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <NavBar/>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="min-h-screen flex flex-col md:pt-20 bg-zinc-50 justify-center items-center mb-10">
        <div className="bg-white sm:w-[30rem] w-[90%] rounded-xl shadow-lg p-6 relative">
          {/* Close Button */}
          {/* <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          >
            <X size={22} />
          </button> */}

          <h2 className="text-2xl text-center font-bold mb-4">Become Our Investor</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="2"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

            {/* PAN */}
            <div>
              <label className="block text-sm font-medium">PAN</label>
              <input
                type="text"
                name="PAN"
                value={formData.PAN}
                onChange={handleChange}
                required
                maxLength="10"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 uppercase"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

      </div>

     

      {/* ✅ Success Popup */}
      {success && (
        <div className="inset-0 bg-black/60 fixed z-50 flex justify-center items-center">
          <div className="bg-white w-[26rem] rounded-xl shadow-lg p-8 text-center relative">
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X size={22} />
            </button>

            <CheckCircle2 size={70} className="mx-auto text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Request Submitted!
            </h3>
            <p className="text-gray-600 text-sm">
              Your request has been submitted. Once it is approved, you will
              receive a confirmation email.
            </p>

            <button
              onClick={() => {
                // setSuccess(false);
                // onClose();
                navigate('/home')
              }}
              className="mt-6 bg-green-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Okay
            </button>
          </div>
        </div>
         
      )}
     <div className="bg-zinc-50">
        <Footer/>
     </div>
    </>
  );
};
