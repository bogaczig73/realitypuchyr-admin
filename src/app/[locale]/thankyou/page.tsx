import React from "react";
import Link from "next/link";

import Switcher from "../components/switcher";
import BackToHome from "../components/backToHome";
import { FiThumbsUp } from "react-icons/fi";

export default function ThankYou(){
    return(
        <>
         <section className="relative h-screen flex items-center justify-center text-center bg-gray-50 dark:bg-slate-800">
            <div className="container relative">
                <div className="grid grid-cols-1">
                    <div className="title-heading text-center my-auto">
                        <div className="w-24 h-24 bg-green-600/5 text-green-600 rounded-md flex align-middle justify-center items-center shadow-xs dark:shadow-gray-800 mx-auto">
                            <FiThumbsUp className="h-10 w-10"/>
                        </div>
                        <h1 className="mt-6 mb-8 md:text-5xl text-3xl font-bold">Thank You</h1>
                        <p className="text-slate-400 max-w-xl mx-auto">We are a huge marketplace dedicated to connecting great artists of all Hously with their fans and unique token collectors!</p>
                        
                        <div className="mt-6">
                            <Link href="/" className="btn bg-green-600/5 hover:bg-green-600 border-green-600/10 hover:border-green-600 text-green-600 hover:text-white rounded-md">Back to Home</Link>
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