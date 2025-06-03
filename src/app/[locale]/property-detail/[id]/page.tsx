'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Wrapper from "@/components/wrapper";
import { useParams, useRouter } from "next/navigation";
import { propertyApi, Property } from "@/services/api";
import { useTranslations } from 'next-intl';

export default function PropertyDetail() {
    const params = useParams();
    const router = useRouter();
    const t = useTranslations('properties.details');
    const id = parseInt(String(params?.id || 0));
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const data = await propertyApi.getById(id);
                console.log('Property data:', data);
                setProperty(data);
                // Set the first image as selected by default
                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0].url);
                }
                setError(null);
            } catch (err) {
                setError('Failed to load property details. Please try again later.');
                console.error('Error fetching property:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id]);

    const handleEdit = () => {
        router.push(`/property-detail/${id}/edit`);
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await propertyApi.delete(id);
            router.push('/properties');
        } catch (err) {
            console.error('Error deleting property:', err);
            setError('Failed to delete property. Please try again later.');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <Wrapper>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </Wrapper>
        );
    }

    if (error || !property) {
        return (
            <Wrapper>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-red-500">{error || 'Property not found'}</div>
                </div>
            </Wrapper>
        );
    }

    const formatValue = (value: any) => {
        if (value === null || value === undefined || value === '') {
            return <span className="text-gray-400 italic">-</span>;
        }
        if (typeof value === 'object' && value !== null) {
            if ('name' in value && 'slug' in value && 'image' in value) {
                return <span>{String(value.name)}</span>;
            }
            return <span className="text-gray-400 italic">-</span>;
        }
        return <span>{String(value)}</span>;
    };

    const getGoogleMapsUrl = () => {
        if (property.latitude && property.longitude) {
            return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d${property.longitude}!3d${property.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${property.latitude}%2C${property.longitude}!5e0!3m2!1sen!2s!4v1`;
        }
        return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39206.002432144705!2d-95.4973981212445!3d29.709510002925988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c16de81f3ca5%3A0xf43e0b60ae539ac9!2sGerald+D.+Hines+Waterwall+Park!5e0!3m2!1sen!2sin!4v1566305861440!5m2!1sen!2sin';
    };

    return (
        <Wrapper>
            <div className="container-fluid relative px-3">
                <div className="layout-specing">
                    <div className="md:flex justify-between items-center">
                        <h5 className="text-lg font-semibold">{t('title')}</h5>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                            >
                                Edit Property
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Delete Property
                            </button>
                        </div>

                        <ul className="tracking-[0.5px] inline-block sm:mt-0 mt-3">
                            <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600 dark:hover:text-white">
                                <Link href="/">Hously</Link>
                            </li>
                            <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180">
                                <i className="mdi mdi-chevron-right"></i>
                            </li>
                            <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">
                                {t('title')}
                            </li>
                        </ul>
                    </div>

                    <div className="mt-6">
                        {/* Main Image */}
                        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                            <Image 
                                src={selectedImage || '/placeholder-image.jpg'} 
                                alt={property.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-lg"
                            />
                        </div>

                        {/* Thumbnail Grid */}
                        {property.images && property.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                {property.images.map((image, index) => (
                                    <div 
                                        key={image.id} 
                                        className={`relative h-24 rounded-lg overflow-hidden cursor-pointer ${
                                            selectedImage === image.url ? 'ring-2 ring-green-600' : ''
                                        }`}
                                        onClick={() => setSelectedImage(image.url)}
                                    >
                                        <Image 
                                            src={image.url} 
                                            alt={`${property.name} - Image ${index + 1}`}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-lg"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-12 md:grid-cols-2 gap-6 mt-6">
                        <div className="lg:col-span-8">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                <h4 className="text-2xl font-medium">{property.name}</h4>

                                {/* Description Section */}
                                {property.description ? (
                                    <div className="mt-4">
                                        <h5 className="text-lg font-semibold mb-2 text-green-600">{t('description')}</h5>
                                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{property.description}</p>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <h5 className="text-lg font-semibold mb-2 text-green-600">{t('description')}</h5>
                                        <p className="text-gray-400 italic">{t('noDescription')}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    {/* Basic Information */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('basicInfo')}</h5>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.category')}:</span>
                                                <span className="text-right">{formatValue(property.category)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.status')}:</span>
                                                <span className="text-right">{formatValue(property.status)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.ownershipType')}:</span>
                                                <span className="text-right">{formatValue(property.ownershipType)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.size')}:</span>
                                                <span className="text-right">{formatValue(property.size)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.beds')}:</span>
                                                <span className="text-right">{formatValue(property.beds)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.baths')}:</span>
                                                <span className="text-right">{formatValue(property.baths)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.price')}:</span>
                                                <span className="text-right">${formatValue(property.price)}</span>
                                            </li>
                                            {property.discountedPrice && (
                                                <li className="flex justify-between items-center">
                                                    <span className="font-medium">{t('fields.discountedPrice')}:</span>
                                                    <span className="text-right">${formatValue(property.discountedPrice)}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Location Information */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('location')}</h5>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.city')}:</span>
                                                <span className="text-right">{formatValue(property.city)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.street')}:</span>
                                                <span className="text-right">{formatValue(property.street)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.country')}:</span>
                                                <span className="text-right">{formatValue(property.country)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.latitude')}:</span>
                                                <span className="text-right">{formatValue(property.latitude)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.longitude')}:</span>
                                                <span className="text-right">{formatValue(property.longitude)}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Building Details */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('buildingDetails')}</h5>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.buildingStoriesNumber')}:</span>
                                                <span className="text-right">{formatValue(property.buildingStoriesNumber)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.buildingCondition')}:</span>
                                                <span className="text-right">{formatValue(property.buildingCondition)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.apartmentCondition')}:</span>
                                                <span className="text-right">{formatValue(property.apartmentCondition)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.aboveGroundFloors')}:</span>
                                                <span className="text-right">{formatValue(property.aboveGroundFloors)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.totalAboveGroundFloors')}:</span>
                                                <span className="text-right">{formatValue(property.totalAboveGroundFloors)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.totalUndergroundFloors')}:</span>
                                                <span className="text-right">{formatValue(property.totalUndergroundFloors)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.reconstructionYearApartment')}:</span>
                                                <span className="text-right">{formatValue(property.reconstructionYearApartment)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.reconstructionYearBuilding')}:</span>
                                                <span className="text-right">{formatValue(property.reconstructionYearBuilding)}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Areas and Spaces */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('areasAndSpaces')}</h5>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.floorArea')}:</span>
                                                <span className="text-right">{formatValue(property.floorArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.builtUpArea')}:</span>
                                                <span className="text-right">{formatValue(property.builtUpArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.gardenHouseArea')}:</span>
                                                <span className="text-right">{formatValue(property.gardenHouseArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.terraceArea')}:</span>
                                                <span className="text-right">{formatValue(property.terraceArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.totalLandArea')}:</span>
                                                <span className="text-right">{formatValue(property.totalLandArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.gardenArea')}:</span>
                                                <span className="text-right">{formatValue(property.gardenArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.garageArea')}:</span>
                                                <span className="text-right">{formatValue(property.garageArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.balconyArea')}:</span>
                                                <span className="text-right">{formatValue(property.balconyArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.pergolaArea')}:</span>
                                                <span className="text-right">{formatValue(property.pergolaArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.basementArea')}:</span>
                                                <span className="text-right">{formatValue(property.basementArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.workshopArea')}:</span>
                                                <span className="text-right">{formatValue(property.workshopArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.totalObjectArea')}:</span>
                                                <span className="text-right">{formatValue(property.totalObjectArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.usableArea')}:</span>
                                                <span className="text-right">{formatValue(property.usableArea)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.landArea')}:</span>
                                                <span className="text-right">{formatValue(property.landArea)}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Additional Information */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('additionalInfo')}</h5>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.objectType')}:</span>
                                                <span className="text-right">{formatValue(property.objectType)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.objectLocationType')}:</span>
                                                <span className="text-right">{formatValue(property.objectLocationType)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.houseEquipment')}:</span>
                                                <span className="text-right">{formatValue(property.houseEquipment)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.accessRoad')}:</span>
                                                <span className="text-right">{formatValue(property.accessRoad)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.objectCondition')}:</span>
                                                <span className="text-right">{formatValue(property.objectCondition)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.reservationPrice')}:</span>
                                                <span className="text-right">{formatValue(property.reservationPrice)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.buildingPermit')}:</span>
                                                <span className="text-right">{formatValue(property.buildingPermit)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.buildability')}:</span>
                                                <span className="text-right">{formatValue(property.buildability)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.utilitiesOnLand')}:</span>
                                                <span className="text-right">{formatValue(property.utilitiesOnLand)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.utilitiesOnAdjacentRoad')}:</span>
                                                <span className="text-right">{formatValue(property.utilitiesOnAdjacentRoad)}</span>
                                            </li>
                                            <li className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.payments')}:</span>
                                                <span className="text-right">{formatValue(property.payments)}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Equipment Description */}
                                    {property.equipmentDescription ? (
                                        <div className="md:col-span-2">
                                            <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.equipmentDescription')}</h5>
                                            <p className="text-gray-600 dark:text-gray-300">{property.equipmentDescription}</p>
                                        </div>
                                    ) : (
                                        <div className="md:col-span-2">
                                            <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.equipmentDescription')}</h5>
                                            <p className="text-gray-400 italic">{t('noEquipmentDescription')}</p>
                                        </div>
                                    )}

                                    {/* Additional Sources */}
                                    {property.additionalSources ? (
                                        <div className="md:col-span-2">
                                            <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.additionalSources')}</h5>
                                            <p className="text-gray-600 dark:text-gray-300">{property.additionalSources}</p>
                                        </div>
                                    ) : (
                                        <div className="md:col-span-2">
                                            <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.additionalSources')}</h5>
                                            <p className="text-gray-400 italic">{t('noAdditionalSources')}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Map */}
                                <div className="w-full leading-[0] border-0 mt-6">
                                    <iframe 
                                        src={getGoogleMapsUrl()}
                                        style={{border:"0"}} 
                                        title="property-location" 
                                        className="w-full h-[500px]" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="rounded-md bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                <div className="p-6">
                                    <h5 className="text-2xl font-medium">{t('fields.price')}:</h5>

                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xl font-medium">
                                            {t('fields.priceWithCurrency', { price: parseFloat(property.price.toString()).toLocaleString() })}
                                        </span>

                                        <span className="bg-green-600/10 text-green-600 text-sm px-2.5 py-0.75 rounded h-6">
                                            {property.status}
                                        </span>
                                    </div>

                                    <ul className="list-none mt-4">
                                        <li className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm">{t('fields.rating')}</span>
                                            <span className="font-medium text-sm">
                                                {t('fields.ratingWithCount', { 
                                                    rating: Number(property.rating).toFixed(1),
                                                    count: property.reviewCount 
                                                })}
                                            </span>
                                        </li>

                                        <li className="flex justify-between items-center mt-2">
                                            <span className="text-slate-400 text-sm">{t('fields.listedOn')}</span>
                                            <span className="font-medium text-sm">
                                                {new Date(property.createdAt).toLocaleDateString()}
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex">
                                    <div className="p-1 w-1/2">
                                        <Link href="" className="btn bg-green-600 hover:bg-green-700 text-white rounded-md w-full">
                                            {t('actions.bookNow')}
                                        </Link>
                                    </div>
                                    <div className="p-1 w-1/2">
                                        <Link href="" className="btn bg-green-600 hover:bg-green-700 text-white rounded-md w-full">
                                            {t('actions.offerNow')}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 text-center">
                                <h3 className="mb-6 text-xl leading-normal font-medium text-black dark:text-white">
                                    {t('actions.haveQuestion')}
                                </h3>

                                <div className="mt-6">
                                    <Link 
                                        href="/contact" 
                                        className="btn bg-transparent hover:bg-green-600 border border-green-600 text-green-600 hover:text-white rounded-md"
                                    >
                                        <i className="mdi mdi-phone align-middle me-2"></i> {t('actions.contactUs')}
                                    </Link>
                                </div>
                            </div>

                            {/* Attached Documents */}
                            <div className="mt-6 rounded-md bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                <div className="p-6">
                                    <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.attachedDocuments')}</h5>
                                    
                                    {(() => {
                                        try {
                                            const files = typeof property.files === 'string' 
                                                ? JSON.parse(property.files) 
                                                : property.files;
                                            
                                            if (Array.isArray(files) && files.length > 0) {
                                                return (
                                                    <ul className="space-y-3">
                                                        {files.map((file: { id: string; name: string; url: string }) => (
                                                            <li key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                                                                <div className="flex items-center">
                                                                    <i className="mdi mdi-file-document text-green-600 text-xl mr-3"></i>
                                                                    <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                                                                </div>
                                                                <a 
                                                                    href={file.url} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-green-600 hover:text-green-700"
                                                                >
                                                                    <i className="mdi mdi-download text-xl"></i>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                );
                                            }
                                        } catch (error) {
                                            console.error('Error parsing files:', error);
                                        }
                                        return <p className="text-gray-400 italic">{t('noDocumentsAttached')}</p>;
                                    })()}
                                </div>
                            </div>

                            {/* Virtual Tour */}
                            {property.virtualTour && (
                                <div className="mt-6 rounded-md bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                    <div className="p-6">
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.virtualTour')}</h5>
                                        <div className="aspect-video w-full rounded-lg overflow-hidden">
                                            <iframe
                                                src={property.virtualTour}
                                                className="w-full h-full"
                                                allowFullScreen
                                                title="Virtual Tour"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Video */}
                            {property.videoUrl && (
                                <div className="mt-6 rounded-md bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                    <div className="p-6">
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.video')}</h5>
                                        <div className="aspect-video w-full rounded-lg overflow-hidden">
                                            <iframe
                                                src={property.videoUrl}
                                                className="w-full h-full"
                                                allowFullScreen
                                                title="Property Video"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete this property? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Wrapper>
    );
}