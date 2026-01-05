import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export const EditInvestmentForm = ({
  setEditInvestmentForm,
  client,
  investmentType, 
  investment,   
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [baseTotal, setBaseTotal] = useState(0);

  const [formData, setFormData] = useState({
    investedValue: "",
    totalValue: "",
    date: "",
  });

  // ✅ Pre-fill form when investment changes
  useEffect(() => {
    if (investment) {
      setFormData({
        investedValue: investment.investedValue || "",
        totalValue: investment.totalValue || "",
        date: investment.date ? investment.date.split("T")[0] : "", // clean date
      });
      setBaseTotal(investment.totalValue-investment.investedValue);
    }
  }, [investment]);

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

//   console.log(investment._id);

  // ✅ Submit form (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const res = await axios.put(
        `http://localhost:5555/api/editinvestment/${investmentType}/${investment._id}`,
        formData,
        { withCredentials: true }
      );

      toast.success(res.data.message || "Investment updated successfully");

      // Close modal
      setEditInvestmentForm(false);
    } catch (error) {
      console.error("Error updating investment:", error);
      toast.error(error.response?.data?.message || "Error updating investment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="relative mx-4 md:mx-0 w-[34rem] bg-white shadow-lg rounded-xl p-6">
        {/* Close Button */}
        <button
          onClick={() => setEditInvestmentForm(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Edit {investmentType.toUpperCase()} Investment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

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

          {/* Invested Value */}
          <div>
            <label className="block text-sm font-medium">Invested Value</label>
            <input
              type="number"
              name="investedValue"
              value={formData.investedValue}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* Total Value */}
          <div>
            <label className="block text-sm font-medium">Total Value</label>
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
            className={`w-full mt-4 font-semibold py-2 rounded-lg transition ${
              isLoading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Updating..." : "Update Investment"}
          </button>
        </form>
      </div>
    </div>
  );
};
