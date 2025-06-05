import axios from 'axios';

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

export const handleApiError = (error: unknown, defaultMessage: string): never => {
    if (axios.isAxiosError(error)) {
        throw new ApiError(
            error.response?.data?.message || defaultMessage,
            error.response?.status,
            error.response?.data
        );
    }
    
    if (error instanceof Error) {
        throw new ApiError(error.message);
    }
    
    throw new ApiError(defaultMessage);
};

export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof ApiError;
}; 