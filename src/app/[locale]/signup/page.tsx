import React from "react";
import Link from "next/link";
import Image from "next/image";

import Switcher from "../components/switcher";
import BackToHome from "../components/backToHome";

export default function Signup(){
    return(
        <>
         <section className="h-screen flex items-center justify-center relative overflow-hidden bg-no-repeat bg-center bg-cover" style={{backgroundImage:`url('/images/01.jpg')`}}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
            <div className="container">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                    <div className="relative overflow-hidden bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-800 rounded-md">
                        <div className="p-6">
                            <Link href="">
                                <Image src='/images/logo-dark.png' width={98} height={28} className="mx-auto block dark:hidden" alt=""/>
                                <Image src='/images/logo-light.png' width={98} height={28} className="mx-auto dark:block hidden" alt=""/>
                            </Link>
                            <h5 className="my-6 text-xl font-semibold">Signup</h5>
                            <form className="text-start">
                                <div className="grid grid-cols-1">
                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="RegisterName">Your Name:</label>
                                        <input id="RegisterName" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-3" placeholder="Harry"/>
                                    </div>
    
                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="LoginEmail">Email Address:</label>
                                        <input id="LoginEmail" type="email" className="form-input border !border-gray-200 dark:!border-gray-800 mt-3" placeholder="name@example.com"/>
                                    </div>
    
                                    <div className="mb-4">
                                        <label className="font-semibold" htmlFor="LoginPassword">Password:</label>
                                        <input id="LoginPassword" type="password" className="form-input border !border-gray-200 dark:!border-gray-800 mt-3" placeholder="Password:"/>
                                    </div>
    
                                    <div className="mb-4">
                                        <div className="flex items-center mb-0">
                                            <input className="form-checkbox size-4 appearance-none rounded border border-gray-200 dark:border-gray-800 accent-green-600 checked:appearance-auto dark:accent-green-600 focus:border-green-300 focus:ring-0 focus:ring-offset-0 focus:ring-green-200 focus:ring-opacity-50 me-2" type="checkbox" value="" id="AcceptT&C"/>
                                            <label className="form-check-label text-slate-400" htmlFor="AcceptT&C">I Accept <Link href="" className="text-green-600">Terms And Condition</Link></label>
                                        </div>
                                    </div>
    
                                    <div className="mb-4">
                                        <Link href="" className="btn bg-green-600 hover:bg-green-700 text-white rounded-md w-full">Register</Link>
                                    </div>
    
                                    <div className="text-center">
                                        <span className="text-slate-400 me-2">Already have an account ? </span> <Link href="/login" className="text-black dark:text-white font-medium">Sign in</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800 text-center">
                            <p className="mb-0 text-slate-400">© {new Date().getFullYear()} Hously. Designed by <Link href="https://shreethemes.in/" target="_blank" className="text-reset">Shreethemes</Link>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Switcher/>
        <BackToHome/>
        </>
    )
}