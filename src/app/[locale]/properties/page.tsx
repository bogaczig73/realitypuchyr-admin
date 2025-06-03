'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Wrapper from "@/components/wrapper";
import { Property, Pagination } from "@/types/property";
import { propertyService } from "@/services/propertyService";
import { useSearchParams, useParams } from 'next/navigation';
import { propertyApi } from '@/services/api';
import { useTranslations } from 'next-intl';

export default function ExploreProperty() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        pages: 0,
        currentPage: 1,
        limit: 12
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({});

    const params = useParams();
    const searchParams = useSearchParams();
    const t = useTranslations('properties');
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';

    const fetchProperties = async (page: number, search: string = "") => {
        try {
            setLoading(true);
            setError(null);
            const response = await propertyApi.getAll(page, 12, search);
            setProperties(response.properties);
            setPagination(response.pagination);
        } catch (error) {
            setError('Failed to load properties. Please try again later.');
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties(page, search);
    }, [page, search]);

    const handlePageChange = (page: number) => {
        fetchProperties(page, search);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProperties(1, searchQuery);
    };

    const handleImageLoad = (id: number) => {
        setImageLoading(prev => ({ ...prev, [id]: false }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <Wrapper>
            <div className="container-fluid relative px-3">
                <div className="layout-specing">
                    <div className="md:flex justify-between items-center">
                        <h5 className="text-lg font-semibold">{t('title')}</h5>

                        <ul className="tracking-[0.5px] inline-block sm:mt-0 mt-3">
                            <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600 dark:hover:text-white">
                                <Link href={`/${params.locale}`}>Hously</Link>
                            </li>
                            <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180">
                                <i className="mdi mdi-chevron-right"></i>
                            </li>
                            <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">
                                {t('title')}
                            </li>
                        </ul>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mt-6">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('filter')}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                                {t('search')}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center min-h-[400px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                        </div>
                    ) : (
                        <>
                            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-6">
                                {properties.map((item) => (
                                    <div className="group rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl dark:hover:shadow-xl shadow-gray-200 dark:shadow-gray-700 dark:hover:shadow-gray-700 overflow-hidden ease-in-out duration-500" key={item.id}>
                                        <div className="relative">
                                            {imageLoading[item.id] !== false && (
                                                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                                            )}
                                            <Image 
                                                src={item.images[0]?.url || '/images/placeholder.jpg'} 
                                                width={0} 
                                                height={0} 
                                                sizes="100vw" 
                                                style={{width:'100%', height:'auto'}} 
                                                alt={item.name}
                                                onLoad={() => handleImageLoad(item.id)}
                                                className={imageLoading[item.id] !== false ? 'opacity-0' : 'opacity-100'}
                                            />

                                            <div className="absolute top-4 end-4">
                                                <Link href="#" className="btn btn-icon bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700 !rounded-full text-slate-100 dark:text-slate-700 focus:text-red-600 dark:focus:text-red-600 hover:text-red-600 dark:hover:text-red-600">
                                                    <i className="mdi mdi-heart text-[20px]"></i>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="pb-6">
                                                <Link href={`/${params.locale}/property-detail/${item.id}`} className="text-lg hover:text-green-600 font-medium ease-in-out duration-500">
                                                    {item.name}
                                                </Link>
                                            </div>

                                            <ul className="py-6 border-y border-slate-100 dark:border-gray-800 flex items-center list-none">
                                                <li className="flex items-center me-4">
                                                    <i className="mdi mdi-arrow-expand-all text-2xl me-2 text-green-600"></i>
                                                    <span>{item.sqf}</span>
                                                </li>

                                                <li className="flex items-center me-4">
                                                    <i className="mdi mdi-bed text-2xl me-2 text-green-600"></i>
                                                    <span>{item.beds}</span>
                                                </li>

                                                <li className="flex items-center">
                                                    <i className="mdi mdi-shower text-2xl me-2 text-green-600"></i>
                                                    <span>{item.baths}</span>
                                                </li>
                                            </ul>

                                            <ul className="pt-6 flex justify-between items-center list-none">
                                                <li>
                                                    <span className="text-slate-400">Price</span>
                                                    <p className="text-lg font-medium">
                                                        ${parseFloat(String(item.price || '0')).toLocaleString()}
                                                    </p>
                                                </li>

                                                <li>
                                                    <span className="text-slate-400">Layout</span>
                                                    <p className="text-lg font-medium text-green-600">
                                                        {item.layout || 'Not specified'}
                                                    </p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {properties.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No properties found matching your search criteria.</p>
                                </div>
                            )}

                            {pagination.pages > 1 && (
                                <div className="grid md:grid-cols-12 grid-cols-1 mt-6">
                                    <div className="md:col-span-12 text-center">
                                        <nav>
                                            <ul className="inline-flex items-center -space-x-px">
                                                <li>
                                                    <button
                                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                        disabled={pagination.currentPage === 1}
                                                        className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-xs shadow-gray-200 dark:shadow-gray-700 hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <i className="mdi mdi-chevron-left text-[20px]"></i>
                                                    </button>
                                                </li>
                                                {[...Array(pagination.pages)].map((_, i) => (
                                                    <li key={i}>
                                                        <button
                                                            onClick={() => handlePageChange(i + 1)}
                                                            className={`w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full ${
                                                                pagination.currentPage === i + 1
                                                                    ? 'text-white bg-green-600'
                                                                    : 'text-slate-400 hover:text-white bg-white dark:bg-slate-900 hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600'
                                                            } shadow-xs shadow-gray-200 dark:shadow-gray-700`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    </li>
                                                ))}
                                                <li>
                                                    <button
                                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                        disabled={pagination.currentPage === pagination.pages}
                                                        className="w-10 h-10 inline-flex justify-center items-center mx-1 rounded-full text-slate-400 bg-white dark:bg-slate-900 hover:text-white shadow-xs shadow-gray-200 dark:shadow-gray-700 hover:border-green-600 dark:hover:border-green-600 hover:bg-green-600 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <i className="mdi mdi-chevron-right text-[20px]"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Wrapper>
    );
} 