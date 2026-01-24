import React from "react";
import { Calendar, IndianRupee, Wallet } from "lucide-react";
import { formatDate } from "./utils";

export default function MFInvestmentTable({ investments = [] }) {
    // 1️⃣ Sort oldest first for correct cumulative calculation
    const sorted = [...investments].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );
    // 2️⃣ Compute cumulative totals
    let runningTotal = 0;
    const withTotals = sorted.map((inv) => {
        runningTotal += Number(inv.investedValue || inv.invested || 0);
        return { ...inv, totalInvested: runningTotal };
    });

    // 3️⃣ Reverse for latest-first display
    const displayData = withTotals.reverse();

    return (
        <div className="mx-auto bg-white rounded-2xl py-5 px-3 md:px-5 shadow-md border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Wallet className="text-blue-600" size={22} />
                <h2 className="text-xl font-semibold text-gray-800">Investments</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full border-collapse table-fixed">
                    <thead>
                        <tr className="bg-blue-600 text-white text-left">
                            <th className="w-1/3 px-5 py-3 font-medium">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="hidden sm:inline" /> {/* hidden on mobile */}
                                    Date
                                </div>
                            </th>
                            <th className="w-1/3 px-5 py-3 font-medium text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <IndianRupee size={16} className="hidden sm:inline mt-0.5" /> {/* hidden on mobile */}
                                    Invested
                                </div>
                            </th>
                            <th className="w-1/3 px-5 py-3 font-medium text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Wallet size={16} className="hidden sm:inline" /> {/* hidden on mobile */}
                                    Total Invested
                                </div>
                            </th>
                        </tr>
                    </thead>


                    <tbody>
                        {investments.map((inv, index) => (
                            <tr
                                key={inv._id ?? index}
                                className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                            >
                                <td className="w-1/3 px-5 py-3 text-gray-800">
                                    {formatDate(inv.date)}
                                </td>
                                <td
                                    className={`w-1/3 px-5 py-3  text-right ${inv.investedValue > 0 ? "text-green-600 font-semibold" : "text-red-900 font-semibold"
                                        }`}
                                >

                                    {inv.investedValue && inv.investedValue<0 && <span>-</span>}₹{Number(Math.abs(inv.investedValue.toFixed(0)) || inv.invested.toFixed(0) || 0).toLocaleString("en-IN")}
                                </td>
                                <td className="w-1/3 px-5 py-3 text-gray-800 font-medium text-right">
                                    ₹{Number(inv.totalValue.toFixed(0)).toLocaleString("en-IN")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
