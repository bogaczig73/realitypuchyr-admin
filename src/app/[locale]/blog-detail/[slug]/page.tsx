'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from 'next-intl';

import Wrapper from "@/app/[locale]/components/wrapper";
import { blogService } from "@/api/services/blogs";
import type { Blog } from "@/types/property";
import { ApiError } from "@/api/errors";

import { FiFacebook, FiGithub, FiGitlab, FiInstagram, FiLinkedin, FiMail, FiMessageCircle, FiTwitter, FiUser, FiYoutube } from "react-icons/fi";

export default function BlogDetail(){
    const params = useParams(); 
    const t = useTranslations('blog');
    const slug = String(params?.slug || '');
    
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await blogService.getBlogBySlug(slug);
                setBlog(data);
            } catch (err) {
                const errorMessage = err instanceof ApiError 
                    ? err.message 
                    : t('failedToLoadDetails');
                setError(errorMessage);
                console.error('Error fetching blog:', err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <Wrapper>
                <div className="container-fluid relative px-3">
                    <div className="layout-specing">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }

    if (error || !blog) {
        return (
            <Wrapper>
                <div className="container-fluid relative px-3">
                    <div className="layout-specing">
                        <div className="text-center">
                            <div className="text-red-600 mb-4">{error || t('blogNotFound')}</div>
                            <Link href="/blog" className="btn btn-primary">
                                {t('backToBlogs')}
                            </Link>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }

    return(
        <Wrapper>
        <div className="container-fluid relative px-3">
            <div className="layout-specing">
                <div className="md:flex justify-between items-center">
                    <h5 className="text-lg font-semibold">{blog.title}</h5>

                    <ul className="tracking-[0.5px] inline-block sm:mt-0 mt-3">
                        <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600 dark:hover:text-white"><Link href="/">Hously</Link></li>
                        <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                        <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">Blog Detail</li>
                    </ul>
                </div>

                <div className="grid lg:grid-cols-12 md:grid-cols-2 grid-cols-1 gap-6 mt-6">
                    <div className="lg:col-span-8 md:order-1 order-2">
                        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700">

                            <Image 
                                src={blog.image || '/images/placeholder.webp'} 
                                width={0} 
                                height={0} 
                                sizes="100vw" 
                                style={{width:'100%', height:'auto'}} 
                                alt={blog.title}
                            />

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-slate-400 text-sm">
                                        <i className="mdi mdi-calendar-month align-middle text-base text-slate-900 dark:text-white me-2"></i>
                                        {formatDate(blog.createdAt)}
                                    </span>
                                    {blog.tags && blog.tags.length > 0 && (
                                        <div className="flex gap-2">
                                            {blog.tags.map((tag, index) => (
                                                <span key={index} className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="prose prose-lg max-w-none dark:prose-invert">
                                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-md p-6 shadow-sm shadow-gray-200 dark:shadow-gray-700 mt-6">
                            <h5 className="text-lg font-semibold">{t('leaveComment')}</h5>

                            <form className="mt-8">
                                <div className="grid lg:grid-cols-12 lg:gap-6">
                                    <div className="lg:col-span-6 mb-5">
                                        <div className="text-start">
                                            <label htmlFor="name" className="font-semibold">{t('yourName')}</label>
                                            <div className="form-icon relative mt-2">
                                                <FiUser className="w-4 h-4 absolute top-3 start-4"/>
                                                <input name="name" id="name" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 !ps-11" placeholder="Name :"/>
                                            </div>
                                        </div>
                                    </div>
    
                                    <div className="lg:col-span-6 mb-5">
                                        <div className="text-start">
                                            <label htmlFor="email" className="font-semibold">{t('yourEmail')}</label>
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
                                            <label htmlFor="comments" className="font-semibold">{t('yourComment')}</label>
                                            <div className="form-icon relative mt-2">
                                                <FiMessageCircle className="w-4 h-4 absolute top-3 start-4"/>
                                                <textarea name="comments" id="comments" className="form-input border !border-gray-200 dark:!border-gray-800 !ps-11 h-28" placeholder="Message :"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" id="submit" name="send" className="btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-md w-full">{t('sendMessage')}</button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-4 md:order-2 order-1">
                        <div className="bg-white dark:bg-slate-900 rounded-md p-6 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                            <form>
                                <div>
                                    <label htmlFor="searchname" className="font-medium text-lg">{t('searchProperties')}</label>
                                    <div className="relative mt-2">
                                        <i className="mdi mdi-magnify text-lg absolute top-[6px] start-3"></i>
                                        <input name="search" id="searchname" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 !ps-10" placeholder="Search"/>
                                    </div>
                                </div>
                            </form>

                            <h5 className="font-medium text-lg mt-[30px]">{t('socialSites')}</h5>
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