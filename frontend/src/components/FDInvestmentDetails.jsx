import React, { useState } from "react";
import { Calendar, IndianRupee, Wallet, ChevronDown, Activity, CircleCheckBig, ShieldCheck, CircleDot } from "lucide-react";
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
                <Calendar size={16} className="inline mr-2 mb-1" />
                Date
              </th>
              <th className="w-1/4 px-5 py-3 text-right">
                <IndianRupee size={16} className="inline mr-1 mb-1" />
                Invested
              </th>
              <th className="w-1/4 px-5 py-3 text-right">
                <Wallet size={16} className="inline mr-1 mb-1" />
                Current
              </th>

              <th className="w-1/4 px-5 py-3 text-right">
                <ShieldCheck size={16} className="inline mr-1 mb-1" />
                Status
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
                  {/* <td className="px-4 py-4 md:hidden" colSpan={4}>
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
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                              Status
                            </span>

                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide
        ${inv.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                                }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full
          ${inv.status === "active"
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                                  }`}
                              ></span>

                              {inv.status === "active" ? "Active" : "Closed"}
                            </span>
                          </div>
                        </div>

                      </div>

                      <ChevronDown
                        size={18}
                        className={`mt-1 transition-transform ${openFD === inv._id ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </td> */}

                  <td className="px-4 py-4 md:hidden" colSpan={4}>
                    <div className="flex justify-between items-start">

                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatDate(inv.investedDate)}
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          Invested: ₹
                          {Number(inv.investedAtBeginning).toLocaleString("en-IN")}
                        </div>

                        <div className="text-sm font-semibold text-blue-700 mt-1">
                          Current: ₹
                          {Number(inv.totalValue.toFixed(0)).toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide
          ${inv.status === "active"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                              : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full
            ${inv.status === "active"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                              }`}
                          ></span>

                          {inv.status === "active" ? "Active" : "Closed"}
                        </span>

                        <ChevronDown
                          size={18}
                          className={`transition-transform ${openFD === inv._id ? "rotate-180" : ""
                            }`}
                        />
                      </div>
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

                  <td className="px-2 py-4 text-right  hidden md:table-cell">
                    <div className="flex justify-end">
                      <span
                        className={`relative inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide transition-all duration-200
        ${inv?.status === "active"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                          }`}
                      >
                        <span
                          className={`mr-2 h-2 w-2 rounded-full
          ${inv?.status === "active"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-slate-400"
                            }`}
                        />

                        {inv?.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-center hidden md:table-cell">
                    <ChevronDown
                      size={18}
                      className={`mx-auto transition-transform ${openFD === inv._id ? "rotate-180" : ""
                        }`}
                    />
                  </td>
                </tr>

                {/* DROPDOWN */}
                {openFD === inv._id && (
                  <tr>
                    <td colSpan={5} className="px-4 md:px-5 pb-4">
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
