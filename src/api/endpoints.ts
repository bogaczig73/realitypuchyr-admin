export const API_ENDPOINTS = {
    properties: {
        list: (locale: string) => `/${locale}/properties`,
        detail: (locale: string, id: number) => `/${locale}/properties/${id}`,
        create: (locale: string) => `/${locale}/properties`,
        update: (locale: string, id: number) => `/${locale}/properties/${id}`,
        delete: (locale: string, id: number) => `/${locale}/properties/${id}`,
        updateState: (locale: string, id: number) => `/${locale}/properties/${id}/state`,
        top: (locale: string, limit: number) => `/${locale}/properties?limit=${limit}&sort=rating`,
        stats: () => '/properties/stats',
        categoryStats: () => '/properties/category-stats',
        videoTours: () => '/properties/video-tours',
        createExternal: () => '/properties/external',
        sync: (id: number) => `/properties/${id}/sync`,
        translate: (id: number) => `/properties/${id}/translate`,
    },
    reviews: {
        list: () => '/reviews',
        create: () => '/reviews',
    },
    blogs: {
        list: () => '/blogs',
        detail: (slug: string) => `/blogs/${slug}`,
        translate: (id: number) => `/blogs/${id}/translate`,
    },
    contactform: {
        submit: () => '/contactform',
        list: () => '/contactform',
    },
    upload: {
        singleImage: () => '/upload/image',
        multipleImages: () => '/upload/images',
        singleFile: () => '/upload/file',
        multipleFiles: () => '/upload/files',
    },
    health: {
        check: () => '/health',
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
            status?: 'ACTIVE' | 'SOLD' | 'RENT';
            categoryId?: number;
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
            status: 'ACTIVE' | 'SOLD' | 'RENT';
        };
        top: {
            locale: string;
            limit: number;
        };
        sync: {
            id: number;
        };
        translate: {
            id: number;
            targetLanguage: string;
            sourceLanguage?: string;
        };
    };
    reviews: {
        create: {
            name: string;
            description: string;
            rating: number;
            propertyId?: number;
        };
    };
    blogs: {
        list: {
            page?: number;
            limit?: number;
            truncate?: number;
        };
        detail: {
            slug: string;
        };
        translate: {
            id: number;
            targetLanguage: string;
            sourceLanguage?: string;
        };
    };
    contactform: {
        submit: {
            name: string;
            email: string;
            subject: string;
            message: string;
            phoneNumber?: string;
        };
    };
}; 