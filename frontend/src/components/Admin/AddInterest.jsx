import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export const AddInterestForm = ({ setInterestForm, client }) => {
  const [formData, setFormData] = useState({
    startMonth: "",
    endMonth: "",
    returns: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5555/api/addinterest/${client._id}`,
        formData,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setFormData({ startMonth: "", endMonth: "", returns: "" });
      setInterestForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding returns");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="relative h-[24rem] w-[34rem] bg-white shadow-lg rounded-xl p-6">
        {/* Close Button */}
        <button
          onClick={() => setInterestForm(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Add Interest</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Month */}
          <div>
            <label className="block text-sm font-medium">Start Month</label>
            <input
              type="date"
              name="startMonth"
              value={formData.startMonth}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* End Month */}
          <div>
            <label className="block text-sm font-medium">End Month</label>
            <input
              type="date"
              name="endMonth"
              value={formData.endMonth}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* Returns */}
          <div>
            <label className="block text-sm font-medium">
              Returns (in amount)
            </label>
            <input
              type="number"
              name="returns"
              value={formData.returns}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-2 rounded-lg transition-colors ${
              isLoading
                ? "bg-purple-400 cursor-not-allowed text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {isLoading ? "Adding Interest..." : "Add Interest"}
          </button>
        </form>
      </div>
    </div>
  );
};
