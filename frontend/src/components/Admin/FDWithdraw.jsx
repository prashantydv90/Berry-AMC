// import React, { useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { formatDate } from "../utils";


// export const FDWithdraw = ({ setWithdrawForm, client }) => {
//   const [selectedFD, setSelectedFD] = useState(null);
//   const [amount, setAmount] = useState("");
//   const [confirm, setConfirm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   console.log(selectedFD);

//   const formatINR = (num) =>
//     Number(num).toLocaleString("en-IN", { maximumFractionDigits: 2 });

//   const remainingValue =
//     selectedFD && amount
//       ? Math.max(selectedFD.totalValue - amount, 0)
//       : null;

//   const isFullWithdraw =
//     selectedFD && Number(amount) === Number(selectedFD.totalValue);

//   const handleWithdrawAll = () => {
//     if (!selectedFD) return;
//     setAmount(Number(selectedFD.totalValue));
//     setConfirm(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedFD) {
//       toast.error("Please select an FD");
//       return;
//     }

//     if (!amount || amount <= 0) {
//       toast.error("Enter a valid withdrawal amount");
//       return;
//     }

//     if (amount > selectedFD.totalValue) {
//       toast.error("Amount exceeds FD value");
//       return;
//     }

//     if (!confirm) {
//       toast.warn("Please confirm the withdrawal");
//       return;
//     }

//     try {
//       setIsLoading(true);

//       await axios.post(
//         `https://berry-amc-0kaq.onrender.com/api/fdwithdraw/${selectedFD._id}`,
//         { amount }, { withCredentials: true }
//       );

//       toast.success("Amount withdrawal successful");
//       setWithdrawForm(false);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Withdrawal failed"
//       );
//       console.log(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
//       <ToastContainer position="top-right" autoClose={3000} theme="colored" />

//       <div className="relative w-[38rem] bg-white rounded-2xl shadow-xl p-6 mx-4">
//         {/* Close */}
//         <button
//           onClick={() => setWithdrawForm(false)}
//           className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
//         >
//           &times;
//         </button>

//         <h2 className="text-2xl font-bold mb-5 text-red-600">
//           Withdraw Fixed Deposit
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* FD SELECT */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Select FD
//             </label>
//             <select
//               className="w-full border rounded-lg px-3 py-2"
//               value={selectedFD?._id || ""}
//               onChange={(e) => {
//                 const fd = client.FDInvestments.find(
//                   (f) => f._id === e.target.value
//                 );
//                 setSelectedFD(fd);
//                 setAmount("");
//                 setConfirm(false);
//               }}
//               required
//             >
//               <option value="">-- Select FD --</option>
//               {client.FDInvestments.map((fd) => (
//                 <option key={fd._id} value={fd._id}>
//                   {formatDate(fd.date)} • ₹{formatINR(fd.totalValue)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* FD DETAILS */}
//           {selectedFD && (
//             <div className="bg-gray-50 border rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <p className="text-gray-500">Invested Amount</p>
//                 <p className="font-semibold">₹{formatINR(selectedFD.investedValue)}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Current Value</p>
//                 <p className="font-semibold">₹{formatINR(selectedFD.totalValue)}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">ROI</p>
//                 <p className="font-semibold">{selectedFD.rate}%</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Start Date</p>
//                 <p className="font-semibold">{formatDate(selectedFD.date)}</p>
//               </div>
//             </div>
//           )}

//           {/* AMOUNT INPUT */}
//           {selectedFD && (
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Withdraw Amount
//               </label>

//               <div className="flex gap-2">
//                 <input
//                   type="number"
//                   // min="0.01"
//                   // step="0.01"
//                   max={selectedFD.totalValue}
//                   value={amount}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     setAmount(val === "" ? "" : val);
//                     setConfirm(false);
//                   }}
//                   className="flex-1 border rounded-lg px-3 py-2"
//                   required
//                 />


//                 <button
//                   type="button"
//                   onClick={handleWithdrawAll}
//                   className="px-4 py-2 text-sm font-semibold border border-red-500 text-red-600 rounded-lg hover:bg-red-50"
//                 >
//                   Withdraw All
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* PREVIEW */}
//           {selectedFD && amount > 0 && amount <= selectedFD.totalValue && (
//             <div className="bg-blue-50 border rounded-xl p-4 text-sm">
//               <p>
//                 <b>Remaining FD Value:</b>{" "}
//                 ₹{formatINR(remainingValue)}
//               </p>

//               {isFullWithdraw && (
//                 <p className="mt-1 text-red-600 font-semibold">
//                   ⚠ This FD will be closed permanently
//                 </p>
//               )}
//             </div>
//           )}

//           {/* CONFIRM */}
//           {selectedFD && amount > 0 && (
//             <label className="flex items-center gap-2 text-sm">
//               <input
//                 type="checkbox"
//                 checked={confirm}
//                 onChange={(e) => setConfirm(e.target.checked)}
//               />
//               I understand and confirm this withdrawal
//             </label>
//           )}

//           {/* SUBMIT */}
//           <button
//             type="submit"
//             disabled={isLoading || !confirm}
//             className={`w-full mt-2 font-semibold py-3 rounded-xl transition ${isLoading
//                 ? "bg-red-400 text-white cursor-not-allowed"
//                 : "bg-red-600 text-white hover:bg-red-700"
//               }`}
//           >
//             {isLoading ? "Processing..." : "Withdraw Amount"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };








import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { calculateFDValue, formatDate } from "../utils";

export const FDWithdraw = ({ setWithdrawForm, client }) => {
  const [selectedFD, setSelectedFD] = useState(null);
  const [amount, setAmount] = useState("");
  const [withdrawDate, setWithdrawDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [confirm, setConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatINR = (num) =>
    Number(num).toLocaleString("en-IN", { maximumFractionDigits: 2 });

  const computedFD = selectedFD
    ? calculateFDValue(
      Number(selectedFD.investedValue),
      selectedFD.date,
      withdrawDate
    )
    : null;

  const currentValue = computedFD ? computedFD.value : 0;
  const currentRate = computedFD ? computedFD.rate : 0;

  const remainingValue =
    selectedFD && amount
      ? Math.max(currentValue - Number(amount), 0)
      : null;

  const isFullWithdraw =
    selectedFD && Number(amount) >= currentValue;


  const handleWithdrawAll = () => {
    if (!selectedFD) return;
    setAmount(Number(currentValue));
    setConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFD) {
      toast.error("Please select an FD");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid withdrawal amount");
      return;
    }

    if (Number(amount) > currentValue) {
      toast.error("Amount exceeds current FD value");
      return;
    }


    if (!withdrawDate) {
      toast.error("Please select withdrawal date");
      return;
    }

    if (new Date(withdrawDate) < new Date(selectedFD.date)) {
      toast.error("Withdrawal date cannot be before FD start date");
      return;
    }

    if (!confirm) {
      toast.warn("Please confirm the withdrawal");
      return;
    }

    try {
      setIsLoading(true);

      await axios.post(
        `https://berry-amc-0kaq.onrender.com/api/fdwithdraw/${selectedFD._id}`,
        {
          amount: Number(amount),
          date: withdrawDate,
          fdValueAtWithdrawal:Number(currentValue)
        },
        { withCredentials: true }
      );

      toast.success("Amount withdrawn successfully");
      setWithdrawForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Withdrawal failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="relative max-h-95/100 w-[38rem] bg-white rounded-2xl shadow-xl p-6 mx-4 overflow-y-auto">
        {/* Close */}
        <button
          onClick={() => setWithdrawForm(false)}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-5 text-red-600">
          Withdraw Fixed Deposit
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* FD SELECT */}
          <div>
            <label className="block text-sm font-medium mb-1">Select FD</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={selectedFD?._id || ""}
              onChange={(e) => {
                const fd = client.FDInvestments.find(
                  (f) => f._id === e.target.value
                );
                setSelectedFD(fd);
                setAmount("");
                setConfirm(false);
                setWithdrawDate(
                  new Date().toISOString().split("T")[0]
                );
              }}
              required
            >
              <option value="">-- Select FD --</option>
              {client.FDInvestments.map((fd) => (
                <option key={fd._id} value={fd._id}>
                  {formatDate(fd.date)} • ₹{formatINR(fd.totalValue)}
                </option>
              ))}
            </select>
          </div>

          {/* FD DETAILS */}
          {selectedFD && (
            <div className="bg-gray-50 border rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Invested Amount</p>
                <p className="font-semibold">
                  ₹{formatINR(selectedFD.investedValue)}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Current Value (as of selected date)</p>
                <p className="font-semibold">
                  ₹{formatINR(currentValue)}
                </p>
              </div>

              <div>
                <p className="text-gray-500">ROI (dynamic)</p>
                <p className="font-semibold">{currentRate}%</p>
              </div>

              <div>
                <p className="text-gray-500">Start Date</p>
                <p className="font-semibold">
                  {formatDate(selectedFD.date)}
                </p>
              </div>
            </div>
          )}


          {/* WITHDRAW DATE */}
          {selectedFD && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Withdrawal Date
              </label>
              <input
                type="date"
                value={withdrawDate}
                min={selectedFD.date?.split("T")[0]}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setWithdrawDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          )}

          {/* AMOUNT INPUT */}
          {selectedFD && (
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
          {selectedFD && amount > 0 && amount <= currentValue && (
            <div className="bg-blue-50 border rounded-xl p-4 text-sm">
              <p>
                <b>Remaining FD Value:</b> ₹{formatINR(remainingValue)}
              </p>

              {isFullWithdraw && (
                <p className="mt-1 text-red-600 font-semibold">
                  ⚠ This FD will be closed permanently
                </p>
              )}
            </div>
          )}


          {/* CONFIRM */}
          {selectedFD && amount > 0 && (
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
                ? "bg-red-400 text-white cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
              }`}
          >
            {isLoading ? "Processing..." : "Withdraw Amount"}
          </button>
        </form>
      </div>
    </div>
  );
};
