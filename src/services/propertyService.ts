import { Property, PropertyResponse } from '@/types/property';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const propertyService = {
    async getProperties(page: number = 1, limit: number = 12, search: string = ""): Promise<PropertyResponse> {
        try {
            const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
            const response = await fetch(`${API_BASE_URL}/properties?page=${page}&limit=${limit}${searchParam}`);
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }
            const data = await response.json();
            
            // Transform the response to match our PropertyResponse interface
            return {
                properties: data.properties.map((p: any) => ({
                    id: p.id,
                    image: p.image,
                    name: p.name,
                    sqf: p.sqf,
                    beds: p.beds,
                    baths: p.baths,
                    value: p.price,
                    rating: p.rating || 0,
                    createdAt: new Date(p.created_at),
                    updatedAt: new Date(p.updated_at)
                })),
                pagination: data.pagination
            };
        } catch (error) {
            console.error('Error in getProperties:', error);
            throw error;
        }
    },

    async getPropertyById(id: number): Promise<Property> {
        try {
            const response = await fetch(`${API_BASE_URL}/properties/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch property');
            }
            const property = await response.json();
            
            // Transform the response to match our Property interface
            return {
                id: property.id,
                image: property.image,
                name: property.name,
                sqf: property.sqf,
                beds: property.beds,
                baths: property.baths,
                value: property.price,
                rating: property.rating || 0,
                createdAt: new Date(property.created_at),
                updatedAt: new Date(property.updated_at)
            };
        } catch (error) {
            console.error('Error in getPropertyById:', error);
            throw error;
        }
    },

    async getTopProperties(limit: number = 5): Promise<Property[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/properties?limit=${limit}&sort=rating`);
            if (!response.ok) {
                throw new Error('Failed to fetch top properties');
            }
            const data = await response.json();
            
            // Transform the response to match our Property interface
            return data.properties.map((p: any) => ({
                id: p.id,
                image: p.image,
                name: p.name,
                sqf: p.sqf,
                beds: p.beds,
                baths: p.baths,
                value: p.price,
                rating: p.rating || 0,
                createdAt: new Date(p.created_at),
                updatedAt: new Date(p.updated_at)
            }));
        } catch (error) {
            console.error('Error in getTopProperties:', error);
            throw error;
        }
    }
}; 