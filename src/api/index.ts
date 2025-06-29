/**
 * API Layer Main Export
 * Centralized exports for the entire API layer
 */

// Core API client and configuration
export { apiClient, ApiClient, ApiClientError } from './client';
export { API_CONFIG, API_HEADERS, type ApiResponse, type ApiErrorResponse } from './config';

// Error handling
export { 
    ApiError, 
    handleApiError, 
    isApiError, 
    isApiClientError, 
    createErrorMessage, 
    API_ERROR_CODES, 
    getErrorCode 
} from './errors';

// Endpoints
export { API_ENDPOINTS, type EndpointParams } from './endpoints';

// Transformers
export { transformProperty, transformCategory } from './transformers';

// Base service
export { BaseService } from './services/base';

// All services
export * from './services'; 