import React, { useState } from "react";
import { Calendar, Wallet, TrendingUp, ClipboardList } from "lucide-react";

export const OrderForm = ({ setOpenForm }) => {
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    transId: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send to backend
    setOpenForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[95%] md:w-[500px] relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-zinc-800 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            Place New Order
          </h2>
          <button
            className="text-zinc-500 hover:text-red-600 text-lg"
            onClick={() => setOpenForm(false)}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Date */}
          <div>
            <label className="text-sm font-medium text-zinc-600 flex items-center gap-1">
              <Calendar size={16} /> Order Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-zinc-600 flex items-center gap-1">
              <TrendingUp size={16} /> Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>

          {/* Transaction ID */}
          <div>
            <label className="text-sm font-medium text-zinc-600 flex items-center gap-1">
              <Wallet size={16} /> Transaction ID
            </label>
            <input
              type="text"
              name="transId"
              value={formData.transId}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter transaction ID"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-zinc-600">Order Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium rounded-md py-2 mt-2 hover:bg-blue-700 transition"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};
