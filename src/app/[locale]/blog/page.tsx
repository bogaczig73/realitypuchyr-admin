'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from 'next-intl';

import { blogService } from "@/api/services/blogs";
import type { Blog, BlogResponse } from "@/types/property";
import { ApiError } from "@/api/errors";

import Wrapper from "@/app/[locale]/components/wrapper";
import AddBlog from "@/app/[locale]/components/addBlog";

export default function Blog(){
    const params = useParams();
    const searchParams = useSearchParams();
    const t = useTranslations('blog');
    const locale = String(params?.locale || 'en');
    
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const currentPage = Number(searchParams.get('page')) || 1;

    const fetchBlogs = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching blogs for page:', page);
            console.log('API base URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api');
            console.log('Blog endpoint:', '/blogs');
            const response: any = await blogService.getBlogs(locale, page, 12);
            console.log('Full API Response:', JSON.stringify(response, null, 2));
            console.log('Response type:', typeof response);
            
            // Handle different response formats
            let blogsArray: Blog[] = [];
            let paginationData = {
                total: 0,
                page: 1,
                limit: 12,
                totalPages: 0
            };

            // Check if response is a BlogResponse object with blogs and pagination
            if (response && typeof response === 'object' && 'blogs' in response) {
                console.log('Response is BlogResponse format');
                blogsArray = response.blogs || [];
                paginationData = response.pagination || paginationData;
            } 
            // Check if response is directly an array of blogs
            else if (Array.isArray(response)) {
                console.log('Response is direct array format');
                blogsArray = response;
                paginationData = {
                    total: response.length,
                    page: 1,
                    limit: response.length,
                    totalPages: 1
                };
            }
            // Check if response has a data property (common API wrapper)
            else if (response && typeof response === 'object' && 'data' in response) {
                console.log('Response has data wrapper');
                const data = response.data;
                if (Array.isArray(data)) {
                    blogsArray = data;
                    paginationData = {
                        total: data.length,
                        page: 1,
                        limit: data.length,
                        totalPages: 1
                    };
                } else if (data && 'blogs' in data) {
                    blogsArray = data.blogs || [];
                    paginationData = data.pagination || paginationData;
                }
            }
            // Fallback: treat response as unknown and show sample data
            else {
                console.log('Unknown response format, showing sample data');
                console.log('Response:', response);
                blogsArray = [
                    {
                        id: 1,
                        name: 'Sample Blog Post 1',
                        content: 'This is a sample blog post content for testing purposes.',
                        slug: 'sample-blog-post-1',
                        pictures: ['/images/property/1.jpg'],
                        tags: ['Sample', 'Test'],
                        date: new Date().toISOString(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        language: 'en'
                    },
                    {
                        id: 2,
                        name: 'Sample Blog Post 2',
                        content: 'This is another sample blog post content for testing purposes.',
                        slug: 'sample-blog-post-2',
                        pictures: ['/images/property/2.jpg'],
                        tags: ['Sample', 'Demo'],
                        date: new Date().toISOString(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        language: 'en'
                    }
                ];
                paginationData = {
                    total: 2,
                    page: 1,
                    limit: 12,
                    totalPages: 1
                };
            }
            
            console.log('Processed blogs array:', blogsArray);
            console.log('Processed pagination:', paginationData);
            
            // Log each blog item in detail
            console.log('=== DETAILED BLOG ITEMS ===');
            blogsArray.forEach((blog, index) => {
                console.log(`Blog ${index + 1}:`, {
                    id: blog.id,
                    name: blog.name,
                    content: blog.content,
                    slug: blog.slug,
                    pictures: blog.pictures,
                    tags: blog.tags,
                    date: blog.date,
                    metaTitle: blog.metaTitle,
                    metaDescription: blog.metaDescription,
                    keywords: blog.keywords,
                    language: blog.language,
                    createdAt: blog.createdAt,
                    updatedAt: blog.updatedAt,
                    // Additional computed values
                    contentPreview: getContentPreview(blog.content),
                    readingTime: getReadingTime(blog.content),
                    firstTag: getFirstTag(blog.tags),
                    formattedDate: formatDate(blog.date || blog.createdAt),
                    firstImage: blog.pictures && blog.pictures.length > 0 ? blog.pictures[0] : null
                });
            });
            console.log('=== END BLOG ITEMS ===');
            
            setBlogs(blogsArray);
            setPagination(paginationData);
            
        } catch (err) {
            console.error('Error details:', err);
            console.error('Error type:', typeof err);
            console.error('Error instanceof ApiError:', err instanceof ApiError);
            const errorMessage = err instanceof ApiError 
                ? err.message 
                : t('failedToLoad');
            setError(errorMessage);
            console.error('Error fetching blogs:', err);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    const getFirstTag = (tags?: string[]) => {
        return tags && tags.length > 0 ? tags[0] : 'General';
    };

    const getContentPreview = (content: string, maxLength: number = 150) => {
        if (!content) return '';
        // Remove HTML tags and get plain text
        const plainText = content.replace(/<[^>]*>/g, '');
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength).trim() + '...';
    };

    const truncateTitle = (title: string, maxLength: number = 50) => {
        if (!title) return '';
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength).trim() + '...';
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

    if (error) {
        return (
            <Wrapper>
                <div className="container-fluid relative px-3">
                    <div className="layout-specing">
                        <div className="text-center">
                            <div className="text-red-600 mb-4">{error}</div>
                            <button 
                                onClick={() => fetchBlogs(currentPage)}
                                className="btn btn-primary"
                            >
                                {t('tryAgain')}
                            </button>
                        </div>
                    </div>
                </div>
            </Wrapper>
        );
    }

    // Ensure blogs is always an array
    const blogsArray = Array.isArray(blogs) ? blogs : [];

    return(
        <Wrapper>
            <div className="container-fluid relative px-3">
                <div className="layout-specing">
                    <div className="md:flex justify-between items-center">
                        <div>
                            <h5 className="text-lg font-semibold">{t('title')}</h5>

                            <ul className="tracking-[0.5px] inline-block sm:mt-0 mt-3">
                                <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600 dark:hover:text-white"><Link href="/">Hously</Link></li>
                                <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                                <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">{t('title')}</li>
                            </ul>
                        </div>
                        <AddBlog/>
                    </div>

                    {blogsArray.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-slate-400 text-lg">{t('noBlogs')}</div>
                        </div>
                    ) : (
                        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-6">
                            {blogsArray.map((blog: Blog, index: number) => (
                                <div className="group relative h-fit overflow-hidden bg-white dark:bg-slate-900 rounded-xl shadow-sm shadow-gray-200 dark:shadow-gray-700 hover:shadow-lg hover:shadow-gray-300 dark:hover:shadow-gray-600 transition-all duration-500" key={blog.id}>
                                    <div className="relative overflow-hidden">
                                        <Image 
                                            src={blog.pictures && blog.pictures.length > 0 ? blog.pictures[0] : '/images/placeholder.webp'} 
                                            width={400} 
                                            height={250} 
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" 
                                            style={{width:'100%', height:'250px', objectFit:'cover'}} 
                                            className="w-full h-[250px] object-cover" 
                                            alt={blog.name || 'Blog post image'}
                                        />
                                        <div className="absolute end-4 top-4">
                                            <span className="bg-green-600 text-white text-[14px] px-2.5 py-1 font-medium rounded-full h-5">
                                                {getFirstTag(blog.tags)}
                                            </span>
                                        </div>
                                    </div>
            
                                    <div className="relative p-6">
                                        <div className="">
                                            <div className="flex justify-between mb-4">
                                                <span className="text-slate-400 text-sm">
                                                    <i className="mdi mdi-calendar-month align-middle text-base text-slate-900 dark:text-white me-2"></i>
                                                    {formatDate(blog.date || blog.createdAt)}
                                                </span>
                                                <span className="text-slate-400 text-sm ms-3">
                                                    <i className="mdi mdi-clock-outline align-middle text-base text-slate-900 dark:text-white me-2"></i>
                                                    {getReadingTime(blog.content)}
                                                </span>
                                            </div>
            
                                            <Link href={`/blog-detail/${blog.slug}`} className="title text-xl font-medium hover:text-green-600 duration-500 ease-in-out leading-tight block">
                                                {truncateTitle(blog.name)}
                                            </Link>
                                            
                                            <div className="mt-4">
                                                <Link href={`/blog-detail/${blog.slug}/edit`} className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300 rounded-md transition-all duration-300">
                                                    Edit <i className="mdi mdi-pencil ms-1.5 text-xs"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {pagination.totalPages > 1 && (
                        <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
                            <div className="md:col-span-12 text-center">
                                <nav>
                                    <ul className="inline-flex items-center -space-x-px">
                                        <li>
                                            <Link 
                                                href={`?page=${Math.max(1, pagination.page - 1)}`}
                                                className={`w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-xs shadow-gray-200 dark:shadow-gray-700 hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600 ${
                                                    pagination.page <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                                onClick={(e) => pagination.page <= 1 && e.preventDefault()}
                                            >
                                                <i className="mdi mdi-chevron-left text-[20px]"></i>
                                            </Link>
                                        </li>
                                        
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                            <li key={pageNum}>
                                                <Link 
                                                    href={`?page=${pageNum}`}
                                                    className={`w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 hover:text-white bg-white dark:bg-slate-900 shadow-xs shadow-gray-200 dark:shadow-gray-700 hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600 ${
                                                        pageNum === pagination.page ? 'text-white bg-green-600' : ''
                                                    }`}
                                                >
                                                    {pageNum}
                                                </Link>
                                            </li>
                                        ))}
                                        
                                        <li>
                                            <Link 
                                                href={`?page=${Math.min(pagination.totalPages, pagination.page + 1)}`}
                                                className={`w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-xs shadow-gray-200 dark:shadow-gray-700 hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600 ${
                                                    pagination.page >= pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                                onClick={(e) => pagination.page >= pagination.totalPages && e.preventDefault()}
                                            >
                                                <i className="mdi mdi-chevron-right text-[20px]"></i>
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    )
}