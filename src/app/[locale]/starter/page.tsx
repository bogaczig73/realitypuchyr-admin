import React from "react";
import Link from "next/link";

import Wrapper from "../components/wrapper";

export default function Starter(){
    return(
        <Wrapper>
            <div className="container-fluid relative px-3">
                <div className="layout-specing">
                    <div className="md:flex justify-between items-center">
                        <h5 className="text-lg font-semibold">Starter Page</h5>

                        <ul className="tracking-[0.5px] inline-block sm:mt-0 mt-3">
                            <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600 dark:hover:text-white"><Link href="/">Hously</Link></li>
                            <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                            <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">Starter Page</li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 mt-6">
                        <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                            <p className="text-slate-400">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, aliquid soluta. Voluptas neque adipisci fuga magnam nulla exercitationem corrupti ducimus itaque soluta earum! Fugiat, animi id sit ad magnam facilis.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}