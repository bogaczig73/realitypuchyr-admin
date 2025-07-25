"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PropertyStatus, OwnershipType } from "@/types/property";

import Wrapper from "@/app/[locale]/components/wrapper";
import ImageUpload from "@/app/[locale]/components/imageUpload";
import FileUpload from "@/app/[locale]/components/FileUpload";

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
}

interface FormData {
    [key: string]: string | PropertyStatus | OwnershipType;
    name: string;
    categoryId: string;
    status: PropertyStatus;
    ownershipType: OwnershipType;
    description: string;
    city: string;
    street: string;
    country: string;
    latitude: string;
    longitude: string;
    virtualTour: string;
    videoUrl: string;
    size: string;
    beds: string;
    baths: string;
    price: string;
    discountedPrice: string;
    layout: string;
    buildingStoriesNumber: string;
    buildingCondition: string;
    apartmentCondition: string;
    aboveGroundFloors: string;
    reconstructionYearApartment: string;
    reconstructionYearBuilding: string;
    totalAboveGroundFloors: string;
    totalUndergroundFloors: string;
    floorArea: string;
    builtUpArea: string;
    gardenHouseArea: string;
    terraceArea: string;
    totalLandArea: string;
    gardenArea: string;
    garageArea: string;
    balconyArea: string;
    pergolaArea: string;
    basementArea: string;
    workshopArea: string;
    totalObjectArea: string;
    usableArea: string;
    landArea: string;
    objectType: string;
    objectLocationType: string;
    houseEquipment: string;
    accessRoad: string;
    objectCondition: string;
    reservationPrice: string;
    equipmentDescription: string;
    additionalSources: string;
    buildingPermit: string;
    buildability: string;
    utilitiesOnLand: string;
    utilitiesOnAdjacentRoad: string;
    payments: string;
    brokerId: string;
    secondaryAgent: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export default function AddProperty(){
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<FormData>({
        // Basic Information
        name: '',
        categoryId: '',
        status: PropertyStatus.ACTIVE,
        ownershipType: OwnershipType.OWNERSHIP,
        description: '',
        city: '',
        street: '',
        country: '',
        latitude: '',
        longitude: '',
        virtualTour: '',
        videoUrl: '',
        size: '',
        beds: '',
        baths: '',
        price: '',
        discountedPrice: '',
        layout: '',

        // Building Details
        buildingStoriesNumber: '',
        buildingCondition: '',
        apartmentCondition: '',
        aboveGroundFloors: '',
        reconstructionYearApartment: '',
        reconstructionYearBuilding: '',
        totalAboveGroundFloors: '',
        totalUndergroundFloors: '',

        // Areas and Spaces
        floorArea: '',
        builtUpArea: '',
        gardenHouseArea: '',
        terraceArea: '',
        totalLandArea: '',
        gardenArea: '',
        garageArea: '',
        balconyArea: '',
        pergolaArea: '',
        basementArea: '',
        workshopArea: '',
        totalObjectArea: '',
        usableArea: '',
        landArea: '',

        // Additional Information
        objectType: '',
        objectLocationType: '',
        houseEquipment: '',
        accessRoad: '',
        objectCondition: '',
        reservationPrice: '',
        equipmentDescription: '',
        additionalSources: '',
        buildingPermit: '',
        buildability: '',
        utilitiesOnLand: '',
        utilitiesOnAdjacentRoad: '',
        payments: '',

        // Agent Information
        brokerId: '',
        secondaryAgent: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        // Fetch categories when component mounts
        const fetchCategories = async () => {
            try {
                const headers: Record<string, string> = {};
                
                // Add API key if available
                if (API_KEY) {
                    headers['X-API-Key'] = API_KEY;
                }
                
                const response = await fetch(`${API_BASE_URL}/categories`, { headers });
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
                // Set default category if available
                if (data.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        categoryId: data[0].id.toString()
                    }));
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        // Validate year fields
        if (formData.reconstructionYearApartment) {
            const year = Number(formData.reconstructionYearApartment);
            if (year < 1800 || year > currentYear) {
                newErrors.reconstructionYearApartment = `Year must be between 1800 and ${currentYear}`;
            }
        }
        
        if (formData.reconstructionYearBuilding) {
            const year = Number(formData.reconstructionYearBuilding);
            if (year < 1800 || year > currentYear) {
                newErrors.reconstructionYearBuilding = `Year must be between 1800 and ${currentYear}`;
            }
        }

        // Validate numeric fields
        const numericFields = [
            'size', 'beds', 'baths', 'buildingStoriesNumber', 'aboveGroundFloors',
            'totalAboveGroundFloors', 'totalUndergroundFloors'
        ];

        numericFields.forEach(field => {
            if (formData[field] && Number(formData[field]) < 0) {
                newErrors[field] = 'Value cannot be negative';
            }
        });

        // Validate area fields
        const areaFields = [
            'floorArea', 'builtUpArea', 'gardenHouseArea', 'terraceArea',
            'totalLandArea', 'gardenArea', 'garageArea', 'balconyArea',
            'pergolaArea', 'basementArea', 'workshopArea', 'totalObjectArea',
            'usableArea', 'landArea'
        ];

        areaFields.forEach(field => {
            if (formData[field] && Number(formData[field]) < 0) {
                newErrors[field] = 'Area cannot be negative';
            }
        });

        // Validate price fields
        const priceFields = ['price', 'discountedPrice', 'reservationPrice'];
        priceFields.forEach(field => {
            if (formData[field] && Number(formData[field]) < 0) {
                newErrors[field] = 'Price cannot be negative';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Please fix the validation errors before submitting the form.');
            return;
        }
        
        try {
            setIsSubmitting(true);
            setSubmitError(null);
            
            // Convert form data to proper types
            const processedData: Record<string, any> = {};
            
            Object.entries(formData).forEach(([key, value]) => {
                // Skip empty strings and convert them to null
                if (value === '') {
                    processedData[key] = null;
                    return;
                }

                if (key === 'categoryId' || key === 'status' || key === 'ownershipType') {
                    processedData[key] = value.toUpperCase();
                } else if (['size', 'beds', 'baths', 'buildingStoriesNumber', 'aboveGroundFloors', 
                          'reconstructionYearApartment', 'reconstructionYearBuilding', 
                          'totalAboveGroundFloors', 'totalUndergroundFloors'].includes(key)) {
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                        processedData[key] = Math.floor(numValue);
                    } else {
                        processedData[key] = null;
                    }
                } else if (['price', 'discountedPrice', 'reservationPrice'].includes(key)) {
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                        processedData[key] = numValue;
                    } else {
                        processedData[key] = null;
                    }
                } else if (['floorArea', 'builtUpArea', 'gardenHouseArea', 'terraceArea', 
                          'totalLandArea', 'gardenArea', 'garageArea', 'balconyArea', 
                          'pergolaArea', 'basementArea', 'workshopArea', 'totalObjectArea', 
                          'usableArea', 'landArea'].includes(key)) {
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                        processedData[key] = numValue;
                    } else {
                        processedData[key] = null;
                    }
                } else {
                    processedData[key] = value;
                }
            });

            // Handle files separately
            const formDataToSend = new FormData();
            
            // Add the processed JSON data
            formDataToSend.append('data', JSON.stringify(processedData));

            // Get the image files from the ImageUpload component
            const imageInput = document.querySelector('input[name="images"]') as HTMLInputElement;
            if (imageInput && imageInput.files) {
                Array.from(imageInput.files).forEach((file, index) => {
                    formDataToSend.append('images', file);
                    formDataToSend.append('imageMainFlags', index === 0 ? 'true' : 'false');
                });
            }

            // Get the files from the FileUpload component
            const fileInput = document.querySelector('input[name="files"]') as HTMLInputElement;
            if (fileInput && fileInput.files) {
                Array.from(fileInput.files).forEach((file) => {
                    formDataToSend.append('files', file);
                });
            }

            // Log the data being sent
            console.log('Raw form data:', formData);
            console.log('Processed data before sending:', processedData);
            console.log('FormData contents:');
            formDataToSend.forEach((value, key) => {
                if (key === 'data') {
                    console.log('data field:', JSON.parse(value as string));
                } else {
                    console.log(`${key}:`, value);
                }
            });

            // Prepare headers
            const headers: Record<string, string> = {
                'Accept': 'application/json',
            };
            
            // Add API key if available
            if (API_KEY) {
                headers['X-API-Key'] = API_KEY;
            }

            // Send the request
            const response = await fetch(`${API_BASE_URL}/properties`, {
                method: 'POST',
                body: formDataToSend,
                headers,
            });

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    if (errorData.details) {
                        throw new Error(`Validation failed:\n${errorData.details.join('\n')}`);
                    } else if (errorData.error) {
                        throw new Error(errorData.error);
                    }
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Property created successfully:', result);
            setSubmitSuccess(true);
            
            // Reset form
            setFormData({
                name: '',
                categoryId: categories.length > 0 ? categories[0].id.toString() : '',
                status: PropertyStatus.ACTIVE,
                ownershipType: OwnershipType.OWNERSHIP,
                description: '',
                city: '',
                street: '',
                country: '',
                latitude: '',
                longitude: '',
                virtualTour: '',
                videoUrl: '',
                size: '',
                beds: '',
                baths: '',
                price: '',
                discountedPrice: '',
                layout: '',
                buildingStoriesNumber: '',
                buildingCondition: '',
                apartmentCondition: '',
                aboveGroundFloors: '',
                reconstructionYearApartment: '',
                reconstructionYearBuilding: '',
                totalAboveGroundFloors: '',
                totalUndergroundFloors: '',
                floorArea: '',
                builtUpArea: '',
                gardenHouseArea: '',
                terraceArea: '',
                totalLandArea: '',
                gardenArea: '',
                garageArea: '',
                balconyArea: '',
                pergolaArea: '',
                basementArea: '',
                workshopArea: '',
                totalObjectArea: '',
                usableArea: '',
                landArea: '',
                objectType: '',
                objectLocationType: '',
                houseEquipment: '',
                accessRoad: '',
                objectCondition: '',
                reservationPrice: '',
                equipmentDescription: '',
                additionalSources: '',
                buildingPermit: '',
                buildability: '',
                utilitiesOnLand: '',
                utilitiesOnAdjacentRoad: '',
                payments: '',
                brokerId: '',
                secondaryAgent: ''
            });
            setErrors({});
            
        } catch (error) {
            console.error('Error creating property:', error);
            setSubmitError(error instanceof Error ? error.message : 'An error occurred while creating the property');
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <Wrapper>
            <div className="container-fluid relative px-3">
                <div className="layout-specing">
                    <div className="md:flex justify-between items-center">
                        <h5 className="text-lg font-semibold">Add Property</h5>

                        <ul className="tracking-[0.5px] inline-block sm:mt-0 mt-3">
                            <li className="inline-block capitalize text-[16px] font-medium duration-500 dark:text-white/70 hover:text-green-600 dark:hover:text-white"><Link href="/">Hously</Link></li>
                            <li className="inline-block text-base text-slate-950 dark:text-white/70 mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                            <li className="inline-block capitalize text-[16px] font-medium text-green-600 dark:text-white" aria-current="page">Add Property</li>
                        </ul>
                    </div>

                    <div className="container relative">
                        <div className="grid grid-cols-1 gap-6 mt-6">
                            <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                                <ImageUpload/>
                            </div>

                            <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                                <FileUpload/>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information Section */}
                                <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                                    <h6 className="text-lg font-semibold mb-4 text-green-600">Basic Information</h6>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-12">
                                            <label htmlFor="name" className="font-medium">Title:</label>
                                            <input name="name" id="name" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" placeholder="Property Title" value={formData.name} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-4">
                                            <label htmlFor="categoryId" className="font-medium">Category:</label>
                                            <select 
                                                name="categoryId" 
                                                id="categoryId" 
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" 
                                                value={formData.categoryId} 
                                                onChange={handleInputChange}
                                            >
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-span-12 md:col-span-4">
                                            <label htmlFor="status" className="font-medium">Status:</label>
                                            <select name="status" id="status" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" value={formData.status} onChange={handleInputChange}>
                                                <option value="ACTIVE">Active</option>
                                                <option value="SOLD">Sold</option>
                                            </select>
                                        </div>

                                        <div className="col-span-12 md:col-span-4">
                                            <label htmlFor="ownershipType" className="font-medium">Ownership Type:</label>
                                            <select name="ownershipType" id="ownershipType" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" value={formData.ownershipType} onChange={handleInputChange}>
                                                <option value="OWNERSHIP">Ownership</option>
                                                <option value="RENT">Rent</option>
                                            </select>
                                        </div>

                                        <div className="col-span-12">
                                            <label htmlFor="description" className="font-medium">Description:</label>
                                            <textarea name="description" id="description" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" rows={4} placeholder="Property Description" value={formData.description} onChange={handleInputChange}></textarea>
                                        </div>

                                        <div className="col-span-12 md:col-span-4">
                                            <label htmlFor="virtualTour" className="font-medium">Virtual Tour:</label>
                                            <input
                                                name="virtualTour"
                                                id="virtualTour"
                                                type="text"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200"
                                                placeholder="Enter Matterport or other virtual tour iframe URL"
                                                value={formData.virtualTour}
                                                onChange={handleInputChange}
                                            />
                                            {formData.virtualTour && (
                                                <div className="mt-4 aspect-video">
                                                    <iframe
                                                        src={formData.virtualTour}
                                                        className="w-full h-full rounded-lg"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="videoUrl" className="font-medium">Video URL:</label>
                                            <input name="videoUrl" id="videoUrl" type="url" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" placeholder="Video URL" value={formData.videoUrl} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-4">
                                            <label htmlFor="size" className="font-medium">Size:</label>
                                            <input 
                                                name="size" 
                                                id="size" 
                                                type="number" 
                                                min="0"
                                                step="1"
                                                className={`form-input border ${errors.size ? '!border-red-500' : '!border-gray-200 dark:!border-gray-800'} mt-2`}
                                                placeholder="Size in m²" 
                                                value={formData.size} 
                                                onChange={handleInputChange}
                                            />
                                            {errors.size && (
                                                <p className="text-red-500 text-sm mt-1">{errors.size}</p>
                                            )}
                                        </div>

                                        <div className="col-span-12 md:col-span-4">
                                            <label htmlFor="beds" className="font-medium">Beds:</label>
                                            <input 
                                                name="beds" 
                                                id="beds" 
                                                type="number" 
                                                min="0"
                                                step="1"
                                                className={`form-input border ${errors.beds ? '!border-red-500' : '!border-gray-200 dark:!border-gray-800'} mt-2`}
                                                placeholder="Number of beds" 
                                                value={formData.beds} 
                                                onChange={handleInputChange}
                                            />
                                            {errors.beds && (
                                                <p className="text-red-500 text-sm mt-1">{errors.beds}</p>
                                            )}
                                        </div>

                                        <div className="col-span-12 md:col-span-4">
                                            <label htmlFor="baths" className="font-medium">Baths:</label>
                                            <input 
                                                name="baths" 
                                                id="baths" 
                                                type="number" 
                                                min="0"
                                                step="1"
                                                className={`form-input border ${errors.baths ? '!border-red-500' : '!border-gray-200 dark:!border-gray-800'} mt-2`}
                                                placeholder="Number of baths" 
                                                value={formData.baths} 
                                                onChange={handleInputChange}
                                            />
                                            {errors.baths && (
                                                <p className="text-red-500 text-sm mt-1">{errors.baths}</p>
                                            )}
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="price" className="font-medium">Price:</label>
                                            <input 
                                                name="price" 
                                                id="price" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className={`form-input border ${errors.price ? '!border-red-500' : '!border-gray-200 dark:!border-gray-800'} mt-2`}
                                                placeholder="Price" 
                                                value={formData.price} 
                                                onChange={handleInputChange}
                                            />
                                            {errors.price && (
                                                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                                            )}
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="discountedPrice" className="font-medium">Discounted Price:</label>
                                            <input 
                                                name="discountedPrice" 
                                                id="discountedPrice" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className={`form-input border ${errors.discountedPrice ? '!border-red-500' : '!border-gray-200 dark:!border-gray-800'} mt-2`}
                                                placeholder="Discounted Price" 
                                                value={formData.discountedPrice} 
                                                onChange={handleInputChange}
                                            />
                                            {errors.discountedPrice && (
                                                <p className="text-red-500 text-sm mt-1">{errors.discountedPrice}</p>
                                            )}
                                        </div>

                                        <div className="col-span-12 md:col-span-4">
                                            <label htmlFor="layout" className="font-medium">Layout:</label>
                                            <input name="layout" id="layout" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" placeholder="e.g., 2+1, 3+kk" value={formData.layout} onChange={handleInputChange}/>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Information Section */}
                                <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                                    <h6 className="text-lg font-semibold mb-4 text-green-600">Location Information</h6>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-12 md:col-span-4">
                                            <label htmlFor="city" className="font-medium">City:</label>
                                            <input name="city" id="city" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" placeholder="City" value={formData.city} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-4">
                                            <label htmlFor="street" className="font-medium">Street:</label>
                                            <input name="street" id="street" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" placeholder="Street" value={formData.street} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-4">
                                            <label htmlFor="country" className="font-medium">Country:</label>
                                            <input name="country" id="country" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" placeholder="Country" value={formData.country} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="latitude" className="font-medium">Latitude:</label>
                                            <input name="latitude" id="latitude" type="number" step="any" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" placeholder="Latitude" value={formData.latitude} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="longitude" className="font-medium">Longitude:</label>
                                            <input name="longitude" id="longitude" type="number" step="any" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2 focus:!border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-colors duration-200" placeholder="Longitude" value={formData.longitude} onChange={handleInputChange}/>
                                        </div>
                                    </div>
                                </div>

                                {/* Building Details Section */}
                                <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                                    <h6 className="text-lg font-semibold mb-4 text-green-600">Building Details</h6>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="buildingStoriesNumber" className="font-medium">Building Stories Number:</label>
                                            <input 
                                                name="buildingStoriesNumber" 
                                                id="buildingStoriesNumber" 
                                                type="number" 
                                                min="0"
                                                step="1"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Number of stories" 
                                                value={formData.buildingStoriesNumber} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="buildingCondition" className="font-medium">Building Condition:</label>
                                            <input name="buildingCondition" id="buildingCondition" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Building Condition" value={formData.buildingCondition} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="apartmentCondition" className="font-medium">Apartment Condition:</label>
                                            <input name="apartmentCondition" id="apartmentCondition" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Apartment Condition" value={formData.apartmentCondition} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="aboveGroundFloors" className="font-medium">Above Ground Floors:</label>
                                            <input 
                                                name="aboveGroundFloors" 
                                                id="aboveGroundFloors" 
                                                type="number" 
                                                min="0"
                                                step="1"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Number of above ground floors" 
                                                value={formData.aboveGroundFloors} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="reconstructionYearApartment" className="font-medium">Apartment Reconstruction Year:</label>
                                            <input 
                                                name="reconstructionYearApartment" 
                                                id="reconstructionYearApartment" 
                                                type="number" 
                                                min="1800"
                                                max={currentYear}
                                                step="1"
                                                className={`form-input border ${errors.reconstructionYearApartment ? '!border-red-500' : '!border-gray-200 dark:!border-gray-800'} mt-2`}
                                                placeholder="Year of reconstruction" 
                                                value={formData.reconstructionYearApartment} 
                                                onChange={handleInputChange}
                                            />
                                            {errors.reconstructionYearApartment && (
                                                <p className="text-red-500 text-sm mt-1">{errors.reconstructionYearApartment}</p>
                                            )}
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="reconstructionYearBuilding" className="font-medium">Building Reconstruction Year:</label>
                                            <input 
                                                name="reconstructionYearBuilding" 
                                                id="reconstructionYearBuilding" 
                                                type="number" 
                                                min="1800"
                                                max={currentYear}
                                                step="1"
                                                className={`form-input border ${errors.reconstructionYearBuilding ? '!border-red-500' : '!border-gray-200 dark:!border-gray-800'} mt-2`}
                                                placeholder="Year of reconstruction" 
                                                value={formData.reconstructionYearBuilding} 
                                                onChange={handleInputChange}
                                            />
                                            {errors.reconstructionYearBuilding && (
                                                <p className="text-red-500 text-sm mt-1">{errors.reconstructionYearBuilding}</p>
                                            )}
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="totalAboveGroundFloors" className="font-medium">Total Above Ground Floors:</label>
                                            <input 
                                                name="totalAboveGroundFloors" 
                                                id="totalAboveGroundFloors" 
                                                type="number" 
                                                min="0"
                                                step="1"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Total number of above ground floors" 
                                                value={formData.totalAboveGroundFloors} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="totalUndergroundFloors" className="font-medium">Total Underground Floors:</label>
                                            <input 
                                                name="totalUndergroundFloors" 
                                                id="totalUndergroundFloors" 
                                                type="number" 
                                                min="0"
                                                step="1"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Total number of underground floors" 
                                                value={formData.totalUndergroundFloors} 
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Areas and Spaces Section */}
                                <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                                    <h6 className="text-lg font-semibold mb-4 text-green-600">Areas and Spaces</h6>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="floorArea" className="font-medium">Floor Area:</label>
                                            <input 
                                                name="floorArea" 
                                                id="floorArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Floor area in m²" 
                                                value={formData.floorArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="builtUpArea" className="font-medium">Built Up Area:</label>
                                            <input 
                                                name="builtUpArea" 
                                                id="builtUpArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Built up area in m²" 
                                                value={formData.builtUpArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="gardenHouseArea" className="font-medium">Garden House Area:</label>
                                            <input 
                                                name="gardenHouseArea" 
                                                id="gardenHouseArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Garden house area in m²" 
                                                value={formData.gardenHouseArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="terraceArea" className="font-medium">Terrace Area:</label>
                                            <input 
                                                name="terraceArea" 
                                                id="terraceArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Terrace area in m²" 
                                                value={formData.terraceArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="totalLandArea" className="font-medium">Total Land Area:</label>
                                            <input 
                                                name="totalLandArea" 
                                                id="totalLandArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Total land area in m²" 
                                                value={formData.totalLandArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="gardenArea" className="font-medium">Garden Area:</label>
                                            <input 
                                                name="gardenArea" 
                                                id="gardenArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Garden area in m²" 
                                                value={formData.gardenArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="garageArea" className="font-medium">Garage Area:</label>
                                            <input 
                                                name="garageArea" 
                                                id="garageArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Garage area in m²" 
                                                value={formData.garageArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="balconyArea" className="font-medium">Balcony Area:</label>
                                            <input 
                                                name="balconyArea" 
                                                id="balconyArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Balcony area in m²" 
                                                value={formData.balconyArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="pergolaArea" className="font-medium">Pergola Area:</label>
                                            <input 
                                                name="pergolaArea" 
                                                id="pergolaArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Pergola area in m²" 
                                                value={formData.pergolaArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="basementArea" className="font-medium">Basement Area:</label>
                                            <input 
                                                name="basementArea" 
                                                id="basementArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Basement area in m²" 
                                                value={formData.basementArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="workshopArea" className="font-medium">Workshop Area:</label>
                                            <input 
                                                name="workshopArea" 
                                                id="workshopArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Workshop area in m²" 
                                                value={formData.workshopArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="totalObjectArea" className="font-medium">Total Object Area:</label>
                                            <input 
                                                name="totalObjectArea" 
                                                id="totalObjectArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Total object area in m²" 
                                                value={formData.totalObjectArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="usableArea" className="font-medium">Usable Area:</label>
                                            <input 
                                                name="usableArea" 
                                                id="usableArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Usable area in m²" 
                                                value={formData.usableArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="landArea" className="font-medium">Land Area:</label>
                                            <input 
                                                name="landArea" 
                                                id="landArea" 
                                                type="number" 
                                                min="0"
                                                step="0.01"
                                                className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" 
                                                placeholder="Land area in m²" 
                                                value={formData.landArea} 
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information Section */}
                                <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                                    <h6 className="text-lg font-semibold mb-4 text-green-600">Additional Information</h6>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="objectType" className="font-medium">Object Type:</label>
                                            <input name="objectType" id="objectType" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Object Type" value={formData.objectType} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="objectLocationType" className="font-medium">Object Location Type:</label>
                                            <input name="objectLocationType" id="objectLocationType" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Object Location Type" value={formData.objectLocationType} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="houseEquipment" className="font-medium">House Equipment:</label>
                                            <input name="houseEquipment" id="houseEquipment" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="House Equipment" value={formData.houseEquipment} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="accessRoad" className="font-medium">Access Road:</label>
                                            <input name="accessRoad" id="accessRoad" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Access Road" value={formData.accessRoad} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="objectCondition" className="font-medium">Object Condition:</label>
                                            <input name="objectCondition" id="objectCondition" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Object Condition" value={formData.objectCondition} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="reservationPrice" className="font-medium">Reservation Price:</label>
                                            <input name="reservationPrice" id="reservationPrice" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Reservation Price" value={formData.reservationPrice} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12">
                                            <label htmlFor="equipmentDescription" className="font-medium">Equipment Description:</label>
                                            <textarea name="equipmentDescription" id="equipmentDescription" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" rows={4} placeholder="Equipment Description" value={formData.equipmentDescription} onChange={handleInputChange}></textarea>
                                        </div>

                                        <div className="col-span-12">
                                            <label htmlFor="additionalSources" className="font-medium">Additional Sources:</label>
                                            <textarea name="additionalSources" id="additionalSources" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" rows={4} placeholder="Additional Sources" value={formData.additionalSources} onChange={handleInputChange}></textarea>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="buildingPermit" className="font-medium">Building Permit:</label>
                                            <input name="buildingPermit" id="buildingPermit" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Building Permit" value={formData.buildingPermit} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="buildability" className="font-medium">Buildability:</label>
                                            <input name="buildability" id="buildability" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Buildability" value={formData.buildability} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="utilitiesOnLand" className="font-medium">Utilities on Land:</label>
                                            <input name="utilitiesOnLand" id="utilitiesOnLand" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Utilities on Land" value={formData.utilitiesOnLand} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="utilitiesOnAdjacentRoad" className="font-medium">Utilities on Adjacent Road:</label>
                                            <input name="utilitiesOnAdjacentRoad" id="utilitiesOnAdjacentRoad" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Utilities on Adjacent Road" value={formData.utilitiesOnAdjacentRoad} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="payments" className="font-medium">Payments:</label>
                                            <input name="payments" id="payments" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Payments" value={formData.payments} onChange={handleInputChange}/>
                                        </div>
                                    </div>
                                </div>

                                {/* Agent Information Section */}
                                <div className="rounded-md shadow-sm shadow-gray-200 dark:shadow-gray-700 p-6 bg-white dark:bg-slate-900">
                                    <h6 className="text-lg font-semibold mb-4 text-green-600">Agent Information</h6>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="brokerId" className="font-medium">Broker ID:</label>
                                            <input name="brokerId" id="brokerId" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Broker ID" value={formData.brokerId} onChange={handleInputChange}/>
                                        </div>

                                        <div className="col-span-12 md:col-span-6">
                                            <label htmlFor="secondaryAgent" className="font-medium">Secondary Agent:</label>
                                            <input name="secondaryAgent" id="secondaryAgent" type="text" className="form-input border !border-gray-200 dark:!border-gray-800 mt-2" placeholder="Secondary Agent" value={formData.secondaryAgent} onChange={handleInputChange}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" className="btn bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-md">Add Property</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}