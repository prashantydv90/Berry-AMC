import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const MFWithdraw = ({ setWithdrawForm, client }) => {
  const [amount, setAmount] = useState("");
  const [withdrawDate, setWithdrawDate] = useState(
    new Date().toISOString().split("T")[0] // today
  );
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalValue = Number(client.MFTotalValue);

  const formatINR = (num) =>
    Number(num).toLocaleString("en-IN", { maximumFractionDigits: 2 });

  const remainingValue =
    amount ? Math.max(totalValue - amount, 0) : null;

  const isFullWithdraw = Number(amount) === totalValue;

  const handleWithdrawAll = () => {
    setAmount(totalValue);
    setConfirm(false);
  };

  //   const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!withdrawDate) {
  //     toast.error("Please select withdrawal date");
  //     return;
  //   }

  //   if (!amount || amount <= 0) {
  //     toast.error("Enter a valid withdrawal amount");
  //     return;
  //   }

  //   if (amount > totalValue) {
  //     toast.error("Amount exceeds total MF value");
  //     return;
  //   }

  //   if (!confirm) {
  //     toast.warn("Please confirm the withdrawal");
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);

  //     const withdrawalAmount = Number(amount);
  //     const newTotalValue = totalValue - withdrawalAmount;

  //     await axios.post(
  //       "http://localhost:5555/api/addinvestment/mf", // or mftransaction
  //       {
  //         clientId: client._id,
  //         investedValue: -withdrawalAmount,   // 🔴 negative
  //         totalValue: newTotalValue,           // 🟢 updated balance
  //         date: withdrawDate
  //       },
  //       { withCredentials: true }
  //     );

  //     toast.success("Mutual Fund withdrawal recorded");
  //     setWithdrawForm(false);
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Withdrawal failed");
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!withdrawDate) {
      toast.error("Please select withdrawal date");
      return;
    }

    if (!amount || amount <= 0) {
      toast.error("Enter a valid withdrawal amount");
      return;
    }

    if (amount > totalValue) {
      toast.error("Amount exceeds total MF value");
      return;
    }

    if (!confirm) {
      toast.warn("Please confirm the withdrawal");
      return;
    }

    try {
      setIsLoading(true);

      const withdrawalAmount = Number(amount);

      // 🔴 FULL WITHDRAW → DELETE
      if (withdrawalAmount === totalValue) {
        const url = `http://localhost:5555/api/resetInvestment/mf/${client._id}`;
        await axios.delete(url, { withCredentials: true });

        toast.success("All Mutual Fund balance withdrawn");
      }
      // 🟢 PARTIAL WITHDRAW → LEDGER ENTRY
      else {
        const newTotalValue = totalValue - withdrawalAmount;

        await axios.post(
          "http://localhost:5555/api/addinvestment/mf",
          {
            clientId: client._id,
            investedValue: -withdrawalAmount,
            totalValue: newTotalValue,
            date: withdrawDate,
          },
          { withCredentials: true }
        );

        toast.success("Mutual Fund withdrawal recorded");
      }

      // 🔄 Refresh client data (MANDATORY)
      const res = await axios.get(
        `http://localhost:5555/api/get1ClientDetails/${client._id}`,
        { withCredentials: true }
      );

      // assuming parent passes setClient
      // if not, reload page or lift state
      // setClient(res.data.data);

      setWithdrawForm(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Withdrawal failed");
    } finally {
      setIsLoading(false);
    }
  };






  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="relative w-[36rem] max-w-full bg-white rounded-2xl shadow-xl p-6 mx-4">
        {/* Close */}
        <button
          onClick={() => setWithdrawForm(false)}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-5 text-blue-600">
          Withdraw Mutual Funds
        </h2>

        {/* MF SUMMARY */}
        <div className="bg-gray-50 border rounded-xl p-4 grid grid-cols-2 gap-3 text-sm mb-5">
          <div>
            <p className="text-gray-500">Total Invested</p>
            <p className="font-semibold">
              ₹{formatINR(client.MFTotalInvested)}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Current MF Value</p>
            <p className="font-semibold">
              ₹{formatINR(totalValue)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* DATE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Withdrawal Date
            </label>
            <input
              type="date"
              value={withdrawDate}
              onChange={(e) => setWithdrawDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* AMOUNT INPUT */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Withdraw Amount
            </label>

            <div className="flex gap-2">
              <input
                type="number"
                max={totalValue}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setConfirm(false);
                }}
                className="flex-1 border rounded-lg px-3 py-2"
                required
              />

              <button
                type="button"
                onClick={handleWithdrawAll}
                className="px-4 py-2 text-sm font-semibold border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Withdraw All
              </button>
            </div>
          </div>

          {/* PREVIEW */}
          {amount > 0 && amount <= totalValue && (
            <div className="bg-blue-50 border rounded-xl p-4 text-sm">
              <p>
                <b>Remaining MF Balance:</b>{" "}
                ₹{formatINR(remainingValue)}
              </p>

              {isFullWithdraw && (
                <p className="mt-1 text-red-600 font-semibold">
                  ⚠ All Mutual Fund balance will be withdrawn
                </p>
              )}
            </div>
          )}

          {/* CONFIRM */}
          {amount > 0 && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={confirm}
                onChange={(e) => setConfirm(e.target.checked)}
              />
              I understand and confirm this withdrawal
            </label>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading || !confirm}
            className={`w-full mt-2 font-semibold py-3 rounded-xl transition ${isLoading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {isLoading ? "Processing..." : "Withdraw Amount"}
          </button>
        </form>
      </div>
    </div>
  );
};
