'use client'
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { propertyService } from "@/api";
import { Property, PropertyStatus, OwnershipType } from "@/types/property";
import { useTranslations } from 'next-intl';
import Wrapper from "@/app/[locale]/components/wrapper";

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
}

export default function EditProperty() {
    const params = useParams();
    const router = useRouter();
    const t = useTranslations('properties.details');
    const id = parseInt(String(params?.id || 0));
    const [property, setProperty] = useState<Property | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
                
                const headers: Record<string, string> = {};
                if (API_KEY) {
                    headers['X-API-Key'] = API_KEY;
                }
                
                const [propertyData, categoriesData] = await Promise.all([
                    propertyService.getPropertyById(id, 'en'),
                    fetch(`${API_BASE_URL}/categories`, { headers }).then(res => res.ok ? res.json() : [])
                ]);
                setProperty(propertyData);
                setCategories(categoriesData);
                setError(null);
            } catch (err) {
                setError('Failed to load property details. Please try again later.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!property) return;

        try {
            setSaving(true);
            const formData = new FormData(e.currentTarget);
            
            const updatedProperty = {
                name: formData.get('name') as string,
                categoryId: parseInt(formData.get('categoryId') as string),
                status: formData.get('status') as PropertyStatus,
                ownershipType: formData.get('ownershipType') as OwnershipType,
                description: formData.get('description') as string,
                city: formData.get('city') as string,
                street: formData.get('street') as string,
                country: formData.get('country') as string,

                latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
                longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
                virtualTour: formData.get('virtualTour') as string || null,
                videoUrl: formData.get('videoUrl') as string || null,
                size: parseFloat(formData.get('size') as string),
                beds: formData.get('beds') ? parseInt(formData.get('beds') as string) : 0,
                baths: formData.get('baths') ? parseInt(formData.get('baths') as string) : 0,
                layout: formData.get('layout') as string || null,
                price: parseFloat(formData.get('price') as string),
                priceHidden: formData.get('priceHidden') === 'on',
                discountedPrice: formData.get('discountedPrice') ? parseFloat(formData.get('discountedPrice') as string) : null,
                buildingStoriesNumber: formData.get('buildingStoriesNumber') ? parseInt(formData.get('buildingStoriesNumber') as string) : null,
                buildingCondition: formData.get('buildingCondition') as string || null,
                apartmentCondition: formData.get('apartmentCondition') as string || null,
                aboveGroundFloors: formData.get('aboveGroundFloors') ? parseInt(formData.get('aboveGroundFloors') as string) : null,
                reconstructionYearApartment: formData.get('reconstructionYearApartment') ? parseInt(formData.get('reconstructionYearApartment') as string) : null,
                reconstructionYearBuilding: formData.get('reconstructionYearBuilding') ? parseInt(formData.get('reconstructionYearBuilding') as string) : null,
                totalAboveGroundFloors: formData.get('totalAboveGroundFloors') ? parseInt(formData.get('totalAboveGroundFloors') as string) : null,
                totalUndergroundFloors: formData.get('totalUndergroundFloors') ? parseInt(formData.get('totalUndergroundFloors') as string) : null,
                floorArea: formData.get('floorArea') ? parseFloat(formData.get('floorArea') as string) : null,
                builtUpArea: formData.get('builtUpArea') ? parseFloat(formData.get('builtUpArea') as string) : null,
                gardenHouseArea: formData.get('gardenHouseArea') ? parseFloat(formData.get('gardenHouseArea') as string) : null,
                terraceArea: formData.get('terraceArea') ? parseFloat(formData.get('terraceArea') as string) : null,
                totalLandArea: formData.get('totalLandArea') ? parseFloat(formData.get('totalLandArea') as string) : null,
                gardenArea: formData.get('gardenArea') ? parseFloat(formData.get('gardenArea') as string) : null,
                garageArea: formData.get('garageArea') ? parseFloat(formData.get('garageArea') as string) : null,
                balconyArea: formData.get('balconyArea') ? parseFloat(formData.get('balconyArea') as string) : null,
                pergolaArea: formData.get('pergolaArea') ? parseFloat(formData.get('pergolaArea') as string) : null,
                basementArea: formData.get('basementArea') ? parseFloat(formData.get('basementArea') as string) : null,
                workshopArea: formData.get('workshopArea') ? parseFloat(formData.get('workshopArea') as string) : null,
                totalObjectArea: formData.get('totalObjectArea') ? parseFloat(formData.get('totalObjectArea') as string) : null,
                usableArea: formData.get('usableArea') ? parseFloat(formData.get('usableArea') as string) : null,
                landArea: formData.get('landArea') ? parseFloat(formData.get('landArea') as string) : null,
                objectType: formData.get('objectType') as string || null,
                objectLocationType: formData.get('objectLocationType') as string || null,
                houseEquipment: formData.get('houseEquipment') as string || null,
                accessRoad: formData.get('accessRoad') as string || null,
                objectCondition: formData.get('objectCondition') as string || null,
                reservationPrice: formData.get('reservationPrice') as string || null,
                equipmentDescription: formData.get('equipmentDescription') as string || null,
                additionalSources: formData.get('additionalSources') as string || null,
                buildingPermit: formData.get('buildingPermit') as string || null,
                buildability: formData.get('buildability') as string || null,
                utilitiesOnLand: formData.get('utilitiesOnLand') as string || null,
                utilitiesOnAdjacentRoad: formData.get('utilitiesOnAdjacentRoad') as string || null,
                payments: formData.get('payments') as string || null,
                brokerId: formData.get('brokerId') as string || null,
                secondaryAgent: formData.get('secondaryAgent') as string || null,
            };

            const updatedPropertyResponse = await propertyService.updateProperty(id, updatedProperty, 'en');
            console.log('Property updated successfully:', updatedPropertyResponse);
            router.push(`/property-detail/${id}`);
        } catch (err) {
            console.error('Error updating property:', err);
            if (err instanceof Error) {
                setError(`Failed to update property: ${err.message}`);
            } else {
                setError('Failed to update property. Please try again later.');
            }
        } finally {
            setSaving(false);
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

    return (
        <Wrapper>
            <div className="container-fluid relative px-3">
                <div className="layout-specing">
                    <div className="md:flex justify-between items-center mb-6">
                        <h5 className="text-lg font-semibold">Edit Property</h5>
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-md shadow-sm">
                        {/* Basic Information */}
                        <div className="mb-8">
                            <h6 className="text-lg font-semibold mb-4 border-b pb-2">Basic Information</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={property.name}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Category *</label>
                                    <select
                                        name="categoryId"
                                        defaultValue={property.categoryId}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                        required
                                    >
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Status *</label>
                                    <select
                                        name="status"
                                        defaultValue={property.status}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                        required
                                    >
                                        <option value={PropertyStatus.ACTIVE}>Active</option>
                                        <option value={PropertyStatus.SOLD}>Sold</option>
                                        <option value={PropertyStatus.RENT}>Rent</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Ownership Type *</label>
                                    <select
                                        name="ownershipType"
                                        defaultValue={property.ownershipType}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                        required
                                    >
                                        <option value={OwnershipType.OWNERSHIP}>Ownership</option>
                                        <option value={OwnershipType.RENT}>Rent</option>
                                    </select>
                                </div>



                                <div>
                                    <label className="block text-sm font-medium mb-2">Price *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        step="0.01"
                                        defaultValue={property.price}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Discounted Price</label>
                                    <input
                                        type="number"
                                        name="discountedPrice"
                                        step="0.01"
                                        defaultValue={property.discountedPrice || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Size (m²) *</label>
                                    <input
                                        type="number"
                                        name="size"
                                        step="0.01"
                                        defaultValue={property.size}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Beds</label>
                                    <input
                                        type="number"
                                        name="beds"
                                        defaultValue={property.beds || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Baths</label>
                                    <input
                                        type="number"
                                        name="baths"
                                        defaultValue={property.baths || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Layout</label>
                                    <input
                                        type="text"
                                        name="layout"
                                        defaultValue={property.layout || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="mb-8">
                            <h6 className="text-lg font-semibold mb-4 border-b pb-2">Location Information</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        defaultValue={property.country || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        defaultValue={property.city || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Street</label>
                                    <input
                                        type="text"
                                        name="street"
                                        defaultValue={property.street || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Latitude</label>
                                    <input
                                        type="number"
                                        name="latitude"
                                        step="0.000001"
                                        defaultValue={property.latitude || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Longitude</label>
                                    <input
                                        type="number"
                                        name="longitude"
                                        step="0.000001"
                                        defaultValue={property.longitude || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Building Information */}
                        <div className="mb-8">
                            <h6 className="text-lg font-semibold mb-4 border-b pb-2">Building Information</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Building Stories Number</label>
                                    <input
                                        type="number"
                                        name="buildingStoriesNumber"
                                        defaultValue={property.buildingStoriesNumber || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Building Condition</label>
                                    <input
                                        type="text"
                                        name="buildingCondition"
                                        defaultValue={property.buildingCondition || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Apartment Condition</label>
                                    <input
                                        type="text"
                                        name="apartmentCondition"
                                        defaultValue={property.apartmentCondition || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Above Ground Floors</label>
                                    <input
                                        type="number"
                                        name="aboveGroundFloors"
                                        defaultValue={property.aboveGroundFloors || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Reconstruction Year (Apartment)</label>
                                    <input
                                        type="number"
                                        name="reconstructionYearApartment"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        defaultValue={property.reconstructionYearApartment || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Reconstruction Year (Building)</label>
                                    <input
                                        type="number"
                                        name="reconstructionYearBuilding"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        defaultValue={property.reconstructionYearBuilding || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Total Above Ground Floors</label>
                                    <input
                                        type="number"
                                        name="totalAboveGroundFloors"
                                        defaultValue={property.totalAboveGroundFloors || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Total Underground Floors</label>
                                    <input
                                        type="number"
                                        name="totalUndergroundFloors"
                                        defaultValue={property.totalUndergroundFloors || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Area Information */}
                        <div className="mb-8">
                            <h6 className="text-lg font-semibold mb-4 border-b pb-2">Area Information (m²)</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Floor Area</label>
                                    <input
                                        type="number"
                                        name="floorArea"
                                        step="0.01"
                                        defaultValue={property.floorArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Built Up Area</label>
                                    <input
                                        type="number"
                                        name="builtUpArea"
                                        step="0.01"
                                        defaultValue={property.builtUpArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Garden House Area</label>
                                    <input
                                        type="number"
                                        name="gardenHouseArea"
                                        step="0.01"
                                        defaultValue={property.gardenHouseArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Terrace Area</label>
                                    <input
                                        type="number"
                                        name="terraceArea"
                                        step="0.01"
                                        defaultValue={property.terraceArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Total Land Area</label>
                                    <input
                                        type="number"
                                        name="totalLandArea"
                                        step="0.01"
                                        defaultValue={property.totalLandArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Garden Area</label>
                                    <input
                                        type="number"
                                        name="gardenArea"
                                        step="0.01"
                                        defaultValue={property.gardenArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Garage Area</label>
                                    <input
                                        type="number"
                                        name="garageArea"
                                        step="0.01"
                                        defaultValue={property.garageArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Balcony Area</label>
                                    <input
                                        type="number"
                                        name="balconyArea"
                                        step="0.01"
                                        defaultValue={property.balconyArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Pergola Area</label>
                                    <input
                                        type="number"
                                        name="pergolaArea"
                                        step="0.01"
                                        defaultValue={property.pergolaArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Basement Area</label>
                                    <input
                                        type="number"
                                        name="basementArea"
                                        step="0.01"
                                        defaultValue={property.basementArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Workshop Area</label>
                                    <input
                                        type="number"
                                        name="workshopArea"
                                        step="0.01"
                                        defaultValue={property.workshopArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Total Object Area</label>
                                    <input
                                        type="number"
                                        name="totalObjectArea"
                                        step="0.01"
                                        defaultValue={property.totalObjectArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Usable Area</label>
                                    <input
                                        type="number"
                                        name="usableArea"
                                        step="0.01"
                                        defaultValue={property.usableArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Land Area</label>
                                    <input
                                        type="number"
                                        name="landArea"
                                        step="0.01"
                                        defaultValue={property.landArea || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="mb-8">
                            <h6 className="text-lg font-semibold mb-4 border-b pb-2">Additional Information</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Object Type</label>
                                    <input
                                        type="text"
                                        name="objectType"
                                        defaultValue={property.objectType || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Object Location Type</label>
                                    <input
                                        type="text"
                                        name="objectLocationType"
                                        defaultValue={property.objectLocationType || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">House Equipment</label>
                                    <input
                                        type="text"
                                        name="houseEquipment"
                                        defaultValue={property.houseEquipment || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Access Road</label>
                                    <input
                                        type="text"
                                        name="accessRoad"
                                        defaultValue={property.accessRoad || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Object Condition</label>
                                    <input
                                        type="text"
                                        name="objectCondition"
                                        defaultValue={property.objectCondition || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Reservation Price</label>
                                    <input
                                        type="text"
                                        name="reservationPrice"
                                        defaultValue={property.reservationPrice || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Broker ID</label>
                                    <input
                                        type="text"
                                        name="brokerId"
                                        defaultValue={property.brokerId || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Secondary Agent</label>
                                    <input
                                        type="text"
                                        name="secondaryAgent"
                                        defaultValue={property.secondaryAgent || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media and URLs */}
                        <div className="mb-8">
                            <h6 className="text-lg font-semibold mb-4 border-b pb-2">Media and URLs</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Virtual Tour URL</label>
                                    <input
                                        type="url"
                                        name="virtualTour"
                                        defaultValue={property.virtualTour || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Video URL</label>
                                    <input
                                        type="url"
                                        name="videoUrl"
                                        defaultValue={property.videoUrl || ''}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Detailed Descriptions */}
                        <div className="mb-8">
                            <h6 className="text-lg font-semibold mb-4 border-b pb-2">Detailed Descriptions</h6>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        defaultValue={property.description || ''}
                                        rows={4}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Equipment Description</label>
                                    <textarea
                                        name="equipmentDescription"
                                        defaultValue={property.equipmentDescription || ''}
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Additional Sources</label>
                                    <textarea
                                        name="additionalSources"
                                        defaultValue={property.additionalSources || ''}
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Building Permit</label>
                                    <textarea
                                        name="buildingPermit"
                                        defaultValue={property.buildingPermit || ''}
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Buildability</label>
                                    <textarea
                                        name="buildability"
                                        defaultValue={property.buildability || ''}
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Utilities on Land</label>
                                    <textarea
                                        name="utilitiesOnLand"
                                        defaultValue={property.utilitiesOnLand || ''}
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Utilities on Adjacent Road</label>
                                    <textarea
                                        name="utilitiesOnAdjacentRoad"
                                        defaultValue={property.utilitiesOnAdjacentRoad || ''}
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Payments</label>
                                    <textarea
                                        name="payments"
                                        defaultValue={property.payments || ''}
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="mb-8">
                            <h6 className="text-lg font-semibold mb-4 border-b pb-2">Settings</h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="priceHidden"
                                        defaultChecked={property.priceHidden}
                                        className="mr-2"
                                    />
                                    <span>Hide price from public view</span>
                                </div>


                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Wrapper>
    );
} 