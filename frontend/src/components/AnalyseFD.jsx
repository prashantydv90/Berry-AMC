import React, { useEffect, useState } from 'react'

import { BarChart3, Target, TrendingUp, Wallet, History, Calendar } from "lucide-react";
import { calculateYearlyInterest, formatDate, formatYearMonth, getAnnualizedReturn, getProjectedReturns, projectFDReturns, toIndianFormat } from './utils';



export const AnalyseFD = ({ selectedfd, client,setOpenAnalyse }) => {
    const [projectedReturn, setProjectedReturn] = useState([]);
    const[totalValue,setTotalValue]=useState();
    const [invested,setInvested]=useState();

    useEffect(() => {
        if(client){
            setTotalValue(client.FDInvestments[selectedfd].totalValue);
            setInvested(client.FDInvestments[selectedfd].investedValue);
            setProjectedReturn(projectFDReturns(client.FDInvestments[selectedfd]))
        }
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
                            ₹{totalValue? toIndianFormat((totalValue).toFixed(0)):"0"}
                        </div>
                    </div>

                    {/* Returns */}
                    <div className="w-1/3 md:w-1/4 flex flex-col items-center md:items-end ">
                        <div className="flex items-center  space-x-1 text-zinc-600 text-[13.5px] font-medium">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span>Returns</span>
                        </div>
                        <div className="font-semibold flex flex-wrap justify-center md:justify-end text-md text-green-600 leading-tight">
                            <div>+₹{totalValue && toIndianFormat((totalValue-invested).toFixed(2))}</div>
                            <div className='leading-tight ml-1'>({totalValue && ((totalValue-invested)*100/invested).toFixed(2)}%)</div>
                        </div>

                    </div>

                    {/* Invested */}
                    <div className="w-1/3 md:w-1/4 flex flex-col items-end">
                        <div className="flex items-center space-x-1 text-zinc-600 text-[13.5px] font-medium">
                            <Wallet className="w-4 h-4 text-gray-500" />
                            <span>Invested</span>
                        </div>
                        <div className="font-semibold text-md text-gray-900">₹{invested && toIndianFormat(invested.toFixed(0))}</div>
                    </div>

                </div>


                <div className='px-4  md:px-6 mt-3'>
                    <div className='text-[14px] text-center'>
                        Projected Returns of 15 Years from the Date of Investment.
                    </div>

                </div>


               

                {/* Projected returns */}
                
                    <div className='px-5 md:px-10 w-full flex flex-col items-center mt-5 md:mt-4 h-[78%] md:h-[70%] pb-5 md:pb-1'>

                        <div className="flex w-full md:w-[80%] mb-2 ">

                            {/* Period */}
                            <div className="w-1/3 md:w-4/10 flex items-center text-[14px] text-zinc-600 font-medium space-x-1">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>Date</span>
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


                        <div className='w-full flex flex-col gap-0.5 items-center h-full overflow-y-auto '>
                            {projectedReturn?.map((item,index)=>(

                            
                            <div key={index} className='flex w-full md:w-[80%] mb-2 md:mb-0.5 '>
                                <div className='w-1/3 md:w-4/10 text-[15px]  font-medium leading-tight pr-3'>{formatDate( item?.date)}</div>
                                
                                <div className='w-1/3 md:w-3/10 pr-1 md:pr-0 flex flex-wrap md:justify-end justify-center text-[15px] text-green-600 font-medium'>
                                    <div className='leading-tight flex  md:pr-0'><span className=''>+</span><span>₹{toIndianFormat((item?.totalValue-invested).toFixed(0))}</span></div>
                                    <div className='leading-tight ml-1'>({((item?.totalValue-invested)*100/invested).toFixed(2)}%)</div>
                                </div>
                                <div className='w-1/3 md:w-3/10 flex flex-wrap justify-end text-[15px] font-medium '>
                                    <div className=' leading-tight md:pr-0'>₹{toIndianFormat(item?.totalValue.toFixed(0))}</div>
                                    {/* <div className='  leading-tight ml-1'>(10%)</div> */}
                                </div>

                                
                            </div>
                            ))}
                    
                                
                            

                        </div>

                    </div>
                


            </div>
        </div>
    )
}



