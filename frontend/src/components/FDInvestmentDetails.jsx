// import React from "react";
// import { Calendar, IndianRupee, Wallet } from "lucide-react";
// import { formatDate } from "./utils";

// export default function FDInvestmentTable({ investments = [] }) {
//     // 1️⃣ Sort oldest first for correct cumulative calculation
//     const sorted = [...investments].sort(
//         (a, b) => new Date(a.date) - new Date(b.date)
//     );

//     // 2️⃣ Compute cumulative totals
//     let runningTotal = 0;
//     const withTotals = sorted.map((inv) => {
//         runningTotal += Number(inv.investedValue || inv.invested || 0);
//         return { ...inv, totalInvested: runningTotal };
//     });

//     // 3️⃣ Reverse for latest-first display
//     const displayData = withTotals.reverse();

//     return (
//         <div className="mx-auto bg-white rounded-2xl py-5 px-3 md:px-5 shadow-md border border-gray-100">
//             {/* Header */}
//             <div className="flex items-center gap-2 mb-4">
//                 <Wallet className="text-blue-600" size={22} />
//                 <h2 className="text-xl font-semibold text-gray-800">Investments</h2>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto rounded-xl border border-gray-100">
//                 <table className="w-full border-collapse table-fixed">
//                     <thead>
//                         <tr className="bg-blue-600 text-white text-left">
//                             <th className="w-1/3 px-5 py-3 font-medium">
//                                 <div className="flex items-center gap-2">
//                                     <Calendar size={16} className="hidden sm:inline" /> {/* hidden on mobile */}
//                                     Date
//                                 </div>
//                             </th>
//                             <th className="w-1/3 px-5 py-3 font-medium text-right">
//                                 <div className="flex items-center justify-end gap-1">
//                                     <IndianRupee size={16} className="hidden sm:inline mt-0.5" /> {/* hidden on mobile */}
//                                     Invested
//                                 </div>
//                             </th>
//                             <th className="w-1/3 px-5 py-3 font-medium text-right">
//                                 <div className="flex items-center justify-end gap-2">
//                                     <Wallet size={16} className="hidden sm:inline" /> {/* hidden on mobile */}
//                                     Total Invested
//                                 </div>
//                             </th>
//                         </tr>
//                     </thead>


//                     <tbody>
//                         {displayData.map((inv, index) => (
//                             <tr
//                                 key={inv._id ?? index}
//                                 className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
//                             >
//                                 <td className="w-1/3 px-5 py-3 text-gray-800">
//                                     {formatDate(inv.date)}
//                                 </td>
//                                 <td className="w-1/3 px-5 py-3 font-semibold text-green-600 text-right">
//                                     ₹{Number(inv.investedValue.toFixed(0) || inv.invested.toFixed(0) || 0).toLocaleString("en-IN")}
//                                 </td>
//                                 <td className="w-1/3 px-5 py-3 text-gray-800 font-medium text-right">
//                                     ₹{Number(inv.totalInvested.toFixed(0)).toLocaleString("en-IN")}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }







// import React, { useState } from "react";
// import { Calendar, IndianRupee, Wallet, ChevronDown } from "lucide-react";
// import { formatDate } from "./utils";

// export default function FDInvestmentTable({ investments = [] }) {
//   const [openFD, setOpenFD] = useState(null);

//   const toggleFD = (id) => {
//     setOpenFD(prev => (prev === id ? null : id));
//   };

//   const sorted = [...investments].sort(
//     (a, b) => new Date(b.date) - new Date(a.date)
//   );

//   return (
//     <div className="mx-auto bg-white rounded-2xl py-5 px-3 md:px-5 shadow-md border border-gray-100">
      
//       {/* Header */}
//       <div className="flex items-center gap-2 mb-4">
//         <Wallet className="text-blue-600" size={22} />
//         <h2 className="text-xl font-semibold text-gray-800">FD Investments</h2>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-xl border border-gray-100">
//         <table className="w-full table-fixed">
//           <thead>
//             <tr className="bg-blue-600 text-white">
//               <th className="w-1/4 px-5 py-3 text-left">
//                 <Calendar size={16} className="inline mr-2" />
//                 Date
//               </th>
//               <th className="w-1/4 px-5 py-3 text-right">
//                 <IndianRupee size={16} className="inline mr-1" />
//                 Invested
//               </th>
//               <th className="w-1/4 px-5 py-3 text-right">
//                 <Wallet size={16} className="inline mr-1" />
//                 Current
//               </th>
//               <th className="w-1/4 px-5 py-3 text-center"></th>
//             </tr>
//           </thead>

//           <tbody>
//             {sorted.map((inv) => (
//               <React.Fragment key={inv._id}>
                
//                 {/* Main Row */}
//                 <tr className="border-b hover:bg-gray-50 transition">
//                   <td className="px-5 py-4">
//                     {formatDate(inv.investedDate)}
//                   </td>

//                   <td className="px-5 py-4 text-right font-semibold text-green-600">
//                     ₹{Number((inv.investedAtBeginning)).toLocaleString("en-IN")}
//                   </td>

//                   <td className="px-5 py-4 text-right font-medium text-gray-800">
//                     ₹{Number(inv.totalValue.toFixed(0)).toLocaleString("en-IN")}
//                   </td>

//                   <td className="px-5 py-4 text-center">
//                     <button
//                       onClick={() => toggleFD(inv._id)}
//                       className="text-gray-500 hover:text-blue-600 transition"
//                     >
//                       <ChevronDown
//                         size={18}
//                         className={`transition-transform duration-300 ${
//                           openFD === inv._id ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>
//                   </td>
//                 </tr>

//                 {/* Dropdown */}
//                 {openFD === inv._id && (
//                   <tr>
//                     <td colSpan={4} className="px-5 pb-4">
//                       <div className="bg-slate-50 border border-blue-100 rounded-xl p-4 animate-fadeIn mt-3">

//                         <div className="text-sm font-semibold text-blue-700 mb-3 ">
//                           Withdrawal History
//                         </div>

//                         {inv.FDWithdrawals?.length === 0 ? (
//                           <div className="text-sm text-gray-500 italic">
//                             No withdrawals made.
//                           </div>
//                         ) : (
//                           <div className="space-y-3">
//                             {inv.FDWithdrawals.map((w) => (
//                               <div
//                                 key={w._id}
//                                 className="grid grid-cols-4 gap-4 bg-white p-4 rounded-lg border shadow-sm"
//                               >
//                                 <div>
//                                   <div className="text-xs text-gray-500">Date</div>
//                                   <div className="font-medium">
//                                     {formatDate(w.createdAt)}
//                                   </div>
//                                 </div>

//                                 <div>
//                                   <div className="text-xs text-gray-500">Value Before</div>
//                                   <div className="font-medium">
//                                     ₹{Number(
//                                       w.fdValueAtWithdrawal.toFixed(2)
//                                     ).toLocaleString("en-IN")}
//                                   </div>
//                                 </div>

//                                 <div>
//                                   <div className="text-xs text-gray-500">Withdrawn</div>
//                                   <div className="font-semibold text-red-600">
//                                     ₹{Number(w.amount).toLocaleString("en-IN")}
//                                   </div>
//                                 </div>

                                

//                                 <div>
//                                   <div className="text-xs text-gray-500">Value After</div>
//                                   <div className="font-semibold text-green-700">
//                                     ₹{Number((
//                                       w.fdValueAtWithdrawal-w.amount).toFixed(2)
//                                     ).toLocaleString("en-IN")}
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



















import React, { useState } from "react";
import { Calendar, IndianRupee, Wallet, ChevronDown } from "lucide-react";
import { formatDate } from "./utils";

export default function FDInvestmentTable({ investments = [] }) {
  const [openFD, setOpenFD] = useState(null);

  const toggleFD = (id) => {
    setOpenFD((prev) => (prev === id ? null : id));
  };

  // Latest first
  const sorted = [...investments].sort(
    (a, b) => new Date(b.investedDate) - new Date(a.investedDate)
  );

  return (
    <div className="mx-auto bg-white rounded-2xl py-5 px-3 md:px-5 shadow-md border border-gray-100">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="text-blue-600" size={22} />
        <h2 className="text-xl font-semibold text-gray-800">
          FD Investments
        </h2>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full table-fixed">
          
          {/* Desktop Header */}
          <thead className="hidden md:table-header-group">
            <tr className="bg-blue-600 text-white">
              <th className="w-1/4 px-5 py-3 text-left">
                <Calendar size={16} className="inline mr-2" />
                Date
              </th>
              <th className="w-1/4 px-5 py-3 text-right">
                <IndianRupee size={16} className="inline mr-1" />
                Invested
              </th>
              <th className="w-1/4 px-5 py-3 text-right">
                <Wallet size={16} className="inline mr-1" />
                Current
              </th>
              <th className="w-1/4 px-5 py-3 text-center"></th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((inv) => (
              <React.Fragment key={inv._id}>
                
                {/* MAIN ROW (click anywhere) */}
                <tr
                  onClick={() => toggleFD(inv._id)}
                  className="border-b hover:bg-gray-50 active:bg-blue-50 transition cursor-pointer border-zinc-200"
                >
                  
                  {/* MOBILE VIEW */}
                  <td className="px-4 py-4 md:hidden" colSpan={4}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {formatDate(inv.investedDate)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Invested: ₹{Number(inv.investedAtBeginning).toLocaleString("en-IN")}
                        </div>
                        <div className="text-sm font-semibold text-blue-700 mt-1">
                          Current: ₹{Number(inv.totalValue.toFixed(0)).toLocaleString("en-IN")}
                        </div>
                      </div>

                      <ChevronDown
                        size={18}
                        className={`mt-1 transition-transform ${
                          openFD === inv._id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </td>

                  {/* DESKTOP VIEW */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    {formatDate(inv.investedDate)}
                  </td>

                  <td className="px-5 py-4 text-right font-semibold text-green-600 hidden md:table-cell">
                    ₹{Number(inv.investedAtBeginning).toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4 text-right font-medium text-gray-800 hidden md:table-cell">
                    ₹{Number(inv.totalValue.toFixed(0)).toLocaleString("en-IN")}
                  </td>

                  <td className="px-5 py-4 text-center hidden md:table-cell">
                    <ChevronDown
                      size={18}
                      className={`mx-auto transition-transform ${
                        openFD === inv._id ? "rotate-180" : ""
                      }`}
                    />
                  </td>
                </tr>

                {/* DROPDOWN */}
                {openFD === inv._id && (
                  <tr>
                    <td colSpan={4} className="px-4 md:px-5 pb-4">
                      <div className="bg-slate-50 border border-blue-100 rounded-xl p-4 mt-3 animate-fadeIn">

                        <div className="text-sm font-semibold text-blue-700 mb-3">
                          Withdrawal History
                        </div>

                        {inv.FDWithdrawals?.length === 0 ? (
                          <div className="text-sm text-gray-500 italic">
                            No withdrawals made.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {inv.FDWithdrawals.map((w) => (
                              <div
                                key={w._id}
                                className="bg-white p-4 rounded-lg border shadow-sm
                                           grid grid-cols-1 md:grid-cols-4 gap-3 border-zinc-200"
                              >
                                <div>
                                  <div className="text-xs text-gray-500">Date</div>
                                  <div className="font-medium">
                                    {formatDate(w.withdrawalDate)}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs text-gray-500">Value Before</div>
                                  <div className="font-medium">
                                    ₹{Number(w.fdValueAtWithdrawal.toFixed(0)).toLocaleString("en-IN")}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs text-gray-500">Withdrawn</div>
                                  <div className="font-semibold text-red-600">
                                    ₹{Number(w.amount.toFixed(0)).toLocaleString("en-IN")}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs text-gray-500">Value After</div>
                                  <div className="font-semibold text-green-700">
                                    ₹{Number((
                                      w.fdValueAtWithdrawal - w.amount
                                    ).toFixed(0)).toLocaleString("en-IN")}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
