import { Property, PropertyResponse } from '@/types/property';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import { transformProperty } from '../transformers';
import { handleApiError, ApiError } from '../errors';
import { api } from '../api';

export const propertyService = {
    async getProperties(page: number = 1, limit: number = 12, search: string = "", locale: string = 'cs'): Promise<PropertyResponse> {
        try {
            const response = await api.get(API_ENDPOINTS.properties.list(locale), {
                params: { page, limit, search }
            });
            return response.data;
        } catch (error) {
            return handleApiError(error, 'Failed to fetch properties');
        }
    },

    async getPropertyById(id: number, locale: string = 'en'): Promise<Property> {
        try {
            const response = await api.get(API_ENDPOINTS.properties.detail(locale, id));
            return transformProperty(response.data);
        } catch (error) {
            return handleApiError(error, 'Failed to fetch property details');
        }
    },

    async createProperty(data: FormData, locale: string = 'en'): Promise<Property> {
        try {
            const response = await api.post(API_ENDPOINTS.properties.create(locale), data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return transformProperty(response.data);
        } catch (error) {
            return handleApiError(error, 'Failed to create property');
        }
    },

    async updateProperty(id: number, data: Partial<Property>, locale: string = 'en'): Promise<Property> {
        try {
            const response = await api.put(API_ENDPOINTS.properties.update(locale, id), data);
            return transformProperty(response.data);
        } catch (error) {
            return handleApiError(error, 'Failed to update property');
        }
    },

    async deleteProperty(id: number, locale: string = 'en'): Promise<void> {
        try {
            await api.delete(API_ENDPOINTS.properties.delete(locale, id));
        } catch (error) {
            return handleApiError(error, 'Failed to delete property');
        }
    },

    async updatePropertyState(id: number, status: 'ACTIVE' | 'SOLD', locale: string = 'en'): Promise<Property> {
        try {
            const response = await api.patch(API_ENDPOINTS.properties.updateState(locale, id), { status });
            return transformProperty(response.data);
        } catch (error) {
            return handleApiError(error, 'Failed to update property status');
        }
    },

    async getTopProperties(limit: number = 5, locale: string = 'en'): Promise<Property[]> {
        try {
            const response = await api.get(API_ENDPOINTS.properties.top(locale, limit));
            return response.data.properties.map(transformProperty);
        } catch (error) {
            return handleApiError(error, 'Failed to fetch top properties');
        }
    }
}; 