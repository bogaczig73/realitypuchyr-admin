/**
 * Blogs Service
 * Repository pattern implementation for blog-related API operations
 */

import { Blog, BlogResponse, CreateBlogRequest, TranslationRequest, TranslationResponse, BlogLanguagesResponse } from '@/types/property';
import { BaseService } from './base';
import { API_ENDPOINTS } from '../endpoints';

export class BlogService extends BaseService {
    /**
     * Get paginated blogs
     */
    async getBlogs(locale: string, page: number = 1, limit: number = 10, truncate: number = 0): Promise<BlogResponse> {
        const params: Record<string, any> = { page, limit };
        if (truncate > 0) params.truncate = truncate;
        
        return this.get<BlogResponse>(API_ENDPOINTS.blogs.list(locale), params);
    }

    /**
     * Get blog by slug
     */
    async getBlogBySlug(locale: string, slug: string): Promise<Blog> {
        return this.get<Blog>(API_ENDPOINTS.blogs.detail(locale, slug));
    }

    /**
     * Get blog by slug and language
     */
    async getBlogBySlugAndLanguage(locale: string, slug: string, language: string): Promise<Blog> {
        return this.get<Blog>(API_ENDPOINTS.blogs.detailByLanguage(locale, slug, language));
    }

    /**
     * Get blog languages
     */
    async getBlogLanguages(locale: string, id: number): Promise<BlogLanguagesResponse> {
        return this.get<BlogLanguagesResponse>(API_ENDPOINTS.blogs.languages(locale, id));
    }

    /**
     * Create a new blog
     */
    async createBlog(locale: string, data: FormData): Promise<Blog> {
        return this.upload<Blog>(API_ENDPOINTS.blogs.list(locale), data);
    }

    /**
     * Translate blog to target language
     */
    async translateBlog(locale: string, id: number, data: TranslationRequest): Promise<TranslationResponse> {
        return this.post<TranslationResponse>(API_ENDPOINTS.blogs.translate(locale, id), data);
    }
}

// Export singleton instance
export const blogService = new BlogService(); 