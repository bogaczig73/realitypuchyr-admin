import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding locale
apiClient.interceptors.request.use((config) => {
    // Get locale from localStorage or default to 'en'
    const locale = typeof window !== 'undefined' ? localStorage.getItem('locale') || 'en' : 'en';
    config.headers['Accept-Language'] = locale;
    return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            // Log error for debugging
            console.error('API Error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
            
            // Handle specific error cases
            if (error.response?.status === 401) {
                // Handle unauthorized
                console.error('Unauthorized access');
            } else if (error.response?.status === 404) {
                // Handle not found
                console.error('Resource not found');
            }
        }
        return Promise.reject(error);
    }
);

// Request logging interceptor
apiClient.interceptors.request.use((config) => {
    console.log('API Request:', {
        method: config.method,
        url: config.url,
        params: config.params,
        data: config.data,
    });
    return config;
});

// Response logging interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            status: response.status,
            data: response.data,
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        return Promise.reject(error);
    }
); 