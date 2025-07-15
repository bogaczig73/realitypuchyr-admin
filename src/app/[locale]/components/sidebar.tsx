'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image'
import { usePathname, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export default function Sidebar(){
    let [ manu, setmanu ] = useState<string>('');
    let [ submanu, setSubManu ] = useState<string>('');
    const t = useTranslations('Sidebar');
    const params = useParams();
    const locale = params.locale as string;
    let current = usePathname();

    useEffect(()=>{
        setSubManu(current);
        setmanu(current)
    },[current])
    
    return(
        <nav id="sidebar" className="sidebar-wrapper sidebar-dark">
            <div className="sidebar-content">
                <div className="sidebar-brand">
                    <Link href={`/${locale}`}><Image src='/images/logo-light.png' width={98} height={24} alt=""/></Link>
                </div>
                <SimpleBar style={{height: "calc(100% - 70px)"}}>
                    <ul className="sidebar-menu border-t border-white/10">
                        <li className={`${manu === `/${locale}` || ""? 'active' : ''} ms-0`}>
                            <Link href={`/${locale}`}><i className="mdi mdi-chart-bell-curve-cumulative me-2"></i>{t('dashboard')}</Link>
                        </li>

                        <li className={`${manu === `/${locale}/properties` ? 'active' : ''} ms-0`}>
                            <Link href={`/${locale}/properties`}><i className="mdi mdi-home-city me-2"></i>{t('properties')}</Link>
                        </li>

                        <li className={`${manu === `/${locale}/add-property` ? 'active' : ''} ms-0`}>
                            <Link href={`/${locale}/add-property`}><i className="mdi mdi-home-plus me-2"></i>{t('addProperties')}</Link>
                        </li>
                        <li className={`${manu === `/${locale}/blog` ? 'active' : ''} ms-0`}>
                            <Link href={`/${locale}/blog`}><i className="mdi mdi-post me-2"></i>{t('blog')}</Link>
                        </li>
                        <li className={`${manu === `/${locale}/review` ? 'active' : ''} ms-0`}>
                            <Link href={`/${locale}/review`}><i className="mdi mdi-star me-2"></i>{t('review')}</Link>
                        </li>

                        <li className={`${manu === `/${locale}/languages` ? 'active' : ''} ms-0`}>
                            <Link href={`/${locale}/languages`}><i className="mdi mdi-translate me-2"></i>{t('languages') || 'Languages'}</Link>
                        </li>

                        <li className={`sidebar-dropdown ms-0 ${["/login", "/signup", "/signup-success", "/reset-password", "/lock-screen"].includes(manu) ? 'active' : ''}`}>
                            <Link href="#" onClick={()=>{setSubManu(submanu === "/auth-item" ? '' : "/auth-item")}}><i className="mdi mdi-login me-2"></i>Authentication</Link>
                            <div className={`sidebar-submenu ${["/login", "/signup", "/signup-success", "/reset-password", "/lock-screen", "/auth-item"].includes(submanu) ? 'block' : ''}`}>
                                <ul>
                                    <li className={`${manu === "/login" ? 'active' : ''} ms-0`}><Link href="/login">Login</Link></li>
                                    <li className={`${manu === "/signup" ? 'active' : ''} ms-0`}><Link href="/signup">Signup</Link></li>
                                    <li className={`${manu === "/signup-success" ? 'active' : ''} ms-0`}><Link href="/signup-success">Signup Success</Link></li>
                                    <li className={`${manu === "/reset-password" ? 'active' : ''} ms-0`}><Link href="/reset-password">Reset Password</Link></li>
                                </ul>
                            </div>
                        </li>

                        <li className={`sidebar-dropdown ms-0 ${["/comingsoon", "/maintenance", "/error", "/thankyou"].includes(manu) ? 'active' : ''}`}>
                            <Link href="#" onClick={()=>{setSubManu(submanu === "/misce-item" ? '' : '/misce-item')}}><i className="mdi mdi-layers me-2"></i>Miscellaneous</Link>
                            <div className={`sidebar-submenu ${["/comingsoon", "/maintenance", "/error", "/thankyou", '/misce-item'].includes(submanu) ? 'block' : ''}`}>
                                <ul>
                                    <li className={`${manu === "/maintenance" ? 'active' : ''} ms-0`}><Link href="/maintenance">Maintenance</Link></li>
                                    <li className={`${manu === "/error" ? 'active' : ''} ms-0`}><Link href="/error">Error</Link></li>
                                    <li className={`${manu === "/privacy" ? 'active' : ''} ms-0`}><Link href="/privacy">Privacy Policy</Link></li>
                                    <li className={`${manu === "/terms" ? 'active' : ''} ms-0`}><Link href="/terms">Term & Condition</Link></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </SimpleBar>
            </div>
        </nav>
    )
}