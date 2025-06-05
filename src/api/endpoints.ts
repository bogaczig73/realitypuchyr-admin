export const API_ENDPOINTS = {
    properties: {
        list: (locale: string) => `/${locale}/properties`,
        detail: (locale: string, id: number) => `/${locale}/properties/${id}`,
        create: (locale: string) => `/${locale}/properties`,
        update: (locale: string, id: number) => `/${locale}/properties/${id}`,
        delete: (locale: string, id: number) => `/${locale}/properties/${id}`,
        updateState: (locale: string, id: number) => `/${locale}/properties/${id}/state`,
        top: (locale: string, limit: number) => `/${locale}/properties?limit=${limit}&sort=rating`,
    },
} as const;

// Type for endpoint parameters
export type EndpointParams = {
    properties: {
        list: {
            locale: string;
            page?: number;
            limit?: number;
            search?: string;
        };
        detail: {
            locale: string;
            id: number;
        };
        update: {
            locale: string;
            id: number;
            data: any; // Replace with proper type
        };
        delete: {
            locale: string;
            id: number;
        };
        updateState: {
            locale: string;
            id: number;
            status: 'ACTIVE' | 'SOLD';
        };
        top: {
            locale: string;
            limit: number;
        };
    };
}; 