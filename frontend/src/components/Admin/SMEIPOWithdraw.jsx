import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {calculateSMEIPOValue, formatDate } from "../utils";

export const SMEIPOWithdraw = ({ setWithdrawForm, client }) => {
  const [selectedIPO, setSelectedIPO] = useState(null);
  const [amount, setAmount] = useState("");
  const [withdrawDate, setWithdrawDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatINR = (num) =>
    Number(num).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

    const computedSMEIPO = selectedIPO
    ? calculateSMEIPOValue(
        Number(selectedIPO.investedValue),
        selectedIPO.date,
        withdrawDate
    )
    : null;

  const currentValue = computedSMEIPO ? computedSMEIPO.value : 0;
  const currentRate = computedSMEIPO ? computedSMEIPO.rate : 0;


  const remainingValue =
    selectedIPO && amount
      ? Math.max(currentValue - Number(amount), 0)
      : null;

  const isFullWithdraw =
    selectedIPO && Number(amount) >= currentValue;

  const handleWithdrawAll = () => {
    if (!selectedIPO) return;

    setAmount(Number(currentValue));
    setConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedIPO) {
      toast.error("Please select an SME IPO");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid withdrawal amount");
      return;
    }

    if (Number(amount) > currentValue) {
      toast.error("Amount exceeds current value");
      return;
    }

    if (!withdrawDate) {
      toast.error("Please select withdrawal date");
      return;
    }

    if (
      new Date(withdrawDate) <
      new Date(selectedIPO.investedDate)
    ) {
      toast.error(
        "Withdrawal date cannot be before investment date"
      );
      return;
    }

    if (!confirm) {
      toast.warn("Please confirm the withdrawal");
      return;
    }

    try {
      setIsLoading(true);

      await axios.post(
        `https://berry-amc-0kaq.onrender.com/api/smeipowithdraw/${selectedIPO._id}`,
        {
          amount: Number(amount),
          date: withdrawDate,
          valueAtWithdrawal: Number(currentValue),
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Amount withdrawn successfully");
      setWithdrawForm(false);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Withdrawal failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />

      <div className="relative max-h-[95vh] w-[38rem] bg-white rounded-2xl shadow-xl p-6 mx-4 overflow-y-auto">
        <button
          onClick={() => setWithdrawForm(false)}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-5 text-red-600">
          Withdraw SME IPO
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* SELECT IPO */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select SME IPO
            </label>

            <select
              className="w-full border rounded-lg px-3 py-2"
              value={selectedIPO?._id || ""}
              onChange={(e) => {
                const ipo =
                  client.SMEIPOInvestments.find(
                    (i) => i._id === e.target.value
                  );

                setSelectedIPO(ipo);
                setAmount("");
                setConfirm(false);
                setWithdrawDate(
                  new Date()
                    .toISOString()
                    .split("T")[0]
                );
              }}
              required
            >
              <option value="">
                -- Select SME IPO --
              </option>

              {client.SMEIPOInvestments?.filter(
                (ipo) => ipo.status === "active"
              ).map((ipo) => (
                <option
                  key={ipo._id}
                  value={ipo._id}
                >
                  {formatDate(ipo.investedDate)} • ₹
                  {formatINR(ipo.totalValue)}
                </option>
              ))}
            </select>
          </div>

          {/* DETAILS */}
          {selectedIPO && (
            <div className="bg-gray-50 border rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">
                  Invested Amount
                </p>
                <p className="font-semibold">
                  ₹
                  {formatINR(
                    selectedIPO.investedValue
                  )}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Current Value
                </p>
                <p className="font-semibold">
                  ₹{formatINR(currentValue)}
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Current ROI
                </p>
                <p className="font-semibold">
                  {currentRate}%
                </p>
              </div>

              <div>
                <p className="text-gray-500">
                  Investment Date
                </p>
                <p className="font-semibold">
                  {formatDate(
                    selectedIPO.investedDate
                  )}
                </p>
              </div>
            </div>
          )}

          {/* WITHDRAW DATE */}
          {selectedIPO && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Withdrawal Date
              </label>

              <input
                type="date"
                value={withdrawDate}
                min={
                  selectedIPO.investedDate
                    ?.split("T")[0]
                }
                max={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setWithdrawDate(
                    e.target.value
                  )
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          )}

          {/* AMOUNT */}
          {selectedIPO && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Withdraw Amount
              </label>

              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  max={currentValue}
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
                  className="px-4 py-2 text-sm font-semibold border border-red-500 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Withdraw All
                </button>
              </div>
            </div>
          )}

          {/* PREVIEW */}
          {selectedIPO &&
            amount > 0 &&
            amount <= currentValue && (
              <div className="bg-blue-50 border rounded-xl p-4 text-sm">
                <p>
                  <b>Remaining Value:</b> ₹
                  {formatINR(remainingValue)}
                </p>

                {isFullWithdraw && (
                  <p className="mt-1 text-red-600 font-semibold">
                    ⚠ This SME IPO investment
                    will be closed permanently
                  </p>
                )}
              </div>
            )}

          {/* CONFIRM */}
          {selectedIPO && amount > 0 && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={confirm}
                onChange={(e) =>
                  setConfirm(
                    e.target.checked
                  )
                }
              />
              I understand and confirm this
              withdrawal
            </label>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={
              isLoading || !confirm
            }
            className={`w-full mt-2 font-semibold py-3 rounded-xl transition ${
              isLoading
                ? "bg-red-400 text-white cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {isLoading
              ? "Processing..."
              : "Withdraw Amount"}
          </button>
        </form>
      </div>
    </div>
  );
};