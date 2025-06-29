/**
 * Reviews Service
 * Repository pattern implementation for review-related API operations
 */

import { Review, CreateReviewRequest } from '@/types/property';
import { BaseService } from './base';
import { API_ENDPOINTS } from '../endpoints';

export class ReviewService extends BaseService {
    /**
     * Get all reviews
     */
    async getReviews(): Promise<Review[]> {
        return this.get<Review[]>(API_ENDPOINTS.reviews.list());
    }

    /**
     * Create a new review
     */
    async createReview(data: CreateReviewRequest): Promise<Review> {
        return this.post<Review>(API_ENDPOINTS.reviews.create(), data);
    }

    /**
     * Update an existing review
     */
    async updateReview(id: number, data: CreateReviewRequest): Promise<Review> {
        return this.put<Review>(API_ENDPOINTS.reviews.update(id), data);
    }

    /**
     * Delete a review
     */
    async deleteReview(id: number): Promise<void> {
        return this.delete(API_ENDPOINTS.reviews.delete(id));
    }
}

// Export singleton instance
export const reviewService = new ReviewService(); 