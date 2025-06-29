/**
 * Property Service
 * Repository pattern implementation for property-related API operations
 */

import { Property, PropertyResponse, PropertyStats, CategoryStats, TranslationRequest, TranslationResponse } from '@/types/property';
import { BaseService } from './base';
import { API_ENDPOINTS } from '../endpoints';
import { transformProperty } from '../transformers';

export class PropertyService extends BaseService {
    /**
     * Get paginated properties with search and filtering
     */
    async getProperties(
        page: number = 1, 
        limit: number = 12, 
        search: string = "", 
        locale: string = 'cs',
        status?: 'ACTIVE' | 'SOLD' | 'RENT',
        categoryId?: number
    ): Promise<PropertyResponse> {
        const params: Record<string, any> = { page, limit };
        
        if (search) params.search = search;
        if (status) params.status = status;
        if (categoryId) params.categoryId = categoryId;

        return this.get<PropertyResponse>(API_ENDPOINTS.properties.list(locale), params);
    }

    /**
     * Get property by ID
     */
    async getPropertyById(id: number, locale: string = 'en'): Promise<Property> {
        const data = await this.get<any>(API_ENDPOINTS.properties.detail(locale, id));
        return transformProperty(data);
    }

    /**
     * Create a new property
     */
    async createProperty(data: FormData, locale: string = 'en'): Promise<Property> {
        const response = await this.upload<any>(API_ENDPOINTS.properties.create(locale), data);
        return transformProperty(response);
    }

    /**
     * Update an existing property
     */
    async updateProperty(id: number, data: Partial<Property>, locale: string = 'en'): Promise<Property> {
        const response = await this.put<any>(API_ENDPOINTS.properties.update(locale, id), data);
        return transformProperty(response);
    }

    /**
     * Delete a property
     */
    async deleteProperty(id: number, locale: string = 'en'): Promise<void> {
        await this.delete(API_ENDPOINTS.properties.delete(locale, id));
    }

    /**
     * Update property status
     */
    async updatePropertyState(id: number, status: 'ACTIVE' | 'SOLD' | 'RENT', locale: string = 'en'): Promise<Property> {
        const response = await this.patch<any>(API_ENDPOINTS.properties.updateState(locale, id), { status });
        return transformProperty(response);
    }

    /**
     * Get top properties by rating
     */
    async getTopProperties(limit: number = 5, locale: string = 'en'): Promise<Property[]> {
        const response = await this.get<any>(API_ENDPOINTS.properties.top(locale, limit));
        return response.properties.map(transformProperty);
    }

    /**
     * Get property statistics
     */
    async getPropertyStats(): Promise<PropertyStats> {
        return this.get<PropertyStats>(API_ENDPOINTS.properties.stats());
    }

    /**
     * Get category statistics
     */
    async getCategoryStats(): Promise<CategoryStats[]> {
        return this.get<CategoryStats[]>(API_ENDPOINTS.properties.categoryStats());
    }

    /**
     * Get properties with video tours
     */
    async getVideoTours(): Promise<Property[]> {
        const response = await this.get<any>(API_ENDPOINTS.properties.videoTours());
        return response.properties.map(transformProperty);
    }

    /**
     * Create external property (simplified version)
     */
    async createExternalProperty(data: any): Promise<Property> {
        const response = await this.post<any>(API_ENDPOINTS.properties.createExternal(), data);
        return transformProperty(response);
    }

    /**
     * Sync property files from S3
     */
    async syncPropertyFiles(id: number): Promise<Property> {
        const response = await this.put<any>(API_ENDPOINTS.properties.sync(id));
        return transformProperty(response);
    }

    /**
     * Translate property to target language
     */
    async translateProperty(id: number, data: TranslationRequest): Promise<TranslationResponse> {
        return this.post<TranslationResponse>(API_ENDPOINTS.properties.translate(id), data);
    }
}

// Export singleton instance
export const propertyService = new PropertyService(); 