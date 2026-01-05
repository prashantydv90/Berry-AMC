import React, { useState } from "react";
import { IdCard, User, Home, Phone, Mail, Wallet, TrendingUp, CircleDollarSign, Calendar, Edit2, Trash2, CalendarDays, PiggyBank, IndianRupee, LineChart, ChevronDown } from "lucide-react";
import { NavBar } from "../NavBar";
import { AddInterestForm } from "./AddInterest";
import { AddInvestmentForm } from "./AddInvestment";
import Footer from "../Footer";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import formatDateRange, { calculateYearlyInterest, formatDate, formatYearMonth, toIndianFormat } from "../utils";
import { toast, ToastContainer } from "react-toastify";
import { EditInvestmentForm } from "./EditInvestment";
import { EditInterestForm } from "./EditInterest";
import calculateClientXIRR from "../xirr";
import { FDWithdraw } from "./FDWithdraw";
import { MFWithdraw } from "./MFWithdraw";


export const ClientDetails = () => {
    const [investmentType, setInvestmentType] = useState("mf");
    const [interestForm, setInterestForm] = useState(false);
    const [investmentForm, setInvestmentForm] = useState(false);
    const [withdrawForm, setWithdrawForm] = useState(false);
    const [editInvestmentForm, setEditInvestmentForm] = useState(false);
    const [editInterestForm, setEditInterestForm] = useState(false);
    // const [cagr, setCagr] = useState(null);
    const [xirr, setXirr] = useState(null);
    const [investment, setInvestment] = useState(null);
    const [interest, setInterest] = useState(null)


    const { id } = useParams(); // ✅ get id from URL
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    //withdrawal

    //fdwithdrawal
    const [openFD, setOpenFD] = useState(null);

    const toggleFD = (id) => {
        setOpenFD(prev => (prev === id ? null : id));
    };


    useEffect(() => {
        const fetchClient = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5555/api/get1ClientDetails/${id}`, { withCredentials: true });
                setClient(res.data.data || null);
            } catch (err) {
                setError(err.message || "Error fetching client");
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [id, investmentForm, interestForm, editInvestmentForm, editInterestForm, withdrawForm]); // re-run if id changes

    const [totalReturn, setTotalReturn] = useState('');
    const [totalReturnPercent, setTotalReturnPercent] = useState('');

    useEffect(() => {
        // let CAGR = calculateYearlyInterest(client?.MFPeriodicInterest);
        // setCagr(CAGR);
        let XIRR = calculateClientXIRR(client);
        setXirr(XIRR);
    }, [client])

    useEffect(() => {
        if (!client) return;

        if (investmentType === 'mf') {
            const invested = client?.MFTotalInvested || 0;
            const current = client?.MFTotalValue || 0;
            const returns = Number(client?.MFReturns) || 0;

            setTotalReturn(Number(returns.toFixed(2)).toLocaleString("en-IN"));
            setTotalReturnPercent(((returns / invested) * 100).toFixed(2));
        } else if (investmentType === 'fd' && client) {
            const returns = client.FDTotalValue - client.FDTotalInvested;
            setTotalReturn(toIndianFormat(returns.toFixed(2)));
            setTotalReturnPercent(((returns / client.FDTotalInvested) * 100).toFixed(2));
        }
    }, [investmentType, client]);

    console.log(client);


    // ===== DELETE INVESTMENT =====
    const handleDeleteInvestment = async (type, id) => {
        if (!window.confirm("Are you sure you want to delete this investment?")) return;

        try {
            setLoading(true); // Start loading

            const url = `http://localhost:5555/api/deleteinvestment/${type}/${id}`;
            await axios.delete(url, { withCredentials: true });

            // Refresh client data
            const res = await axios.get(
                `http://localhost:5555/api/get1ClientDetails/${client._id}`,
                { withCredentials: true }
            );
            setClient(res.data.data);
        } catch (err) {
            console.error("Error deleting investment:", err);
            alert(err.response?.data?.message || "Failed to delete investment. Try again.");
        } finally {
            setLoading(false); // Always stop loading
        }
    };

    const handleDeleteInterest = async (id) => {
        if (!window.confirm("Are you sure you want to delete this return?")) return;

        try {
            setLoading(true);
            const url = `http://localhost:5555/api/deleteinterest/${id}`;
            await axios.delete(url, { withCredentials: true });
            // Refresh client data
            const res = await axios.get(`http://localhost:5555/api/get1ClientDetails/${client._id}`, { withCredentials: true });
            setClient(res.data.data);
        } catch (err) {
            console.error("Error deleting investment:", err);
            alert("Failed to delete investment. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditInvestment = (data) => {
        setInvestment(data);
        setEditInvestmentForm(true);
    }

    const handleEditInterest = (data) => {
        setInterest(data);
        setEditInterestForm(true);
    }


    const handleResetMFInvestment = async (id) => {
        if (!window.confirm("Are you sure you want to remove all investments and returns?")) return;

        setLoading(true);

        try {
            const url = `http://localhost:5555/api/resetInvestment/${investmentType}/${id}`;
            await axios.delete(url, { withCredentials: true });
            const res = await axios.get(`http://localhost:5555/api/get1ClientDetails/${client._id}`, { withCredentials: true });
            toast.success("All investments and returns removed successfully!");
            setClient(res.data.data);
        } catch (err) {
            toast.error(err.message || "Failed to delete investment. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className=' bg-zinc-100'>
            <NavBar />
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            {loading && <div className="min-h-screen flex justify-center items-center bg-zinc-100">
                <div className="text-center">
                    <div className="loader border-t-4 border-blue-600 border-solid rounded-full w-12 h-12 animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-700 font-medium">Loading client details...</p>
                </div>
            </div>}
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
            <div className='pt-18 bg-zinc-100  mb-18'>
                <div className="min-h-screen bg-zinc-100 p-6">

                    <div className='flex flex-col justify-center items-center gap-2 '>
                        <p className='font-medium text-zinc-900 text-sm'> Investment type</p>
                        <select name="" id="" className='border-1 border-zinc-400 rounded-md py-1 px-1  text-sm focus:outline-0' onClick={(e) => setInvestmentType(e.target.value)}>
                            <option value="mf">Mutual Fund</option>
                            <option value="fd">Fixed Deposit</option>
                        </select>
                    </div>


                    {/* Client Info Card */}
                    <div className="bg-white shadow-md rounded-xl mt-5 p-6 max-w-5xl mx-auto">
                        <h2 className="text-xl font-bold text-zinc-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            Client Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-2 text-sm text-zinc-700">
                                <User className="w-4 h-4 text-green-600" /> <span><b>Name:</b> {client?.name}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-zinc-700">
                                <IdCard className="w-4 h-4 text-blue-600" /> <span><b>PAN:</b> {client?.PAN}</span>
                            </div>

                            <div className="flex items-start gap-2 text-sm text-zinc-700 leading-relaxed">
                                <Home className="w-4 h-4 mt-1 text-purple-600 shrink-0" />
                                <p className="flex-1">
                                    <span className="font-bold">Address:</span>{" "}
                                    <span className="text-zinc-700">{client?.address}</span>
                                </p>
                            </div>




                            <div className="flex items-center gap-2 text-sm text-zinc-700">
                                <Phone className="w-4 h-4 text-orange-600" /> <span><b>Phone:</b> {client?.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-700">
                                <Mail className="w-4 h-4 text-red-600" /> <span><b>Email:</b> {client?.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-700">
                                <Wallet className="w-4 h-4 text-gray-600" /> <span><b>Invested:</b> ₹{investmentType === 'mf' ? toIndianFormat(client?.MFTotalInvested) : toIndianFormat(client?.FDTotalInvested)}</span>
                            </div>
                            {/* <div className="flex items-center gap-2 text-sm text-zinc-700">
                                <CircleDollarSign className="w-4 h-4 text-blue-600" /> <span><b>Current:</b> ₹{investmentType === 'mf' ? toIndianFormat((client?.MFTotalValue).toFixed(0)) : toIndianFormat((client?.FDTotalValue).toFixed(0))}</span>
                            </div> */}
                            <div className="flex items-center gap-2 text-sm text-zinc-700">
                                <CircleDollarSign className="w-4 h-4 text-blue-600" />
                                <span>
                                    <b>Current:</b> ₹
                                    {investmentType === 'mf'
                                        ? toIndianFormat(Number(client?.MFTotalValue || 0).toFixed(0))
                                        : toIndianFormat(Number(client?.FDTotalValue || 0).toFixed(0))}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-zinc-700">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span><b>Returns:</b> ₹{totalReturn} ({totalReturnPercent > 0 ? totalReturnPercent : "0"}%)</span>
                            </div>

                            {investmentType === "mf" &&
                                <>
                                    {/* <div className="flex items-center gap-2 text-sm text-zinc-700">
                                    <LineChart className="w-4 h-4 text-indigo-600" />
                                    <span><b>CAGR:</b> {cagr ? `${cagr}%` : "0%"}</span>
                                </div> */}
                                    <div className="flex items-center gap-2 text-sm text-zinc-700">
                                        <LineChart className="w-4 h-4 text-indigo-600" />
                                        <span><b>XIRR:</b> {xirr ? `${xirr}%` : "0%"}</span>
                                    </div>
                                </>
                            }

                        </div>
                    </div>


                    {/* Investment Section */}
                    <div className="max-w-5xl mx-auto mt-6 bg-white rounded-xl shadow-md p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between  mb-3">
                            <h3 className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-blue-600" />
                                Investment
                            </h3>

                            <div className="flex flex-row justify-between items-center mt-5 sm:gap-5">

                                <div className=" bg-blue-600 text-white font-medium hover:bg-blue-700 cursor-pointer md:mt-0 border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none"
                                    onClick={() => setInvestmentForm(true)}
                                >Add Investment</div>
                                <div
                                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium cursor-pointer border border-red-600 rounded-md px-3 py-2 text-sm"
                                    onClick={() => setWithdrawForm(true)}
                                >
                                    Withdraw
                                </div>
                            </div>
                        </div>

                        {/* Investment List */}
                        {investmentType === 'mf' ? (
                            <div className="overflow-x-auto overflow-y-auto">
                                <div className="min-w-[600px]">
                                    <div className="grid grid-cols-4 font-semibold bg-blue-600 text-white py-2 px-3 rounded-md shadow">
                                        <div className="flex items-center gap-1"><Calendar size={16} /> Date</div>
                                        <div className="flex items-center gap-1"><TrendingUp size={16} /> Invested </div>
                                        <div className="flex items-center gap-1"><Wallet size={16} /> Total Invested</div>
                                        <div className="text-center">Actions</div>
                                    </div>

                                    {client?.MFInvestments.length === 0 &&
                                        <div className="flex justify-center items-center font-medium mt-4">No Investments</div>
                                    }

                                    {client?.MFInvestments?.map((p, index) => (
                                        <div key={p._id} className="grid grid-cols-4 items-center py-3 px-3 bg-white border-b border-zinc-200 text-sm">
                                            <div>{formatDate(p?.date)}</div>
                                            <div
                                                className={
                                                    Number(p?.investedValue) < 0
                                                        ? "text-red-900"
                                                        : "text-green-600"
                                                }
                                            >
                                               <span>{Number(p?.investedValue)<0 && "-"}</span> ₹{Math.abs(Number(p?.investedValue)).toLocaleString("en-IN")}
                                            </div>

                                            <div>₹{toIndianFormat(p?.totalValue)}</div>
                                            {index === 0 &&
                                                <div className="flex justify-center gap-3">
                                                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                                        onClick={() => handleEditInvestment(p)}>
                                                        <Edit2 size={15} /> Edit
                                                    </button>
                                                    <button className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                                                        onClick={() => handleDeleteInvestment(investmentType, p._id)}>
                                                        <Trash2 size={15} /> Delete
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // <FDInvestmentSection client={client}/>
                            <div className="overflow-x-auto overflow-y-auto">
                                <div className="md:min-w-[600px] min-w-[800px]">
                                    <div className="grid grid-cols-6 font-semibold bg-blue-600 text-white py-2 px-3 rounded-md shadow">
                                        <div className="flex items-center gap-1">
                                            <CalendarDays size={16} /> Date
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <PiggyBank size={16} /> Invested
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp size={16} /> Current ROI
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <IndianRupee size={16} /> Returns
                                        </div>
                                        <div className="flex items-center gap-1"><Wallet size={16} /> Current Value</div>
                                        <div className="text-center flex ">
                                            <div className="w-3/4 text-center">Actions</div>
                                            <div></div>
                                        </div>
                                    </div>

                                    {client?.FDInvestments.length === 0 &&
                                        <div className="flex justify-center items-center font-medium mt-4">No Investments</div>
                                    }

                                    {client?.FDInvestments?.map((p) => (
                                        <div key={p._id} className="grid grid-cols-6 items-center py-3 px-3 bg-white border-b border-zinc-200 text-sm">
                                            <div>{formatDate(p?.investedDate)}</div>
                                            <div className="ml-2">₹{toIndianFormat(p?.investedAtBeginning.toFixed(2))}</div>
                                            <div className="ml-5">{p?.rate}%</div>
                                            <div className="text-green-600 ml-2">+₹{toIndianFormat((p?.totalValue - p?.investedValue).toFixed(2))} ({((p?.totalValue - p?.investedValue) * 100 / p?.investedValue).toFixed(2)}%)</div>
                                            <div className="ml-3">₹{toIndianFormat(p.totalValue.toFixed(0))}</div>
                                            <div className="flex">
                                                <div className="flex justify-center gap-3 w-3/4">
                                                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                                        onClick={() => handleEditInvestment(p)}>
                                                        <Edit2 size={15} /> Edit


                                                    </button>
                                                    <button className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                                                        onClick={() => handleDeleteInvestment(investmentType, p._id)}>
                                                        <Trash2 size={15} /> Delete
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => toggleFD(p._id)}
                                                    className="flex justify-end w-1/4 text-gray-500 hover:text-blue-600 transition cursor-pointer"
                                                >
                                                    <ChevronDown
                                                        size={22}
                                                        className={`transition-transform duration-300 ${openFD === p._id ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>

                                            </div>
                                            {openFD === p._id && (
                                                <div className="col-span-6 bg-slate-50 border border-blue-100 rounded-lg mt-2 px-5 py-4 shadow-inner animate-fadeIn">

                                                    <div className="text-sm font-semibold text-blue-700 mb-3">
                                                        Withdrawal History
                                                    </div>

                                                    {p.FDWithdrawals?.length === 0 ? (
                                                        <div className="text-gray-500 text-sm italic">
                                                            No withdrawals made for this FD.
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {p.FDWithdrawals.map((w) => (
                                                                <div
                                                                    key={w._id}
                                                                    className="grid grid-cols-4 gap-4 bg-white p-4 rounded-md border border-gray-200 shadow-sm"
                                                                >
                                                                    <div>
                                                                        <div className="text-xs text-gray-500">Date</div>
                                                                        <div className="font-medium">{formatDate(w.withdrawalDate)}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-xs text-gray-500">Value Before</div>
                                                                        <div className="font-medium">
                                                                            ₹{Number(w.fdValueAtWithdrawal.toFixed(2)).toLocaleString("en-IN")}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-xs text-gray-500">Withdrawn</div>
                                                                        <div className="font-semibold text-red-600">
                                                                            ₹{toIndianFormat(w.amount.toFixed(2))}
                                                                        </div>
                                                                    </div>



                                                                    <div>
                                                                        <div className="text-xs text-gray-500">Value After</div>
                                                                        <div className="font-semibold text-green-700">
                                                                            ₹{Number((w.fdValueAtWithdrawal - w.amount).toFixed(2)).toLocaleString("en-IN")}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}






                    </div>




                    {/* Returns Section */}
                    {investmentType === "mf" &&
                        <>
                            <div className="max-w-5xl mx-auto mt-6 bg-white rounded-xl shadow-md p-6">
                                <div className="flex flex-row justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
                                        <Wallet className="w-5 h-5 text-blue-600" />
                                        Returns
                                    </h3>

                                    <div className="mt-2 bg-blue-600 text-white font-medium hover:bg-blue-700 cursor-pointer md:mt-0 border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none"
                                        onClick={() => setInterestForm(true)}
                                    >Add Returns</div>
                                </div>


                                {/* Investment List */}
                                <div className="overflow-x-auto overflow-y-auto">
                                    <div className="min-w-[600px]">
                                        <div className="grid grid-cols-4 font-semibold bg-blue-600 text-white py-2 px-3 rounded-md shadow">
                                            <div className="flex items-center gap-1"><Calendar size={16} /> Period</div>
                                            <div className="flex items-center gap-1"><TrendingUp size={16} /> Returns</div>
                                            <div className="flex items-center gap-1"><Wallet size={16} /> Current Value</div>
                                            <div className="text-center">Actions</div>
                                        </div>

                                        {client?.MFPeriodicInterest.length === 0 &&
                                            <div className="flex justify-center items-center font-medium mt-4">No Returns</div>
                                        }

                                        {client?.MFPeriodicInterest?.map((p, index) => (
                                            <div key={p._id} className="grid grid-cols-4 items-center py-3 px-3 bg-white border-b border-zinc-200 text-sm">
                                                <div>{formatDateRange(p?.startMonth, p?.endMonth)}</div>
                                                <div className="text-green-600">₹{toIndianFormat(p?.returns)} ({(p?.returns / (p?.totalValue - p?.returns) * 100).toFixed(2)}%)</div>
                                                <div>₹{toIndianFormat(Number(p?.totalValue || 0).toFixed(0))}</div>
                                                {index === 0 &&
                                                    <div className="flex justify-center gap-3">
                                                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                                            onClick={() => handleEditInterest(p)}>
                                                            <Edit2 size={15} /> Edit
                                                        </button>
                                                        <button className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                                                            onClick={() => handleDeleteInterest(p._id)}>
                                                            <Trash2 size={15} /> Delete
                                                        </button>
                                                    </div>
                                                }
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="text-white flex justify-center items-center mt-10">
                                <button
                                    onClick={() => handleResetMFInvestment(id)}
                                    disabled={isLoading}
                                    className={`${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                                        } px-4 py-2 rounded-md font-medium transition-all duration-200 cursor-pointer`}
                                >
                                    {isLoading ? "Removing All Investment and Returns..." : "Remove All Investment and Returns"}
                                </button>
                            </div>
                        </>
                    }

                </div>

            </div>
            {interestForm && <AddInterestForm setInterestForm={setInterestForm} client={client} />}
            {investmentForm && <AddInvestmentForm setInvestmentForm={setInvestmentForm} investmentType={investmentType} client={client} />}
            {editInvestmentForm && <EditInvestmentForm setEditInvestmentForm={setEditInvestmentForm} investmentType={investmentType} client={client} investment={investment} />}
            {editInterestForm && <EditInterestForm setEditInterestForm={setEditInterestForm} interest={interest} />}
            {withdrawForm && investmentType === "fd" && <FDWithdraw setWithdrawForm={setWithdrawForm} client={client} />}
            {withdrawForm && investmentType === "mf" && <MFWithdraw setWithdrawForm={setWithdrawForm} client={client} />}
            <Footer />
        </div>
    );
};



