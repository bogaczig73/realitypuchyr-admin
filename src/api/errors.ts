/**
 * Error handling utilities for the API layer
 * Industry-standard error handling patterns
 */

import { ApiClientError } from './client';

// Legacy error class for backward compatibility
export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Handle API errors and convert them to consistent format
 */
export const handleApiError = (error: unknown, defaultMessage: string): never => {
    if (error instanceof ApiClientError) {
        throw new ApiError(error.message, error.status, error.data);
    }
    
    if (error instanceof Error) {
        throw new ApiError(error.message);
    }
    
    throw new ApiError(defaultMessage);
};

/**
 * Check if an error is an API error
 */
export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof ApiError;
};

/**
 * Check if an error is an API client error
 */
export const isApiClientError = (error: unknown): error is ApiClientError => {
    return error instanceof ApiClientError;
};

/**
 * Create a user-friendly error message
 */
export const createErrorMessage = (error: unknown): string => {
    if (error instanceof ApiClientError || error instanceof ApiError) {
        return error.message;
    }
    
    if (error instanceof Error) {
        return error.message;
    }
    
    return 'An unexpected error occurred';
};

/**
 * Error codes for common API errors
 */
export const API_ERROR_CODES = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    TIMEOUT: 'TIMEOUT',
} as const;

/**
 * Get error code from error
 */
export const getErrorCode = (error: unknown): string => {
    if (error instanceof ApiClientError) {
        if (error.status === 401) return API_ERROR_CODES.UNAUTHORIZED;
        if (error.status === 403) return API_ERROR_CODES.FORBIDDEN;
        if (error.status === 404) return API_ERROR_CODES.NOT_FOUND;
        if (error.status === 422) return API_ERROR_CODES.VALIDATION_ERROR;
        if (error.status >= 500) return API_ERROR_CODES.SERVER_ERROR;
        if (error.status === 0) return API_ERROR_CODES.NETWORK_ERROR;
    }
    
    return API_ERROR_CODES.SERVER_ERROR;
}; 