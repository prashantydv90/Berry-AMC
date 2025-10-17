
const Orders = ({ orders }) => {
    return (
        <div className=" w-[90%] md:w-[70%] mx-auto mt-13 bg-white rounded-xl shadow-md py-6 px-4 md:p-6">
            {/* Header */}
            <div className="flex flex-row justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    My Orders
                </h3>

                <button
                    onClick={() => setOpenForm(true)}
                    className="mt-2 md:mt-0 flex items-center gap-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition px-3 py-2 rounded-md text-sm shadow-sm"
                >
                    <AiOutlineStock className="text-lg" />
                    Place New Order
                </button>
            </div>

            {/* Orders List */}
            <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 font-semibold bg-blue-600 text-white py-2 px-3 rounded-md shadow-sm text-sm">
                        <div className="flex items-center gap-1">
                            <Calendar size={16} /> Order Date
                        </div>
                        <div className="flex items-center gap-1">
                            <Landmark size={16} /> Amount (₹)
                        </div>
                        <div className="flex items-center gap-1">
                            <Wallet size={16} /> Transaction ID
                        </div>
                        <div className="flex items-center justify-center gap-1"><ChartPie size={16} />Status</div>
                    </div>

                    {/* Table Rows */}
                    {orders.map((p, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-4 items-center py-3 px-3 border-b border-zinc-200 text-sm hover:bg-zinc-50 transition"
                        >
                            <div className="flex items-center gap-2 pl-1">

                                {p.Date}
                            </div>
                            <div className="flex items-center gap-1 font-medium pl-1">

                                ₹{p.amount.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1 text-zinc-600 pl-1">

                                {p.transId}
                            </div>
                            <div className="flex justify-center pl-1">
                                {p.status === "Success" ? (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <TrendingUp size={12} /> Success
                                    </span>
                                ) : (
                                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <Clock size={12} /> Pending
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}




import React, { useEffect, useRef, useState } from "react";
import { NavBar } from "./NavBar";
import {
    AiOutlineStock
} from "react-icons/ai";
import { Analyse } from "./Analyse";
import { OrderForm } from "./OrderForm";
import Footer from "./Footer";
import axios from "axios";
import { formatYearMonth, toIndianFormat } from "./utils";
import { AnalyseFD } from "./AnalyseFD";
import { useUser } from "./UserContext";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import { AiOutlineBank } from "react-icons/ai"; // icons for MF and FD
import { ChevronDown } from "lucide-react";

export const DashBoard = () => {
    const [openAnalyse, setOpenAnalyse] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [selected, setSelected] = useState("mf");
    const [selectedfd, setSelectedfd] = useState(0);
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, setUser } = useUser();
    

    const [totalReturn, setTotalReturn] = useState("");
    const [totalReturnPercent, setTotalReturnPercent] = useState("");
    console.log(user);
    useEffect(() => {
        const fetchUser = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const res = await axios.get(
                    `http://localhost:5555/api/getuserdetails/${user.userId}`
                    , { withCredentials: true });
                setUser(prev => ({
                    ...prev,
                    clientId: res.data.data.clientId, // ✅ new clientId from backend
                }));
            } catch (err) {
                setError(err.message || "Error fetching user");
            } finally {
                setLoading(false);
            }
        };
        if (user && !user.clientId) fetchUser();
        else setLoading(false);
    }, [user]);

    useEffect(() => {
        const fetchClient = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const res = await axios.get(
                    `http://localhost:5555/api/get1ClientDetails/${user.clientId}`
                );
                setClient(res.data.data || null);
            } catch (err) {
                setError(err.message || "Error fetching client");
            } finally {
                setLoading(false);
            }
        };
        if (user?.clientId) fetchClient();
        else setLoading(false);
    }, [user]);

    useEffect(() => {
        if (!client) return;

        if (selected === "mf") {
            const invested = client?.MFTotalInvested || 0;
            const current = client?.MFTotalValue || 0;
            const returns = current - invested;

            setTotalReturn(toIndianFormat(returns));
            setTotalReturnPercent(((returns / invested) * 100).toFixed(2));
        } else if (selected === "fd" && client?.FDInvestments?.[selectedfd]) {
            const fd = client.FDInvestments[selectedfd];
            const returns = fd.totalValue - fd.investedValue;
            setTotalReturn(toIndianFormat(returns.toFixed(2)));
            setTotalReturnPercent(((returns / fd.investedValue) * 100).toFixed(2));
        }
    }, [selected, selectedfd, client]);

    // ---------- CONDITIONAL RENDERS ----------
    if (loading) {
        return (
            <>
                <NavBar />
                <div className="flex flex-col items-center justify-center h-screen bg-zinc-50">
                    <div className="loader border-t-4 border-blue-600 border-solid rounded-full w-12 h-12 animate-spin mx-auto mb-2"></div>
                    <p className="text-zinc-600 font-medium">Loading your dashboard...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (!user) {
        return (
            <>
                <NavBar />
                <div className="text-center h-screen flex flex-col items-center justify-center ">
                    <h2 className="text-2xl font-semibold text-zinc-700 mb-2">
                        You are not logged in
                    </h2>
                    <p className="text-zinc-500 mb-4">
                        Please log in to view your investments and dashboard.
                    </p>
                    <Link
                        to="/user/login"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-all"
                    >
                        Login
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    if (!user.clientId) {
        return (
            <>
                <NavBar />
                <div className=" h-screen text-center flex flex-col items-center justify-center ">
                    <h2 className="text-2xl font-semibold text-zinc-700 mb-2">
                        You’re not registered as a client yet
                    </h2>
                    <p className="text-zinc-500 mb-4">
                        Become a client to start tracking your investments.
                    </p>
                    <Link
                        to="/client/registration"
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition-all"
                    >
                        Become a Client
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-zinc-50">
                <NavBar />
                <p className="text-zinc-500 font-medium">
                    No client data found for your account.
                </p>
            </div>
        );
    }

    const hasNoInvestments =
        (!client?.MFInvestments || client.MFInvestments.length === 0) &&
        (!client?.FDInvestments || client.FDInvestments.length === 0);

    if (hasNoInvestments) {
        return (
            <div className="">
                <NavBar />
                <div className="h-screen flex flex-col justify-center items-center text-center ">
                    <h2 className="text-2xl font-semibold text-zinc-700 mb-2">
                        No investments yet
                    </h2>
                    <p className="text-zinc-500 mb-4">
                        Start investing to see your portfolio performance.
                    </p>
                    <Link
                        to="/invest"
                        className="bg-blue-400 cursor-not-allowed  text-white font-medium px-6 py-2 rounded-lg shadow-md transition-all"
                    >
                        Explore Investments
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // ---------- MAIN DASHBOARD ----------
    return (
        <div>
            <NavBar />
            <div className="bg-zinc-50 min-h-screen pt-18 flex flex-col items-center" >
                {/* <div className="flex flex-col justify-center items-center gap-2 mt-8">
                    <p className="font-medium text-zinc-500 text-sm">Investment type</p>
                    <select
                        className="border-1 border-zinc-400 rounded-md py-1 px-1 text-sm"
                        onChange={(e) => setSelected(e.target.value)}
                    >
                        <option value="mf">Mutual Fund</option>
                        <option value="fd">Fixed Deposit</option>
                    </select>
                </div> */}

                <div className="flex flex-col w-[10rem] justify-center items-center gap-2 mt-8">
                    <CustomDropdown
                        label="Investment Type"
                        value={selected}
                        onChange={setSelected}
                        options={[
                            { value: "mf", label: "Mutual Fund", icon: <AiOutlineStock /> },
                            { value: "fd", label: "Fixed Deposit", icon: <AiOutlineBank /> },
                        ]}
                       
                    />
                </div>


                {(selected === "fd" && (!client?.FDInvestments || client.FDInvestments.length === 0)) ||
                    (selected === "mf" && (!client?.MFInvestments || client.MFInvestments.length === 0)) ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] w-full">
                        <div className="text-zinc-600 font-medium text-lg">
                            {selected === "fd" ? "No FD Investment Found" : "No Mutual Fund Investment Found"}
                        </div>
                        <div className="text-sm text-zinc-500 mt-2">
                            Please check again later or contact your advisor for updates.
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-1 flex-col items-center mt-8 2xl:mt-20">
                        {/* {selected === "fd" && client?.FDInvestments?.length > 1 && (
                            <select
                                className="focus:outline-0 rounded-md py-1 px-1 font-medium text-sm mb-2 ml-2 md:w-[55%] w-[90%]"
                                onChange={(e) => setSelectedfd(e.target.value)}
                            >
                                {client?.FDInvestments?.map((item, index) => (
                                    <option key={index} value={index}>
                                        FD ({index + 1})
                                    </option>
                                ))}
                            </select>
                        )} */}
                        <div className="md:w-[55%] w-[90%]">
                            <div className="w-50">
                            {selected === "fd" && client?.FDInvestments?.length > 1 && (
                                <CustomDropdown
                                    label="Choose FD"
                                    value={selectedfd}
                                    onChange={(val) => setSelectedfd(Number(val))}
                                    options={client.FDInvestments.map((fd, index) => ({
                                        value: index,
                                        label: `FD (${index + 1}) - ₹${toIndianFormat(fd.totalValue.toFixed(0))}`,
                                        icon: <AiOutlineBank />,
                                    }))}
                                  
                                />
                            )}
                            </div>
                        </div>





                        {/* Investment Summary Card */}
                        <div className="min-h-[15rem] md:w-[55%] w-[90%] shadow-md border border-zinc-300 rounded-xl mt-2">
                            {/* Upper */}
                            <div className="h-[7.5rem] w-full border-b border-zinc-300 flex items-center px-4 md:px-7">
                                <div className="w-1/2">
                                    <div className="font-medium text-[13.5px] text-zinc-600">
                                        Current
                                    </div>
                                    <div className="font-semibold text-xl">
                                        ₹
                                        {selected === "mf"
                                            ? toIndianFormat(Number(client?.MFTotalValue).toFixed(0))
                                            : toIndianFormat(
                                                client?.FDInvestments[selectedfd].totalValue.toFixed(0)
                                            )}
                                    </div>
                                </div>
                                <div className="flex items-center w-1/2">
                                    <div
                                        className="pr-4 pl-3 py-1.5 border border-zinc-300 rounded-xl flex items-center ml-auto bg-blue-600 text-white hover:bg-blue-700 font-medium cursor-pointer"
                                        onClick={() => setOpenAnalyse(!openAnalyse)}
                                    >
                                        <AiOutlineStock className="text-xl mr-1" />
                                        <span className="text-sm">Analyse</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lower */}
                            <div className="min-h-[7.5rem] pt-4 gap-1 md:gap-0 md:py-0 w-full flex md:flex-row flex-col md:items-center px-4 md:px-7">
                                <div className="md:w-1/3 w-full flex flex-row md:flex-col">
                                    <div className="font-medium text-[15px] md:text-[13.5px] text-zinc-600">
                                        Invested
                                    </div>
                                    <div className="font-semibold flex flex-1 justify-end md:justify-start text-md">
                                        ₹
                                        {selected === "mf"
                                            ? toIndianFormat(client?.MFTotalInvested)
                                            : toIndianFormat(
                                                client?.FDInvestments[selectedfd].investedValue
                                            )}
                                    </div>
                                </div>

                                <div className="md:w-1/3 w-full flex flex-row md:flex-col">
                                    <div className="font-medium text-[15px] md:text-[13.5px] text-zinc-600 ml-auto">
                                        {selected === "mf"
                                            ? formatYearMonth(client?.MFPeriodicInterest[0]?.startMonth, client?.MFPeriodicInterest[0]?.endMonth)
                                            : "Rate of Interest"}
                                    </div>
                                    <div className="font-semibold flex flex-1 justify-end md:justify-start text-md ml-auto text-green-600">
                                        {selected === "mf" ? (
                                            <>
                                                +₹{toIndianFormat(client.MFPeriodicInterest[0]?.returns || 0)} (
                                                {(() => {
                                                    const { returns = 0, totalValue = 0 } = client.MFPeriodicInterest[0] || {};
                                                    const base = totalValue - returns;

                                                    if (!base || base === 0) return "0.00"; // avoid divide-by-zero
                                                    const percent = (returns / base) * 100;

                                                    return isNaN(percent) ? "0.00" : percent.toFixed(2);
                                                })()}%)
                                            </>
                                        ) : (
                                            `${client?.FDInvestments[selectedfd]?.rate.toFixed(2)}%`
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col md:w-1/3 w-full">
                                    <div className="font-medium text-[15px] md:text-[13.5px] text-zinc-600 ml-auto">
                                        Total returns
                                    </div>
                                    <div className="font-semibold flex flex-1 justify-end md:justify-start text-md ml-auto text-green-600">
                                        +₹{totalReturn} ({totalReturnPercent}%)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {openAnalyse && selected === "mf" && (
                <Analyse setOpenAnalyse={setOpenAnalyse} client={client} selected={selected} />
            )}
            {openAnalyse && selected === "fd" && (
                <AnalyseFD setOpenAnalyse={setOpenAnalyse} selectedfd={selectedfd} client={client} />
            )}
            {openForm && <OrderForm setOpenForm={setOpenForm} />}
            <Footer />
        </div>
    );
};




// const CustomDropdown = ({ label, options, value, onChange }) => {
    
//     const [open, setOpen] = useState(false);
//     const handleSelect = (option) => {
//         onChange(option.value);
//         setOpen(false);
//     };

//     return (
//         <div className="w-full max-w-sm relative">
//             {/* Label */}
//             <label className="absolute -top-2 left-3 bg-zinc-50 text-zinc-500 px-1 text-[11px] font-medium">
//                 {label}
//             </label>

//             {/* Selected Value */}
//             <div
//                 className="border border-zinc-300 rounded-md p-2 flex justify-between items-center cursor-pointer hover:border-blue-500 transition"
//                 onClick={() => setOpen(!open)}
//             >
//                 <div className="flex items-center gap-2 font-medium text-[13px]">
//                     {options.find((opt) => opt.value === value)?.icon}
//                     <span>
//                         {options.find((opt) => opt.value === value)?.label || "Select"}
//                     </span>
//                 </div>
//                 <ChevronDown size={16} />
//             </div>

//             {/* Options */}
//             {open && (
//                 <div className="absolute top-full left-0 w-full mt-1 bg-white border border-zinc-300 rounded-md shadow-lg z-50 max-h-60 overflow-auto text-[13px]">
//                     {options.map((opt) => (
//                         <div
//                             key={opt.value}
//                             className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer"
//                             onClick={() => handleSelect(opt)}
//                         >
//                             {opt.icon}
//                             <span>{opt.label}</span>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };





const CustomDropdown = ({ label, options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (option) => {
        onChange(option.value);
        setOpen(false);
    };

    // Close dropdown if click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full max-w-sm relative" ref={dropdownRef}>
            {/* Label */}
            <label className="absolute -top-2 left-3 bg-zinc-50 text-zinc-500 px-1 text-[11px] font-medium">
                {label}
            </label>

            {/* Selected Value */}
            <div
                className="border border-zinc-300 rounded-md p-2 flex justify-between items-center cursor-pointer hover:border-blue-500 transition"
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-2 font-medium text-[13px]">
                    {options.find((opt) => opt.value === value)?.icon}
                    <span>
                        {options.find((opt) => opt.value === value)?.label || "Select"}
                    </span>
                </div>
                <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
            </div>

            {/* Options with animation */}
            <div
                className={`absolute top-full left-0 w-full mt-1 bg-white border border-zinc-300 rounded-md shadow-lg z-50 max-h-60 overflow-auto text-[13px]
                transform transition-all duration-200 ease-in-out origin-top ${
                    open ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
                }`}
            >
                {options.map((opt) => (
                    <div
                        key={opt.value}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => handleSelect(opt)}
                    >
                        {opt.icon}
                        <span>{opt.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


