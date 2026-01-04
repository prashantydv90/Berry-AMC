import React, { useEffect, useRef, useState } from 'react'

import { BarChart3, Target, TrendingUp, Wallet, History, Calendar, ChevronDown } from "lucide-react";
import formatDateRange, { calculateYearlyInterest, formatYearMonth, getAnnualizedReturn, getProjectedReturns, toIndianFormat } from './utils';
import calculateClientXIRR from './xirr';



export const Analyse = ({ setOpenAnalyse, selected, client }) => {
    const [isPast, setIsPast] = useState(true);
    const [projectedReturn, setProjectedReturn] = useState([]);
    const [CAGR, setCAGR] = useState(null)
    useEffect(() => {
        if (!client?.MFPeriodicInterest?.length) return;

        const len = client.MFPeriodicInterest.length;

        // oldest is at the end, latest is at 0
        const oldest = client.MFPeriodicInterest[len - 1];
        const latest = client.MFPeriodicInterest[0];

        const initialValue = client?.MFTotalInvested
        const finalValue = client?.MFTotalValue

        // const CAGR = getAnnualizedReturn(initialValue, finalValue, len * 3);
        const Cagr = calculateClientXIRR(client);
        setCAGR(Cagr);

        const [startYear, startM] = latest.endMonth.split("-").map(Number);

        const projected = getProjectedReturns(finalValue, Cagr, startM, startYear, 15);
        setProjectedReturn(projected);

    }, [client]);

    return (
        <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center' onClick={() => setOpenAnalyse(false)}>
            <button
                onClick={() => setOpenAnalyse(false)}
                className="fixed top-2 cursor-pointer right-5 z-60 text-white text-5xl font-bold hover:text-gray-300"
            >
                &times;
            </button>
            <div className='z-90 w-9/10 md:w-8/10 lg:w-2/3 h-[85%] mt-5 bg-zinc-100 rounded-xl border-1 border-zinc-400' onClick={(e) => e.stopPropagation()}>

                {/* upper box */}
                <div className='py-3.5 border-b-1 border-zinc-300 flex px-4 md:px-7 items-center'>
                    {/* Current */}
                    <div className="w-1/3 md:w-1/2 flex flex-col">
                        <div className="flex items-center space-x-1 text-zinc-600 text-[13.5px] font-medium">
                            <BarChart3 className="w-4 h-4 text-gray-500" />
                            <span>Current</span>
                        </div>
                        <div className="font-semibold text-[18px] text-gray-900">
                            ₹{toIndianFormat(Number(client?.MFTotalValue).toFixed(0))}
                        </div>
                    </div>

                    {/* Returns */}
                    <div className="w-1/3 md:w-1/4 flex flex-col items-center md:items-end ">
                        <div className="flex items-center  space-x-1 text-zinc-600 text-[13.5px] font-medium">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span>Returns</span>
                        </div>
                        <div className="font-semibold flex flex-wrap justify-center md:justify-end text-md text-green-600 leading-tight">
                            <div>+₹{toIndianFormat((client?.MFTotalValue - client?.MFTotalInvested).toFixed(2))}</div>
                            <div className='leading-tight ml-1'>({(((client?.MFTotalValue - client?.MFTotalInvested) / client?.MFTotalInvested) * 100).toFixed(2)}%)</div>
                        </div>

                    </div>

                    {/* Invested */}
                    <div className="w-1/3 md:w-1/4 flex flex-col items-end">
                        <div className="flex items-center space-x-1 text-zinc-600 text-[13.5px] font-medium">
                            <Wallet className="w-4 h-4 text-gray-500" />
                            <span>Invested</span>
                        </div>
                        <div className="font-semibold text-md text-gray-900">₹{toIndianFormat(client?.MFTotalInvested)}</div>
                    </div>

                </div>


                <div className='px-4  md:px-6 mt-6 flex items-center '>
                    <div className=' fixed '>

                        <CustomSelect
                            label="Returns"
                            value={isPast ? "past" : "projected"}
                            onChange={(val) => setIsPast(val === "past")}
                            options={[
                                { value: "past", label: "Past Returns" },
                                { value: "projected", label: "Projected Returns" },
                            ]}
                        />


                    </div>
                    {CAGR &&
                       <span className='flex-1 text-end pr-1 md:pr-0 md:text-center text-[15px] font-medium text-zinc-600'>XIRR - <span className='text-green-600'>{CAGR}%</span></span>
                    }

                </div>


                {/* Past returns */}
                {(isPast && client?.MFPeriodicInterest && client?.MFPeriodicInterest.length > 0) ?
                    <div className='px-5 md:px-10 w-full flex flex-col items-center mt-5 md:mt-6 h-[78%] md:h-[70%] pb-5 md:pb-1'>

                        <div className="flex w-full md:w-[80%] mb-2  ">

                            {/* Period */}
                            <div className="w-1/3 md:w-4/10 flex items-center text-[14px] text-zinc-600 font-medium space-x-1">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>Period</span>
                            </div>

                            {/* Returns */}
                            <div className="w-1/3 md:w-3/10 flex justify-center pr-6 md:pr-0 items-center md:justify-end text-[14px] text-zinc-600 font-medium space-x-1">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span>Returns</span>
                            </div>

                            {/* Value */}
                            <div className="w-1/3 md:w-3/10 flex items-center justify-end text-[14px] text-zinc-600 font-medium space-x-1">
                                <Wallet className="w-4 h-4 text-gray-500" />
                                <span>Value</span>
                            </div>
                        </div>


                        <div className='w-full flex flex-col items-center h-full overflow-y-auto '>
                            {client?.MFPeriodicInterest?.map((item) => (


                                <div key={item._id} className='flex w-full md:w-[80%] mb-2 md:mb-0.5 '>

                                    <div className='w-1/3 md:w-4/10 text-[15px]  font-medium leading-tight pr-3'>{formatYearMonth(item.startMonth, item.endMonth)}</div>

                                    <div className='w-1/3 md:w-3/10 pr-4 md:pr-0 flex flex-wrap md:justify-end justify-center text-[15px] text-green-600 font-medium'>
                                        <div className='leading-tight  md:pr-0'>₹{toIndianFormat(item?.returns.toFixed(2))}</div>
                                        <div className='leading-tight ml-1'>({(item?.returns * 100 / (item?.totalValue - item?.returns)).toFixed(2)}%)</div>
                                    </div>
                                    <div className='w-1/3 md:w-3/10 flex flex-wrap justify-end text-[15px] font-medium '>
                                        <div className=' leading-tight md:pr-0'>₹{toIndianFormat(Number(item?.totalValue).toFixed(0))}</div>

                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>
                    :
                    (isPast &&
                        <div className='text-zinc-600 font-medium text-center  h-full items-center justify-center mt-20 px-10 '><div className=''>No past returns available right now.</div></div>)
                }

                {/* Projected returns */}
                {!isPast &&
                    <div className='px-5 md:px-10 w-full flex flex-col items-center mt-5 md:mt-4 h-[78%] md:h-[70%] pb-5 md:pb-1'>
                        {(projectedReturn && projectedReturn.length > 0) &&
                            <div className="flex w-full md:w-[80%] mb-2 ">

                                {/* Period */}
                                <div className="w-1/3 md:w-4/10 flex items-center text-[14px] text-zinc-600 font-medium space-x-1">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span>Period</span>
                                </div>

                                {/* Returns */}
                                <div className="w-1/3 md:w-3/10 flex justify-center pr-6 md:pr-0 items-center md:justify-end text-[14px] text-zinc-600 font-medium space-x-1">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span>Returns</span>
                                </div>

                                {/* Value */}
                                <div className="w-1/3 md:w-3/10 flex items-center justify-end text-[14px] text-zinc-600 font-medium space-x-1">
                                    <Wallet className="w-4 h-4 text-gray-500" />
                                    <span>Value</span>
                                </div>
                            </div>
                        }


                        <div className='w-full flex flex-col gap-0.5 items-center h-full overflow-y-auto '>
                            {(!projectedReturn || projectedReturn.length === 0) ? (
                                <div className="text-center text-zinc-600 font-medium py-6 px-5 md:px-15 2xl:px-40 mt-20">
                                    No projected returns available yet — since no returns have been generated till now, projections cannot be estimated.
                                </div>
                            ) : (
                                projectedReturn.map((item, index) => (
                                    <div key={index} className='flex w-full md:w-[80%] mb-2 md:mb-0.5 '>
                                        <div className='w-1/3 md:w-4/10 text-[15px]  font-medium leading-tight pr-3'>{item?.date}</div>

                                        <div className='w-1/3 md:w-3/10 pr-1 md:pr-0 flex flex-wrap md:justify-end justify-center text-[15px] text-green-600 font-medium'>
                                            <div className='leading-tight flex  md:pr-0'><span className=''>+</span><span>₹{toIndianFormat((item?.totalValue) - (client?.MFTotalInvested))}</span></div>
                                            <div className='leading-tight ml-1'>({((item?.totalValue - client?.MFTotalInvested) / client?.MFTotalInvested * 100).toFixed(2)}%)</div>
                                        </div>
                                        <div className='w-1/3 md:w-3/10 flex flex-wrap justify-end text-[15px] font-medium '>
                                            <div className=' leading-tight md:pr-0'>₹{toIndianFormat(item?.totalValue)}</div>
                                            {/* <div className='  leading-tight ml-1'>(10%)</div> */}
                                        </div>


                                    </div>
                                )))}




                        </div>

                    </div>
                }


            </div>
        </div>
    )
}







const CustomSelect = ({ label, options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const handleSelect = (option) => {
        onChange(option.value);
        setOpen(false);
    };

    // Close dropdown if click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-36" ref={ref}>
            {/* Label */}
            <label className="absolute -top-2 left-3 bg-zinc-100 text-zinc-500 px-1 text-[11px] font-medium">
                {label}
            </label>

            {/* Selected value */}
            <div
                className="border border-zinc-300 rounded-md p-2 flex justify-between items-center cursor-pointer hover:border-blue-500 transition"
                onClick={() => setOpen(!open)}
            >
                <span className="text-[13.5px]">{options.find((o) => o.value === value)?.label}</span>
                <ChevronDown
                    size={16}
                    className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                />
            </div>

            {/* Options */}
            <div
                className={`absolute top-full left-0 w-full mt-1 bg-white border border-zinc-300 rounded-md shadow-lg z-50 max-h-40 overflow-auto text-[13px]
        transform transition-all duration-200 ease-in-out origin-top ${open ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
                    }`}
            >
                {options.map((option) => (
                    <div
                        key={option.value}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleSelect(option)}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
};
