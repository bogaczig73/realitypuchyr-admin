/**
 * Blogs Service
 * Repository pattern implementation for blog-related API operations
 */

import { Blog, BlogResponse, CreateBlogRequest, TranslationRequest, TranslationResponse } from '@/types/property';
import { BaseService } from './base';
import { API_ENDPOINTS } from '../endpoints';

export class BlogService extends BaseService {
    /**
     * Get paginated blogs
     */
    async getBlogs(page: number = 1, limit: number = 10, truncate: number = 0): Promise<BlogResponse> {
        const params: Record<string, any> = { page, limit };
        if (truncate > 0) params.truncate = truncate;
        
        return this.get<BlogResponse>(API_ENDPOINTS.blogs.list(), params);
    }

    /**
     * Get blog by slug
     */
    async getBlogBySlug(slug: string): Promise<Blog> {
        return this.get<Blog>(API_ENDPOINTS.blogs.detail(slug));
    }

    /**
     * Create a new blog
     */
    async createBlog(data: FormData): Promise<Blog> {
        return this.upload<Blog>(API_ENDPOINTS.blogs.list(), data);
    }

    /**
     * Translate blog to target language
     */
    async translateBlog(id: number, data: TranslationRequest): Promise<TranslationResponse> {
        return this.post<TranslationResponse>(API_ENDPOINTS.blogs.translate(id), data);
    }
}

// Export singleton instance
export const blogService = new BlogService(); 