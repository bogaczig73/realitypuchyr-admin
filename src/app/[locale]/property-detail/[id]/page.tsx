'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Wrapper from "@/app/[locale]/components/wrapper";
import { useParams, useRouter } from "next/navigation";
import { propertyService } from "@/api/services/property";
import { Property } from "@/types/property";
import { useTranslations } from 'next-intl';
import { ApiError } from "@/api/errors";
import { FiEdit, FiTrash2, FiGlobe, FiEye, FiX } from "react-icons/fi";

const SUPPORTED_LANGUAGES = [
    { code: 'cs', name: 'Czech', flag: '🇨🇿' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
    { code: 'vn', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' }
];

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
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string>('');
    const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
    
    // Photo gallery states
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [visiblePhotos, setVisiblePhotos] = useState<number>(4);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    
    // Translation states
    const [translating, setTranslating] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
    const [currentViewLanguage, setCurrentViewLanguage] = useState<string>('');
    const [currentPropertyData, setCurrentPropertyData] = useState<Property | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                // Use global locale for initial property fetch
                const data = await propertyService.getPropertyById(id, params.locale as string);
                setProperty(data);
                setCurrentPropertyData(data);
                setCurrentViewLanguage(params.locale as string);
                // Set the first image as selected by default
                if (data.images && data.images.length > 0) {
                    setSelectedImage(data.images[0].url);
                }
                setError(null);
                
                // Fetch available languages for this property using global locale
                if (data.id) {
                    try {
                        const languagesResponse = await propertyService.getPropertyLanguages(data.id);
                        setAvailableLanguages(languagesResponse.availableLanguages);
                        setCurrentViewLanguage(languagesResponse.originalLanguage);
                    } catch (langError) {
                        console.error('Error fetching property languages:', langError);
                        // Fallback to just the current locale if languages endpoint fails
                        setAvailableLanguages([params.locale as string]);
                    }
                }
            } catch (err) {
                const errorMessage = err instanceof ApiError 
                    ? err.message 
                    : 'Failed to load property details. Please try again later.';
                setError(errorMessage);
                console.error('Error fetching property:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id, params.locale]);

    const handleEdit = () => {
        router.push(`/property-detail/${id}/edit`);
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await propertyService.deleteProperty(id, params.locale as string);
            router.push('/properties');
        } catch (err) {
            const errorMessage = err instanceof ApiError 
                ? err.message 
                : 'Failed to delete property. Please try again later.';
            setError(errorMessage);
            console.error('Error deleting property:', err);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleStatusToggle = async () => {
        if (!property) return;
        
        try {
            setIsUpdating(true);
            setError(null);
            const newStatus = property.status === 'ACTIVE' ? 'SOLD' : 'ACTIVE';
            const updatedProperty = await propertyService.updatePropertyState(id, newStatus, params.locale as string);
            setProperty(updatedProperty);
            setCurrentPropertyData(updatedProperty);
        } catch (err) {
            const errorMessage = err instanceof ApiError 
                ? err.message 
                : 'Failed to update property status. Please try again later.';
            setError(errorMessage);
            console.error('Error updating property status:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const buildYouTubeEmbedUrl = (url: string): string => {
        // Extract video ID and any additional parameters
        let videoId = '';
        let params = '';

        if (url.includes('youtu.be/')) {
            const parts = url.split('youtu.be/')[1].split('?');
            videoId = parts[0];
            if (parts[1]) {
                params = '?' + parts[1];
            }
        } else if (url.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            videoId = urlParams.get('v') || '';
            urlParams.delete('v');
            if (urlParams.toString()) {
                params = '?' + urlParams.toString();
            }
        } else if (url.includes('youtube.com/embed/')) {
            return url; // Already in embed format
        }

        return `https://www.youtube.com/embed/${videoId}${params}`;
    };

    const handleVideoClick = (e: React.MouseEvent, videoUrl: string | null) => {
        e.preventDefault();
        e.stopPropagation();
        if (!videoUrl) return;
        const embedUrl = buildYouTubeEmbedUrl(videoUrl);
        setSelectedVideo(embedUrl);
        setIsVideoModalOpen(true);
    };

    // Photo gallery handlers
    const handlePhotoClick = (index: number) => {
        setCurrentPhotoIndex(index);
        setIsPhotoModalOpen(true);
    };

    const handlePreviousPhoto = () => {
        if (!property?.images) return;
        setCurrentPhotoIndex((prev) => 
            prev === 0 ? property.images.length - 1 : prev - 1
        );
    };

    const handleNextPhoto = () => {
        if (!property?.images) return;
        setCurrentPhotoIndex((prev) => 
            prev === property.images.length - 1 ? 0 : prev + 1
        );
    };

    const loadMorePhotos = () => {
        if (!property?.images) return;
        setVisiblePhotos(prev => Math.min(prev + 4, property.images.length));
    };

    // Translation handlers
    const handleTranslate = async () => {
        if (!property || !selectedLanguage) return;
        
        try {
            setTranslating(selectedLanguage);
            
            // Get the original language for this property
            let originalLanguage = params.locale as string;
            try {
                const languagesResponse = await propertyService.getPropertyLanguages(property.id);
                originalLanguage = languagesResponse.originalLanguage;
            } catch (langError) {
                console.error('Error fetching property languages for translation:', langError);
                // Fallback to current locale if languages endpoint fails
            }
            
            // Log the translation API call details
            const translationData = {
                targetLanguage: selectedLanguage,
                sourceLanguage: originalLanguage
            };
            console.log('Translation API Call:', {
                endpoint: `/properties/${property.id}/translate`,
                method: 'POST',
                data: translationData,
                propertyId: property.id,
                originalLanguage: originalLanguage
            });
            
            // Use global locale for translation operations
            await propertyService.translateProperty(property.id, translationData);
            
            // Refresh the property data to get updated translations
            // Use global locale for refreshing the original property
            const updatedProperty = await propertyService.getPropertyById(id, params.locale as string);
            setProperty(updatedProperty);
            setCurrentPropertyData(updatedProperty);
            
            // Refresh available languages using global locale
            try {
                const languagesResponse = await propertyService.getPropertyLanguages(property.id);
                setAvailableLanguages(languagesResponse.availableLanguages);
            } catch (langError) {
                console.error('Error refreshing property languages:', langError);
            }
            
            // Reset selection and show success message
            setSelectedLanguage('');
            console.log('Translation successful');
        } catch (err) {
            console.error('Translation error:', err);
            console.error('Translation failed');
        } finally {
            setTranslating(null);
        }
    };

    const getMissingLanguages = () => {
        const available = availableLanguages;
        return SUPPORTED_LANGUAGES.filter(lang => !available.includes(lang.code));
    };

    const getLanguageName = (code: string) => {
        const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
        return lang?.name || code.toUpperCase();
    };

    const fetchPropertyByLanguage = async (language: string) => {
        if (!property) return;
        
        try {
            setLoading(true);
            // Use the selected language as the locale for API call to get translated content
            // This allows viewing content in different languages regardless of global locale
            const data = await propertyService.getPropertyById(property.id, language);
            setCurrentPropertyData(data);
            setCurrentViewLanguage(language);
        } catch (err) {
            console.error('Error fetching property in language:', language, err);
            // Fallback to original property data
            setCurrentPropertyData(property);
            setCurrentViewLanguage(params.locale as string);
        } finally {
            setLoading(false);
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

    const missingLanguages = getMissingLanguages();
    const currentProperty = currentPropertyData || property;

    return (
        <Wrapper>
            <div className="container-fluid relative px-3">
                <div className="layout-specing">
                    <div className="md:flex justify-between items-center">
                        <h5 className="text-lg font-semibold">{t('title')}</h5>

                        <ul className="tracking-[0.5px] inline-block sm:mt-0 mt-3">
                            <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600 dark:hover:text-white">
                                <Link href="/">Home</Link>
                            </li>
                            <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180">
                                <i className="mdi mdi-chevron-right"></i>
                            </li>
                            <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">
                                {t('title')}
                            </li>
                        </ul>
                    </div>

                    <div className="grid lg:grid-cols-12 md:grid-cols-2 gap-6 mt-6">
                        <div className="lg:col-span-8">
                            {/* Photo Gallery Section */}
                            <div className="bg-white dark:bg-slate-900 rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xl font-semibold">Photo Gallery</h4>
                                    {property.images && property.images.length > 0 && (
                                        <button
                                            onClick={() => setShowAllPhotos(!showAllPhotos)}
                                            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                                        >
                                            <FiEye className="h-4 w-4" />
                                            {showAllPhotos ? 'Show Less' : `View All (${property.images.length})`}
                                        </button>
                                    )}
                                </div>

                                {/* Main Image */}
                                <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-4">
                                    <Image 
                                        src={selectedImage || '/images/placeholder.webp'} 
                                        alt={currentProperty.name}
                                        fill
                                        unoptimized
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-lg cursor-pointer"
                                        onClick={() => {
                                            if (property.images && property.images.length > 0) {
                                                const index = property.images.findIndex(img => img.url === selectedImage);
                                                handlePhotoClick(index >= 0 ? index : 0);
                                            }
                                        }}
                                    />
                                </div>

                                {/* Photo Preview Grid */}
                                {property.images && property.images.length > 0 && (
                                    <div className="space-y-4">
                                        {/* Preview Thumbnails */}
                                        <div className="grid grid-cols-4 gap-4">
                                            {property.images.slice(0, showAllPhotos ? property.images.length : 4).map((image, index) => (
                                                <div 
                                                    key={image.id} 
                                                    className={`relative h-24 rounded-lg overflow-hidden cursor-pointer transition-all ${
                                                        selectedImage === image.url ? 'ring-2 ring-green-600 scale-105' : 'hover:scale-105'
                                                    }`}
                                                    onClick={() => setSelectedImage(image.url)}
                                                >
                                                    <Image 
                                                        src={image.url} 
                                                        alt={`${currentProperty.name} - Image ${index + 1}`}
                                                        fill
                                                        unoptimized
                                                        style={{ objectFit: 'cover' }}
                                                        className="rounded-lg"
                                                    />
                                                    {index === 3 && !showAllPhotos && property.images.length > 4 && (
                                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                            <span className="text-white font-semibold text-sm">
                                                                +{property.images.length - 4}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Load More Button */}
                                        {!showAllPhotos && property.images.length > 4 && (
                                            <div className="text-center">
                                                <button
                                                    onClick={() => setShowAllPhotos(true)}
                                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                                >
                                                    Load All Photos ({property.images.length})
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(!property.images || property.images.length === 0) && (
                                    <div className="text-center py-8 text-gray-500">
                                        No photos available for this property
                                    </div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                <h4 className="text-2xl font-medium">{currentProperty.name}</h4>

                                {/* Description Section */}
                                {currentProperty.description ? (
                                    <div className="mt-4">
                                        <h5 className="text-lg font-semibold mb-2 text-green-600">{t('description')}</h5>
                                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{currentProperty.description}</p>
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
                                            <li key="category" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.category')}:</span>
                                                <span className="text-right">{formatValue(property.category)}</span>
                                            </li>
                                            <li key="status" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.status')}:</span>
                                                <span className="text-right">{formatValue(property.status)}</span>
                                            </li>
                                            <li key="ownershipType" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.ownershipType')}:</span>
                                                <span className="text-right">{formatValue(property.ownershipType)}</span>
                                            </li>
                                            <li key="size" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.size')}:</span>
                                                <span className="text-right">{formatValue(property.size)}</span>
                                            </li>
                                            <li key="beds" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.beds')}:</span>
                                                <span className="text-right">{formatValue(property.beds)}</span>
                                            </li>
                                            <li key="baths" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.baths')}:</span>
                                                <span className="text-right">{formatValue(property.baths)}</span>
                                            </li>
                                            <li key="price" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.price')}:</span>
                                                <span className="text-right">{formatValue(property.price)} Kč</span>
                                            </li>
                                            {property.discountedPrice && (
                                                <li key="discountedPrice" className="flex justify-between items-center">
                                                    <span className="font-medium">{t('fields.discountedPrice')}:</span>
                                                    <span className="text-right">{formatValue(property.discountedPrice)} Kč</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Location Information */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('location')}</h5>
                                        <ul className="space-y-2">
                                            <li key="city" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.city')}:</span>
                                                <span className="text-right">{formatValue(property.city)}</span>
                                            </li>
                                            <li key="street" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.street')}:</span>
                                                <span className="text-right">{formatValue(property.street)}</span>
                                            </li>
                                            <li key="country" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.country')}:</span>
                                                <span className="text-right">{formatValue(property.country)}</span>
                                            </li>
                                            <li key="latitude" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.latitude')}:</span>
                                                <span className="text-right">{formatValue(property.latitude)}</span>
                                            </li>
                                            <li key="longitude" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.longitude')}:</span>
                                                <span className="text-right">{formatValue(property.longitude)}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Building Details */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('buildingDetails')}</h5>
                                        <ul className="space-y-2">
                                            <li key="buildingStoriesNumber" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.buildingStoriesNumber')}:</span>
                                                <span className="text-right">{formatValue(property.buildingStoriesNumber)}</span>
                                            </li>
                                            <li key="buildingCondition" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.buildingCondition')}:</span>
                                                <span className="text-right">{formatValue(property.buildingCondition)}</span>
                                            </li>
                                            <li key="apartmentCondition" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.apartmentCondition')}:</span>
                                                <span className="text-right">{formatValue(property.apartmentCondition)}</span>
                                            </li>
                                            <li key="aboveGroundFloors" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.aboveGroundFloors')}:</span>
                                                <span className="text-right">{formatValue(property.aboveGroundFloors)}</span>
                                            </li>
                                            <li key="totalAboveGroundFloors" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.totalAboveGroundFloors')}:</span>
                                                <span className="text-right">{formatValue(property.totalAboveGroundFloors)}</span>
                                            </li>
                                            <li key="totalUndergroundFloors" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.totalUndergroundFloors')}:</span>
                                                <span className="text-right">{formatValue(property.totalUndergroundFloors)}</span>
                                            </li>
                                            <li key="reconstructionYearApartment" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.reconstructionYearApartment')}:</span>
                                                <span className="text-right">{formatValue(property.reconstructionYearApartment)}</span>
                                            </li>
                                            <li key="reconstructionYearBuilding" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.reconstructionYearBuilding')}:</span>
                                                <span className="text-right">{formatValue(property.reconstructionYearBuilding)}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Areas and Spaces */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('areasAndSpaces')}</h5>
                                        <ul className="space-y-2">
                                            <li key="floorArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.floorArea')}:</span>
                                                <span className="text-right">{formatValue(property.floorArea)}</span>
                                            </li>
                                            <li key="builtUpArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.builtUpArea')}:</span>
                                                <span className="text-right">{formatValue(property.builtUpArea)}</span>
                                            </li>
                                            <li key="gardenHouseArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.gardenHouseArea')}:</span>
                                                <span className="text-right">{formatValue(property.gardenHouseArea)}</span>
                                            </li>
                                            <li key="terraceArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.terraceArea')}:</span>
                                                <span className="text-right">{formatValue(property.terraceArea)}</span>
                                            </li>
                                            <li key="totalLandArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.totalLandArea')}:</span>
                                                <span className="text-right">{formatValue(property.totalLandArea)}</span>
                                            </li>
                                            <li key="gardenArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.gardenArea')}:</span>
                                                <span className="text-right">{formatValue(property.gardenArea)}</span>
                                            </li>
                                            <li key="garageArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.garageArea')}:</span>
                                                <span className="text-right">{formatValue(property.garageArea)}</span>
                                            </li>
                                            <li key="balconyArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.balconyArea')}:</span>
                                                <span className="text-right">{formatValue(property.balconyArea)}</span>
                                            </li>
                                            <li key="pergolaArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.pergolaArea')}:</span>
                                                <span className="text-right">{formatValue(property.pergolaArea)}</span>
                                            </li>
                                            <li key="basementArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.basementArea')}:</span>
                                                <span className="text-right">{formatValue(property.basementArea)}</span>
                                            </li>
                                            <li key="workshopArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.workshopArea')}:</span>
                                                <span className="text-right">{formatValue(property.workshopArea)}</span>
                                            </li>
                                            <li key="totalObjectArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.totalObjectArea')}:</span>
                                                <span className="text-right">{formatValue(property.totalObjectArea)}</span>
                                            </li>
                                            <li key="usableArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.usableArea')}:</span>
                                                <span className="text-right">{formatValue(property.usableArea)}</span>
                                            </li>
                                            <li key="landArea" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.landArea')}:</span>
                                                <span className="text-right">{formatValue(property.landArea)}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Additional Information */}
                                    <div>
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('additionalInfo')}</h5>
                                        <ul className="space-y-2">
                                            <li key="objectType" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.objectType')}:</span>
                                                <span className="text-right">{formatValue(currentProperty.objectType)}</span>
                                            </li>
                                            <li key="objectLocationType" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.objectLocationType')}:</span>
                                                <span className="text-right">{formatValue(currentProperty.objectLocationType)}</span>
                                            </li>
                                            <li key="houseEquipment" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.houseEquipment')}:</span>
                                                <span className="text-right">{formatValue(currentProperty.houseEquipment)}</span>
                                            </li>
                                            <li key="accessRoad" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.accessRoad')}:</span>
                                                <span className="text-right">{formatValue(currentProperty.accessRoad)}</span>
                                            </li>
                                            <li key="objectCondition" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.objectCondition')}:</span>
                                                <span className="text-right">{formatValue(currentProperty.objectCondition)}</span>
                                            </li>
                                            <li key="reservationPrice" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.reservationPrice')}:</span>
                                                <span className="text-right">{formatValue(currentProperty.reservationPrice)}</span>
                                            </li>
                                            <li key="buildingPermit" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.buildingPermit')}:</span>
                                                <span className="text-right">{formatValue(currentProperty.buildingPermit)}</span>
                                            </li>
                                            <li key="buildability" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.buildability')}:</span>
                                                <span className="text-right">{formatValue(currentProperty.buildability)}</span>
                                            </li>
                                            <li key="utilitiesOnLand" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.utilitiesOnLand')}:</span>
                                                <span className="text-right">{formatValue(currentProperty.utilitiesOnLand)}</span>
                                            </li>
                                            <li key="utilitiesOnAdjacentRoad" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.utilitiesOnAdjacentRoad')}:</span>
                                                <span className="text-right">{formatValue(currentProperty.utilitiesOnAdjacentRoad)}</span>
                                            </li>
                                            <li key="payments" className="flex justify-between items-center">
                                                <span className="font-medium">{t('fields.payments')}:</span>
                                                <span className="text-right">{formatValue(currentProperty.payments)}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Equipment Description */}
                                    {currentProperty.equipmentDescription ? (
                                        <div className="md:col-span-2">
                                            <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.equipmentDescription')}</h5>
                                            <p className="text-gray-600 dark:text-gray-300">{currentProperty.equipmentDescription}</p>
                                        </div>
                                    ) : (
                                        <div className="md:col-span-2">
                                            <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.equipmentDescription')}</h5>
                                            <p className="text-gray-400 italic">{t('noEquipmentDescription')}</p>
                                        </div>
                                    )}

                                    {/* Additional Sources */}
                                    {currentProperty.additionalSources ? (
                                        <div className="md:col-span-2">
                                            <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.additionalSources')}</h5>
                                            <p className="text-gray-600 dark:text-gray-300">{currentProperty.additionalSources}</p>
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
                            {/* Control Panel */}
                            <div className="bg-white dark:bg-slate-900 rounded-md p-6 shadow-sm shadow-gray-200 dark:shadow-gray-700 mb-6">
                                <h5 className="font-medium text-lg mb-4">Control Panel</h5>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleEdit}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] bg-green-500 hover:bg-green-600 text-white border border-green-500 hover:border-green-600"
                                    >
                                        <FiEdit className="h-4 w-4" />
                                        <span>Edit Property</span>
                                    </button>
                                    <button
                                        onClick={handleStatusToggle}
                                        disabled={isUpdating}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] ${
                                            property.status === 'ACTIVE' 
                                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white border border-yellow-500 hover:border-yellow-600' 
                                                : 'bg-green-500 hover:bg-green-600 text-white border border-green-500 hover:border-green-600'
                                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            <>
                                                {property.status === 'ACTIVE' ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>Mark as Sold</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                        <span>Mark as Active</span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] bg-red-500 hover:bg-red-600 text-white border border-red-500 hover:border-red-600"
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        <FiTrash2 className="h-4 w-4" />
                                        <span>Delete Property</span>
                                    </button>
                                </div>
                            </div>

                            {/* Translation Section */}
                            <div className="bg-white dark:bg-slate-900 rounded-md p-6 shadow-sm shadow-gray-200 dark:shadow-gray-700 mb-6">
                                <h5 className="font-medium text-lg mb-4 flex items-center gap-2">
                                    <FiGlobe className="h-5 w-5" />
                                    Translations
                                </h5>
                                
                                {/* Available Languages */}
                                {availableLanguages.length > 0 && (
                                    <div className="mb-6">
                                        <h6 className="font-medium text-sm mb-3 text-gray-600 dark:text-gray-400">Available Languages</h6>
                                        <div className="flex flex-wrap gap-2">
                                            {availableLanguages.map(langCode => {
                                                const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
                                                const isCurrentLanguage = langCode === currentViewLanguage;
                                                const isOriginalLanguage = langCode === (params.locale as string);
                                                
                                                return (
                                                    <button
                                                        key={langCode}
                                                        onClick={() => fetchPropertyByLanguage(langCode)}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:scale-105 ${
                                                            isCurrentLanguage
                                                                ? 'bg-green-600 text-white border border-green-600 shadow-md' 
                                                                : isOriginalLanguage
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800' 
                                                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        <span className="text-lg">{lang?.flag || '🌐'}</span>
                                                        <span>{lang?.name || getLanguageName(langCode)}</span>
                                                        {isCurrentLanguage && (
                                                            <span className="text-xs">(current)</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Translation Interface */}
                                {missingLanguages.length > 0 && (
                                    <div>
                                        <h6 className="font-medium text-sm mb-3 text-gray-600 dark:text-gray-400">Missing Languages</h6>
                                        
                                        {/* Language Selection */}
                                        <div className="mb-4">
                                            <div className="grid grid-cols-3 gap-2">
                                                {missingLanguages.map(lang => (
                                                    <label 
                                                        key={lang.code}
                                                        className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:border-green-300 dark:hover:border-green-600 ${
                                                            selectedLanguage === lang.code 
                                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                                                                : 'border-gray-200 dark:border-gray-700'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="targetLanguage"
                                                            value={lang.code}
                                                            checked={selectedLanguage === lang.code}
                                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                                            className="sr-only"
                                                        />
                                                        <div className="text-center">
                                                            <div className="text-2xl mb-1">{lang.flag}</div>
                                                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                {lang.name}
                                                            </div>
                                                        </div>
                                                        {selectedLanguage === lang.code && (
                                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Translate Button */}
                                        <button
                                            onClick={handleTranslate}
                                            disabled={!selectedLanguage || translating !== null}
                                            className={`w-full btn flex items-center justify-center gap-2 transition-all duration-200 ${
                                                selectedLanguage 
                                                    ? 'btn-primary bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                                                    : 'btn-outline-primary opacity-50 cursor-not-allowed'
                                            }`}
                                        >
                                            {translating ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                    Translating...
                                                </>
                                            ) : (
                                                <>
                                                    <FiGlobe className="h-4 w-4" />
                                                    {selectedLanguage 
                                                        ? `Translate to ${getLanguageName(selectedLanguage)}`
                                                        : 'Translate'
                                                    }
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {availableLanguages.length === 0 && missingLanguages.length === 0 && (
                                    <p className="text-sm text-gray-500">No translations available</p>
                                )}
                            </div>

                            <div className="rounded-md bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                <div className="p-6">
                                    <h5 className="text-2xl font-medium">{t('fields.price')}:</h5>

                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xl font-medium">
                                            {currentProperty.priceHidden ? (
                                                <span className="italic text-gray-400">{t('fields.priceHidden') || 'Price hidden'}</span>
                                            ) : (
                                                t('fields.priceWithCurrency', { price: parseFloat(currentProperty.price.toString()).toLocaleString() })
                                            )}
                                        </span>

                                        <span className="bg-green-600/10 text-green-600 text-sm px-2.5 py-0.75 rounded h-6">
                                            {currentProperty.status}
                                        </span>
                                    </div>

                                    <ul className="list-none mt-4">
                                        <li className="flex justify-between items-center mt-2">
                                            <span className="text-slate-400 text-sm">{t('fields.listedOn')}</span>
                                            <span className="font-medium text-sm">
                                                {new Date(currentProperty.createdAt).toLocaleDateString()}
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                            </div>


                            {/* Attached Documents */}
                            <div className="mt-6 rounded-md bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                <div className="p-6">
                                    <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.attachedDocuments')}</h5>
                                    
                                    {(() => {
                                        try {
                                            const files = typeof currentProperty.files === 'string' 
                                                ? JSON.parse(currentProperty.files) 
                                                : currentProperty.files;
                                            
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
                            {currentProperty.virtualTour && (
                                <div className="mt-6 rounded-md bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                    <div className="p-6">
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.virtualTour')}</h5>
                                        <div className="aspect-video w-full rounded-lg overflow-hidden">
                                            <iframe
                                                src={currentProperty.virtualTour}
                                                className="w-full h-full"
                                                allowFullScreen
                                                title="Virtual Tour"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Floorplans */}
                            {currentProperty.floorplans && currentProperty.floorplans.length > 0 && (
                                <div className="mt-6 rounded-md bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                    <div className="p-6">
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('fields.floorplans')}</h5>
                                        <div className="space-y-4">
                                            {currentProperty.floorplans.map((floorplan) => (
                                                <div key={floorplan.id} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                                                    <h6 className="font-medium mb-2">{floorplan.name}</h6>
                                                    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                                                        <Image
                                                            src={floorplan.url}
                                                            alt={floorplan.name}
                                                            fill
                                                            unoptimized
                                                            style={{ objectFit: 'contain' }}
                                                            className="rounded-lg"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Video Section */}
                            {currentProperty.videoUrl && (
                                <div className="mt-6 rounded-md bg-white dark:bg-slate-900 shadow-sm shadow-gray-200 dark:shadow-gray-700">
                                    <div className="p-6">
                                        <h5 className="text-lg font-semibold mb-4 text-green-600">{t('videoTour')}</h5>
                                        <div className="aspect-video w-full rounded-lg overflow-hidden">
                                            <iframe
                                                src={buildYouTubeEmbedUrl(currentProperty.videoUrl)}
                                                className="w-full h-full"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Video Modal */}
                            {isVideoModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                                    <div className="relative w-full max-w-4xl mx-4">
                                        <button
                                            onClick={() => setIsVideoModalOpen(false)}
                                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="aspect-video">
                                            <iframe
                                                src={selectedVideo}
                                                className="w-full h-full rounded-lg"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Modal */}
            {isPhotoModalOpen && property?.images && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
                    <div className="relative w-full max-w-6xl mx-4">
                        <button
                            onClick={() => setIsPhotoModalOpen(false)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
                        >
                            <FiX className="w-8 h-8" />
                        </button>
                        
                        {/* Main Photo */}
                        <div className="relative w-full h-[80vh] rounded-lg overflow-hidden">
                            <Image
                                src={property.images[currentPhotoIndex].url}
                                alt={`${currentProperty.name} - Photo ${currentPhotoIndex + 1}`}
                                fill
                                unoptimized
                                style={{ objectFit: 'contain' }}
                                className="rounded-lg"
                            />
                        </div>
                        
                        {/* Navigation Buttons */}
                        <button
                            onClick={handlePreviousPhoto}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <button
                            onClick={handleNextPhoto}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        
                        {/* Photo Counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                            {currentPhotoIndex + 1} / {property.images.length}
                        </div>
                        
                        {/* Thumbnail Strip */}
                        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto">
                            {property.images.map((image, index) => (
                                <div
                                    key={image.id}
                                    className={`relative w-16 h-12 rounded-lg overflow-hidden cursor-pointer transition-all ${
                                        index === currentPhotoIndex ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                                    }`}
                                    onClick={() => setCurrentPhotoIndex(index)}
                                >
                                    <Image
                                        src={image.url}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        unoptimized
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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