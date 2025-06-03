'use client'
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { propertyApi, Property } from "@/services/api";
import { useTranslations } from 'next-intl';
import Wrapper from "@/components/wrapper";

export default function EditProperty() {
    const params = useParams();
    const router = useRouter();
    const t = useTranslations('properties.details');
    const id = parseInt(String(params?.id || 0));
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const data = await propertyApi.getById(id);
                setProperty(data);
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!property) return;

        try {
            setSaving(true);
            const formData = new FormData(e.currentTarget);
            const updatedProperty = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: parseFloat(formData.get('price') as string),
                city: formData.get('city') as string,
                street: formData.get('street') as string,
                country: formData.get('country') as string,
                size: formData.get('size') as string,
                beds: formData.get('beds') as string,
                baths: formData.get('baths') as string,
                // Add other fields as needed
            };

            await propertyApi.update(id, updatedProperty);
            router.push(`/property-detail/${id}`);
        } catch (err) {
            console.error('Error updating property:', err);
            setError('Failed to update property. Please try again later.');
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={property.name}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    defaultValue={property.price}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    defaultValue={property.city}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Street</label>
                                <input
                                    type="text"
                                    name="street"
                                    defaultValue={property.street}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    defaultValue={property.country}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Size</label>
                                <input
                                    type="text"
                                    name="size"
                                    defaultValue={property.size}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Beds</label>
                                <input
                                    type="text"
                                    name="beds"
                                    defaultValue={property.beds}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Baths</label>
                                <input
                                    type="text"
                                    name="baths"
                                    defaultValue={property.baths}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={property.description}
                                    rows={4}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                                    required
                                />
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