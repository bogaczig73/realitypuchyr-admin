/**
 * Unified API Client
 * Industry-standard implementation with proper error handling, retries, and interceptors
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, API_HEADERS, RequestConfig, ResponseConfig, ApiErrorResponse } from './config';

// Custom error class for API errors
export class ApiClientError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any,
        public isRetryable: boolean = false
    ) {
        super(message);
        this.name = 'ApiClientError';
    }
}

// Retry configuration
interface RetryConfig {
    retries: number;
    retryDelay: number;
    retryCondition: (error: AxiosError) => boolean;
}

const defaultRetryConfig: RetryConfig = {
    retries: API_CONFIG.retries,
    retryDelay: API_CONFIG.retryDelay,
    retryCondition: (error: AxiosError) => {
        // Retry on network errors or 5xx server errors
        return !error.response || (error.response.status >= 500 && error.response.status < 600);
    },
};

// Create axios instance with default configuration
const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_CONFIG.baseURL,
        timeout: API_CONFIG.timeout,
        headers: API_HEADERS,
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config) => {
            // Add API key if not present
            if (API_CONFIG.apiKey && !config.headers['X-API-Key']) {
                config.headers['X-API-Key'] = API_CONFIG.apiKey;
            }

            // Add locale from localStorage if available
            if (typeof window !== 'undefined') {
                const locale = localStorage.getItem('locale') || 'en';
                config.headers['Accept-Language'] = locale;
            }

            // Log request in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                    params: config.params,
                    data: config.data,
                });
            }

            return config;
        },
        (error) => {
            console.error('❌ Request Error:', error);
            return Promise.reject(error);
        }
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            // Log response in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`✅ API Response: ${response.status} ${response.config.url}`, {
                    data: response.data,
                });
            }

            return response;
        },
        (error: AxiosError) => {
            // Log error in development
            if (process.env.NODE_ENV === 'development') {
                console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, {
                    data: error.response?.data,
                    message: error.message,
                });
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

// Retry mechanism
const retryRequest = async (
    axiosInstance: AxiosInstance,
    config: AxiosRequestConfig,
    retryConfig: RetryConfig = defaultRetryConfig
): Promise<AxiosResponse> => {
    let lastError: AxiosError;

    for (let attempt = 0; attempt <= retryConfig.retries; attempt++) {
        try {
            return await axiosInstance(config);
        } catch (error) {
            lastError = error as AxiosError;

            // Don't retry if it's the last attempt or if the error is not retryable
            if (attempt === retryConfig.retries || !retryConfig.retryCondition(lastError)) {
                break;
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay * (attempt + 1)));
        }
    }

    throw lastError!;
};

// Main API client class
export class ApiClient {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = createAxiosInstance();
    }

    /**
     * Make an HTTP request with automatic retries and error handling
     */
    async request<T = any>(config: RequestConfig): Promise<ResponseConfig<T>> {
        try {
            const axiosConfig: AxiosRequestConfig = {
                method: config.method,
                url: config.url,
                data: config.data,
                params: config.params,
                headers: {
                    ...API_HEADERS,
                    ...config.headers,
                },
                timeout: config.timeout || API_CONFIG.timeout,
            };

            const response = await retryRequest(this.axiosInstance, axiosConfig, {
                ...defaultRetryConfig,
                retries: config.retries || defaultRetryConfig.retries,
            });

            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers as Record<string, string>,
            };
        } catch (error) {
            throw this.handleError(error as AxiosError);
        }
    }

    /**
     * GET request
     */
    async get<T = any>(url: string, params?: Record<string, any>, config?: Partial<RequestConfig>): Promise<ResponseConfig<T>> {
        return this.request<T>({
            method: 'GET',
            url,
            params,
            ...config,
        });
    }

    /**
     * POST request
     */
    async post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ResponseConfig<T>> {
        return this.request<T>({
            method: 'POST',
            url,
            data,
            ...config,
        });
    }

    /**
     * PUT request
     */
    async put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ResponseConfig<T>> {
        return this.request<T>({
            method: 'PUT',
            url,
            data,
            ...config,
        });
    }

    /**
     * PATCH request
     */
    async patch<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ResponseConfig<T>> {
        return this.request<T>({
            method: 'PATCH',
            url,
            data,
            ...config,
        });
    }

    /**
     * DELETE request
     */
    async delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ResponseConfig<T>> {
        return this.request<T>({
            method: 'DELETE',
            url,
            ...config,
        });
    }

    /**
     * Upload file(s) with FormData
     */
    async upload<T = any>(
        url: string,
        formData: FormData,
        config?: Partial<RequestConfig>
    ): Promise<ResponseConfig<T>> {
        return this.request<T>({
            method: 'POST',
            url,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...config,
        });
    }

    /**
     * Handle and transform errors
     */
    private handleError(error: AxiosError): ApiClientError {
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const data = error.response.data as ApiErrorResponse;
            
            const message = data?.error || data?.details?.join(', ') || error.message;
            const isRetryable = status >= 500 && status < 600;

            return new ApiClientError(message, status, data, isRetryable);
        } else if (error.request) {
            // Network error
            return new ApiClientError('Network error - no response received', 0, null, true);
        } else {
            // Other error
            return new ApiClientError(error.message, 0, null, false);
        }
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for backward compatibility
export { apiClient as api }; 