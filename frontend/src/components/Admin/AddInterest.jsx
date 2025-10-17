import axios from "axios";
import React, { useState } from "react";

export const AddInterestForm = ({ setInterestForm, client }) => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    startMonth: "",
    endMonth: "",
    returns: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5555/api/addinterest/${client._id}`, formData,{withCredentials:true});
      alert(res.data.message);
      setFormData({ startMonth: "", endMonth: "", returns: "" });
      setInterestForm(false);
    } catch (error) {
      alert(error.response?.data?.message || "Error adding returns");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="relative h-[24rem] w-[34rem] bg-white shadow-lg rounded-xl p-6">
        {/* Close Button */}
        <button
          onClick={()=>setInterestForm(false)}
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
              type="month"
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
              type="month"
              name="endMonth"
              value={formData.endMonth}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* returns */}
          <div>
            <label className="block text-sm font-medium">Returns (in amount)</label>
            <input
              type="number"
              name="returns"
              value={formData.returns}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700"
          >
            Add Interest
          </button>
        </form>
      </div>
    </div>
  );
};
