import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { NavBar } from "./NavBar";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import { useUser } from "./UserContext";

export const ContactForm = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false); // ✅ Loading state

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
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
    setLoading(true); // ✅ Start loading
    try {
      const res = await axios.post("https://berry-amc-0kaq.onrender.com/api/contact", formData);
      toast.success(res.data.message);
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    } finally {
      setLoading(false); // ✅ End loading
    }
  };

  return (
    <>
      <NavBar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className=" flex flex-col justify-center px-3 items-center min-h-screen bg-gray-100 md:pt-18 2xl:pt-0">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Contact Us</h2>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
          ></textarea>

          <button
            type="submit"
            disabled={loading} // ✅ Disable while sending
            className={`w-full font-semibold py-2 rounded-lg text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Message"} {/* ✅ Button text change */}
          </button>
        </form>
        
      </div>
      <Footer />
    </>
  );
};
