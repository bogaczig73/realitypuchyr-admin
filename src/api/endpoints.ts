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
        list: (locale: string) => `/${locale}/blogs`,
        detail: (locale: string, slug: string) => `/${locale}/blogs/${slug}`,
        detailByLanguage: (locale: string, slug: string, language: string) => `/${locale}/blogs/${slug}?language=${language}`,
        translate: (locale: string, id: number) => `/${locale}/blogs/${id}/translate`,
        languages: (locale: string, id: number) => `/${locale}/blogs/${id}/languages`,
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
            locale: string;
            page?: number;
            limit?: number;
            truncate?: number;
        };
        detail: {
            locale: string;
            slug: string;
        };
        detailByLanguage: {
            locale: string;
            slug: string;
            language: string;
        };
        translate: {
            locale: string;
            id: number;
            targetLanguage: string;
            sourceLanguage?: string;
        };
        languages: {
            locale: string;
            id: number;
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