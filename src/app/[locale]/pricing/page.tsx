import React from "react";
import Link from "next/link";

import Wrapper from "../components/wrapper";

import { pricingData } from "../../data/data";

interface PriceData{
    icon: string;
    title: string;
    amount: string;
    feature: string[];
}

export default function Pricing(){
    return(
        <Wrapper>
            <div className="container-fluid relative px-3">
                <div className="layout-specing">
                    <div className="md:flex justify-between items-center">
                        <h5 className="text-lg font-semibold">Pricing</h5>

                        <ul className="tracking-[0.5px] inline-block sm:mt-0 mt-3">
                            <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600 dark:hover:text-white"><Link href="/">Hously</Link></li>
                            <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                            <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">Pricing</li>
                        </ul>
                    </div>

                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-6">
                        {pricingData.map((item:PriceData, index:number) =>{
                            return(
                                <div className="rounded-md bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700 hover:shadow-md dark:hover:shadow-gray-700 duration-500 ease-in-out" key={index}>
                                    <div className="border-b !border-gray-200 dark:!border-gray-800 p-6 text-center">
                                        <div className="w-24 h-24 bg-green-600/5 text-green-600 flex items-center justify-center text-3xl rounded-full mx-auto">
                                            <i className={item.icon}></i>
                                        </div>

                                        <h3 className="text-2xl text-green-600 font-medium mt-4">{item.title}</h3>
                                    
                                        <div className="flex justify-center mt-4">
                                            <span className="text-xl">$</span>
                                            <span className="text-3xl font-semibold">{item.amount}</span>
                                            <span className="text-xl self-end">/month</span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h5>Pricing Features:</h5>

                                        <ul className="list-none">
                                            {item.feature.map((el,index) =>{
                                                return(
                                                    <li className="text-slate-400 mt-2 ms-0" key={index}><span className="text-green-600 text-lg me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>{el}</li>
                                                )
                                            })}
                                        </ul>
                                        
                                        <Link href="" className="btn bg-green-600 hover:bg-green-700 border-green-600 dark:border-green-600 text-white rounded-md w-full mt-4">Get Started</Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}