import React from "react";
import Link from "next/link";

export default function Footer(){
    return(
        <footer className="shadow-sm shadow-gray-200 dark:shadow-gray-700 bg-white dark:bg-slate-900 px-6 py-4">
            <div className="container-fluid">
                <div className="grid grid-cols-1">
                    <div className="sm:text-start text-center mx-md-2">
                        <p className="mb-0 text-slate-400">© {new Date().getFullYear()} Hously. Design & Develop with <i className="mdi mdi-heart text-red-600"></i> by <Link href="https://shreethemes.in/" target="_blank" className="text-reset">Shreethemes</Link>.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}