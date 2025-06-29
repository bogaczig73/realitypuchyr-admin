/**
 * Base Service Class
 * Repository pattern implementation for consistent API service structure
 */

import { apiClient, ApiClientError } from '../client';
import { handleApiError, ApiError } from '../errors';
import { API_ENDPOINTS } from '../endpoints';

export abstract class BaseService {
    protected client = apiClient;

    /**
     * Execute a GET request
     */
    protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        try {
            const response = await this.client.get<T>(endpoint, params);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Failed to fetch data from ${endpoint}`);
        }
    }

    /**
     * Execute a POST request
     */
    protected async post<T>(endpoint: string, data?: any): Promise<T> {
        try {
            const response = await this.client.post<T>(endpoint, data);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Failed to create data at ${endpoint}`);
        }
    }

    /**
     * Execute a PUT request
     */
    protected async put<T>(endpoint: string, data?: any): Promise<T> {
        try {
            const response = await this.client.put<T>(endpoint, data);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Failed to update data at ${endpoint}`);
        }
    }

    /**
     * Execute a PATCH request
     */
    protected async patch<T>(endpoint: string, data?: any): Promise<T> {
        try {
            const response = await this.client.patch<T>(endpoint, data);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Failed to update data at ${endpoint}`);
        }
    }

    /**
     * Execute a DELETE request
     */
    protected async delete(endpoint: string): Promise<void> {
        try {
            await this.client.delete(endpoint);
        } catch (error) {
            return handleApiError(error, `Failed to delete data at ${endpoint}`);
        }
    }

    /**
     * Execute an upload request
     */
    protected async upload<T>(endpoint: string, formData: FormData): Promise<T> {
        try {
            const response = await this.client.upload<T>(endpoint, formData);
            return response.data;
        } catch (error) {
            return handleApiError(error, `Failed to upload data to ${endpoint}`);
        }
    }

    /**
     * Handle errors with custom message
     */
    protected handleError(error: unknown, defaultMessage: string): never {
        return handleApiError(error, defaultMessage);
    }

    /**
     * Check if error is retryable
     */
    protected isRetryableError(error: unknown): boolean {
        return error instanceof ApiClientError && error.isRetryable;
    }

    /**
     * Get error status code
     */
    protected getErrorStatus(error: unknown): number {
        if (error instanceof ApiClientError) {
            return error.status;
        }
        return 0;
    }
} 