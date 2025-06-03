'use client'
import React from "react";
import Link from "next/link";
import Image from "next/image";

import Wrapper from "../../components/wrapper";

import { blogData, recentPost } from "../../../data/data";
import { FiFacebook, FiGithub, FiGitlab, FiInstagram, FiLinkedin, FiMail, FiMessageCircle, FiTwitter, FiUser, FiYoutube } from "react-icons/fi";

import { useParams } from "next/navigation";

interface BlogList{
    id: number;
    image: string;
    title: string;
    date: string;
    time: string;
    tag: string;
}

export default function BlogDetail(){
    const params = useParams(); 
    const id = parseInt(String(params?.id || 0));
    const data:BlogList | undefined = blogData.find((user) => user?.id === id);
    return(
        <Wrapper>
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center">
                    <h5 className="text-lg font-semibold">{data?.title}</h5>

                    <ul className="tracking-[0.5px] inline-block sm:mt-0 mt-3">
                        <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600 dark:hover:text-white"><Link href="/">Hously</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                        <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">Blog Detail</li>
                    </ul>
                </div>

                <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-6 mt-6">
                    <div className="lg:col-span-8 md:order-1 order-2">
                        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700">

                            <Image src={data?.image ?? ""} width={0} height={0} sizes="100vw" style={{width:'100%', height:'auto'}} alt=""/>

                            <div className="p-6">
                                <p className="text-slate-400">The most well-known dummy text is the Lorem Ipsum, which is said to have originated in the 16th century. Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to proper Latin. It contains a series of real Latin words. This ancient dummy text is also incomprehensible, but it imitates the rhythm of most European languages in Latin script.</p>
                                <p className="text-slate-400 italic border-x-4 border-green-600 rounded-ss-xl rounded-ee-xl mt-3 p-3"> There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. </p>
                                <p className="text-slate-400 mt-3">The advantage of its Latin origin and the relative meaninglessness of Lorum Ipsum is that the text does not attract attention to itself or distract the viewers attention from the layout.</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-md p-6 shadow-sm shadow-gray-200 dark:shadow-gray-700 mt-6">
                            <h5 className="text-lg font-semibold">Leave A Comment:</h5>

                            <form className="mt-8">
                                <div className="grid lg:grid-cols-12 lg:gap-6">
                                    <div className="lg:col-span-6 mb-5">
                                        <div className="text-start">
                                            <label htmlFor="name" className="font-semibold">Your Name:</label>
                                            <div className="form-icon relative mt-2">
                                                <FiUser className="w-4 h-4 absolute top-3 start-4"/>
                                                <input name="name" id="name" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 !ps-11" placeholder="Name :"/>
                                            </div>
                                        </div>
                                    </div>
    
                                    <div className="lg:col-span-6 mb-5">
                                        <div className="text-start">
                                            <label htmlFor="email" className="font-semibold">Your Email:</label>
                                            <div className="form-icon relative mt-2">
                                                <FiMail className="w-4 h-4 absolute top-3 start-4"/>
                                                <input name="email" id="email" type="email" className="form-input border !border-gray-200 dark:!border-gray-800 !ps-11" placeholder="Email :"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1">
                                    <div className="mb-5">
                                        <div className="text-start">
                                            <label htmlFor="comments" className="font-semibold">Your Comment:</label>
                                            <div className="form-icon relative mt-2">
                                                <FiMessageCircle className="w-4 h-4 absolute top-3 start-4"/>
                                                <textarea name="comments" id="comments" className="form-input border !border-gray-200 dark:!border-gray-800 !ps-11 h-28" placeholder="Message :"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" id="submit" name="send" className="btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-md w-full">Send Message</button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-4 md:order-2 order-1">
                        <div className="bg-white dark:bg-slate-900 rounded-md p-6 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                            <form>
                                <div>
                                    <label htmlFor="searchname" className="font-medium text-lg">Search Properties</label>
                                    <div className="relative mt-2">
                                        <i className="mdi mdi-magnify text-lg absolute top-[6px] start-3"></i>
                                        <input name="search" id="searchname" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 !ps-10" placeholder="Search"/>
                                    </div>
                                </div>
                            </form>

                            <h5 className="font-medium text-lg mt-[30px]">Recent post</h5>
                            {recentPost.map((item,index) =>{
                                return(
                                    <div className="flex items-center mt-4" key={index}>
                                        <Image src={item.image} width={96} height={64} className="h-16 rounded-md shadow-sm dark:shadow-gray-800" alt=""/>
        
                                        <div className="ms-3">
                                            <Link href="" className="font-medium hover:text-green-600">{item.title}</Link>
                                            <p className="text-sm text-slate-400">{item.date}</p>
                                        </div>
                                    </div>
                                )
                            })}

                            <h5 className="font-medium text-lg mt-[30px]">Social sites</h5>
                            <ul className="list-none mt-4">
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiFacebook className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiInstagram className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiTwitter className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiLinkedin className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiGithub className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiYoutube className="h-4 w-4"/></Link></li>
                                <li className="inline mx-0.5"><Link href="" className="btn btn-icon btn-sm border border-gray-100 dark:border-gray-800 rounded-md text-slate-400 hover:border-green-600 hover:text-white hover:bg-green-600"><FiGitlab className="h-4 w-4"/></Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Wrapper>
    )
}