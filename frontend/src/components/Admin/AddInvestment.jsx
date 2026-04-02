
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { toIndianFormat } from "../utils";

export const AddInvestmentForm = ({ setInvestmentForm, client, investmentType }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    clientId: "",
    investedValue: "",
    totalValue: "",
    date: "",
  });

  const [baseTotal, setBaseTotal] = useState(0); // store current total before adding new investment

  useEffect(() => {
    if (client) {
      const currentTotal =
        investmentType === "mf"
          ? Number(client.MFTotalInvested || 0)
          : Number(client.FDTotalValue || 0);

      setBaseTotal(currentTotal);

      setFormData((prev) => ({
        ...prev,
        clientId: client._id || client.client_id,
        investedValue: "",
        totalValue: currentTotal,
      }));
    }
  }, [client, investmentType]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "investedValue") {
      const newInvested = Number(value) || 0;
      setFormData((prev) => ({
        ...prev,
        investedValue: newInvested,
        totalValue: baseTotal + newInvested, // auto-update totalValue
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // <-- show "Adding..."
      const res = await axios.post(
        `https://berry-amc-0kaq.onrender.com/api/addinvestment/${investmentType}`,
        formData,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setFormData({ clientId: "", investedValue: "", totalValue: "", date: "" });
      setInvestmentForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding investment");
    } finally {
      setIsLoading(false); // <-- back to normal
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="relative mx-4 md:mx-0  w-[34rem] bg-white shadow-lg rounded-xl p-6">
        {/* Close Button */}
        <button
          onClick={() => setInvestmentForm(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Add {investmentType.toUpperCase()} Investment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Invested Value */}

            <div>
              <label className="block text-sm font-medium">Date of Investment</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
            </div>

          <div>
            <label className="block text-sm font-medium">Invested Value</label>
            <input
              type="text"
              name="investedValue"
              value={formData.investedValue}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              autoComplete="off"
            />
          </div>

          {/* Total Value */}
          <div>
            <label className="block text-sm font-medium">Total Invested</label>
            <input
              type="number"
              name="totalValue"
              value={formData.totalValue}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-4 font-semibold py-2 rounded-lg transition ${isLoading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {isLoading ? "Adding..." : "Add Investment"}
          </button>

        </form>
      </div>
    </div>
  );
};
