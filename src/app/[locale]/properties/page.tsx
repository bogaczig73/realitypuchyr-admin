'use client'
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Wrapper from "@/app/[locale]/components/wrapper";
import { Property, Pagination, PropertyStatus } from "@/types/property";
import { propertyService } from "@/api/services/property";
import { useSearchParams, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ApiError } from "@/api/errors";

export default function ExploreProperty() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <ExplorePropertyContent />
        </Suspense>
    );
}

function ExplorePropertyContent() {
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
    const [propertyIdFilter, setPropertyIdFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<PropertyStatus | "">("");
    const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({});
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    const params = useParams();
    const searchParams = useSearchParams();
    const t = useTranslations('properties');
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';

    const fetchProperties = async (page: number, search: string = "") => {
        try {
            setLoading(true);
            setError(null);
            const response = await propertyService.getProperties(page, 12, search);
            setProperties(response.properties);
            setPagination(response.pagination);
        } catch (err) {
            const errorMessage = err instanceof ApiError 
                ? err.message 
                : 'Failed to load properties. Please try again later.';
            setError(errorMessage);
            console.error('Error fetching properties:', err);
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

    // Filter properties based on current filters
    const filteredProperties = properties.filter(property => {
        const matchesSearch = searchQuery === "" || 
            property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.street?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesPropertyId = propertyIdFilter === "" || 
            property.id.toString().includes(propertyIdFilter);
        
        const matchesStatus = statusFilter === "" || 
            property.status === statusFilter;
        
        return matchesSearch && matchesPropertyId && matchesStatus;
    });

    const clearFilters = () => {
        setSearchQuery("");
        setPropertyIdFilter("");
        setStatusFilter("");
    };

    const hasActiveFilters = searchQuery || propertyIdFilter || statusFilter;

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

                    {/* Search and Filter Form */}
                    <form onSubmit={handleSearch} className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search properties, city, street..."
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                            <input
                                type="text"
                                value={propertyIdFilter}
                                onChange={(e) => setPropertyIdFilter(e.target.value)}
                                placeholder="Property ID"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | "")}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                            >
                                <option value="">All Status</option>
                                <option value={PropertyStatus.ACTIVE}>Active</option>
                                <option value={PropertyStatus.SOLD}>Sold</option>
                                <option value={PropertyStatus.RENT}>Rent</option>
                            </select>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                                >
                                    {t('search')}
                                </button>
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* View Toggle */}
                    <div className="mt-6 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
                            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <i className="mdi mdi-view-grid mr-1"></i>
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <i className="mdi mdi-format-list-bulleted mr-1"></i>
                                    List
                                </button>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredProperties.length} of {pagination.total} properties
                            {hasActiveFilters && (
                                <span className="ml-2 text-green-600">(filtered)</span>
                            )}
                        </div>
                    </div>

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
                            {viewMode === 'grid' ? (
                                <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-6">
                                    {filteredProperties.map((item) => (
                                        <div className="group rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl dark:hover:shadow-xl shadow-gray-200 dark:shadow-gray-700 dark:hover:shadow-gray-700 overflow-hidden ease-in-out duration-500" key={item.id}>
                                            <div className="relative">
                                                {imageLoading[item.id] !== false && (
                                                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                                                )}
                                                <Image 
                                                    src={item.images[0]?.url || '/images/placeholder.webp'} 
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
                                                        <span>{item.size} m²</span>
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
                                                            {parseFloat(String(item.price || '0')).toLocaleString()} Kč
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
                            ) : (
                                <div className="mt-6">
                                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Property
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Address
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            City
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Price
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Broker ID
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
                                                    {filteredProperties.map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-12 w-12">
                                                                        <Link href={`/${params.locale}/property-detail/${item.id}`}>
                                                                            <Image 
                                                                                src={item.images[0]?.url || '/images/placeholder.webp'} 
                                                                                width={48} 
                                                                                height={48} 
                                                                                alt={item.name}
                                                                                className="h-12 w-12 rounded-lg object-cover hover:opacity-80 transition-opacity cursor-pointer"
                                                                            />
                                                                        </Link>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <Link 
                                                                            href={`/${params.locale}/property-detail/${item.id}`}
                                                                            className="text-sm font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer"
                                                                        >
                                                                            {item.name}
                                                                        </Link>
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                            ID: {item.id}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900 dark:text-white">
                                                                    {item.street || 'N/A'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900 dark:text-white">
                                                                    {item.city || 'N/A'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    item.status === 'ACTIVE' 
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                        : item.status === 'SOLD'
                                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                                }`}>
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {parseFloat(String(item.price || '0')).toLocaleString()} Kč
                                                                </div>
                                                                {item.discountedPrice && (
                                                                    <div className="text-sm text-gray-500 line-through">
                                                                        {parseFloat(String(item.price || '0')).toLocaleString()} Kč
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900 dark:text-white">
                                                                    {item.brokerId || 'N/A'}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <Link 
                                                                    href={`/${params.locale}/property-detail/${item.id}`}
                                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                                                                >
                                                                    View
                                                                </Link>
                                                                <Link 
                                                                    href={`/${params.locale}/property-detail/${item.id}/edit`}
                                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                                >
                                                                    Edit
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {filteredProperties.length === 0 && !loading && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">
                                        {hasActiveFilters 
                                            ? "No properties found matching your filters. Try adjusting your search criteria."
                                            : "No properties found."
                                        }
                                    </p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            Clear All Filters
                                        </button>
                                    )}
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