/**
 * Centralized API Configuration
 * Following industry standards for API client configuration
 */

export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
} as const;

export const API_HEADERS = {
    'Content-Type': 'application/json',
    ...(API_CONFIG.apiKey && { 'X-API-Key': API_CONFIG.apiKey }),
} as const;

// API Response types
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiErrorResponse {
    error: string;
    details?: string[];
    status: number;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request configuration
export interface RequestConfig {
    method: HttpMethod;
    url: string;
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
}

// Response configuration
export interface ResponseConfig<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
} 