'use client'
import React,{useState} from "react"
import Link from "next/link"

import Wrapper from "../components/wrapper"

import { accordianData } from "../../data/data";
import { FiChevronDown, FiPlus } from "react-icons/fi";

interface AccordianData{
    title: string;
    desc: string;
}

export default function Faqs(){
    let [ accordion1, setAccordion1 ] = useState<number>(0)
    let [ accordion2, setAccordion2 ] = useState<number>(0)
    let [ accordion3, setAccordion3 ] = useState<number>(0)
    let [ accordion4, setAccordion4 ] = useState<number>(0);
    let [ show, setShow ] = useState<boolean>(false);
    return(
        <Wrapper>
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center">
                    <div>
                        <h5 className="text-lg font-semibold">Frequently Asked Questions</h5>

                        <ul className="tracking-[0.5px] inline-block mt-2">
                            <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600 dark:hover:text-white"><Link href="/">Hously</Link></li>
                            <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                            <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">FAQs</li>
                        </ul>
                    </div>

                    <div>
                        <Link href="#" className="h-8 w-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-[20px] text-center bg-slate-800/5 hover:bg-slate-800/10 dark:bg-slate-700 border border-slate-100/5 dark:border-gray-700 text-slate-900 dark:text-white rounded-full" onClick={() =>setShow(true)}><FiPlus className="h-4 w-4"/></Link>
                    </div>

                    <div className={`${show ? '' : 'hidden'} fixed z-50  flex items-center justify-center overflow-hidden m-auto bg-slate-900/50 dark:bg-slate-900/80 inset-0`}>
                        <div className="relative w-full h-auto max-w-lg p-4">
                            <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                                    <h5 className="text-xl font-semibold">Add new question</h5>
                                    <button type="button" onClick={() =>setShow(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ms-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>  
                                    </button>
                                </div>
                                <div className="p-4">                        
                                    <form>
                                        <div className="grid grid-cols-12 gap-3">
                                            <div className="col-span-12">
                                                <label className="font-semibold">Question <span className="text-red-600">*</span></label>
                                                <input name="name" id="name" type="text" className="form-input w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border !border-gray-200 focus:!border-green-600 dark:!border-gray-800 dark:focus:!border-green-600 focus:ring-0 mt-2" placeholder="Title :"/>
                                            </div>

                                            <div className="col-span-12">
                                                <label className="font-semibold"> Answer </label>
                                                <textarea name="comments" id="comments" className="form-input w-full py-2 px-3 !h-24 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border !border-gray-200 focus:!border-green-600 dark:!border-gray-800 dark:focus:!border-green-600 focus:ring-0 mt-2" placeholder="Description :"></textarea>
                                            </div>

                                            <div className="col-span-12">
                                                <button type="submit" className="btn bg-green-600 hover:bg-green-700 text-white rounded-md">Add Q&A</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>                    
                            </div>
                        </div>
                    </div>

                </div>

                <div className="grid lg:grid-cols-2 grid-cols-1 mt-6 gap-6">
                    <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                        <h5 className="font-semibold">Buying Product</h5>

                        <div className="mt-6">
                            {accordianData.map((item:AccordianData, index:number) =>{
                                return(
                                    <div className="relative shadow-sm shadow-gray-200 dark:shadow-gray-700 rounded-md overflow-hidden mt-4" key={index}>
                                        <h2 className="text-base font-semibold" id="accordion-collapse-heading-1">
                                            <button type="button" className={`${accordion1 === index ? ' bg-gray-50 dark:bg-slate-800 text-green-600' :' text-dark dark:text-white'} flex justify-between items-center p-5 w-full font-medium text-start`} onClick={() =>setAccordion1(index)}>
                                                <span>{item.title}</span>
                                                <FiChevronDown className={`${accordion1 === index ? 'rotate-180' : ''} w-4 h-4 shrink-0`}/>
                                            </button>
                                        </h2>
                                        <div className={accordion1 === index ? '' : 'hidden'}>
                                            <div className="p-5">
                                                <p className="text-slate-400 dark:text-gray-400">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                        <h5 className="font-semibold">General Questions</h5>

                        <div id="accordion-collapsetwo" data-accordion="collapse" className="mt-6">
                            {accordianData.map((item:AccordianData, index:number) =>{
                                return(
                                    <div className="relative shadow-sm shadow-gray-200 dark:shadow-gray-700 rounded-md overflow-hidden mt-4" key={index}>
                                        <h2 className="text-base font-semibold" id="accordion-collapse-heading-1">
                                            <button type="button" className={`${accordion2 === index ? ' bg-gray-50 dark:bg-slate-800 text-green-600' :' text-dark dark:text-white'} flex justify-between items-center p-5 w-full font-medium text-start`} onClick={() =>setAccordion2(index)}>
                                                <span>{item.title}</span>
                                                <FiChevronDown className={`${accordion2 === index ? 'rotate-180' : ''} w-4 h-4 shrink-0`}/>
                                            </button>
                                        </h2>
                                        <div className={accordion2 === index ? '' : 'hidden'}>
                                            <div className="p-5">
                                                <p className="text-slate-400 dark:text-gray-400">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                        <h5 className="font-semibold">Payments Questions</h5>

                        <div id="accordion-collapsethree" data-accordion="collapse" className="mt-6">
                            {accordianData.map((item:AccordianData, index:number) =>{
                                return(
                                    <div className="relative shadow-sm shadow-gray-200 dark:shadow-gray-700 rounded-md overflow-hidden mt-4" key={index}>
                                        <h2 className="text-base font-semibold" id="accordion-collapse-heading-1">
                                            <button type="button" className={`${accordion3 === index ? ' bg-gray-50 dark:bg-slate-800 text-green-600' :' text-dark dark:text-white'} flex justify-between items-center p-5 w-full font-medium text-start`} onClick={() =>setAccordion3(index)}>
                                                <span>{item.title}</span>
                                                <FiChevronDown className={`${accordion3 === index ? 'rotate-180' : ''} w-4 h-4 shrink-0`}/>
                                            </button>
                                        </h2>
                                        <div className={accordion3 === index ? '' : 'hidden'}>
                                            <div className="p-5">
                                                <p className="text-slate-400 dark:text-gray-400">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                        <h5 className="font-semibold">Support Questions</h5>

                        <div id="accordion-collapsefour" data-accordion="collapse" className="mt-6">
                            {accordianData.map((item:AccordianData, index:number) =>{
                                return(
                                    <div className="relative shadow-sm shadow-gray-200 dark:shadow-gray-700 rounded-md overflow-hidden mt-4" key={index}>
                                        <h2 className="text-base font-semibold" id="accordion-collapse-heading-1">
                                            <button type="button" className={`${accordion4 === index ? ' bg-gray-50 dark:bg-slate-800 text-green-600' :' text-dark dark:text-white'} flex justify-between items-center p-5 w-full font-medium text-start`} onClick={() =>setAccordion4(index)}>
                                                <span>{item.title}</span>
                                                <FiChevronDown className={`${accordion4 === index ? 'rotate-180' : ''} w-4 h-4 shrink-0`}/>
                                            </button>
                                        </h2>
                                        <div className={accordion4 === index ? '' : 'hidden'}>
                                            <div className="p-5">
                                                <p className="text-slate-400 dark:text-gray-400">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Wrapper>
    )
}