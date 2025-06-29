/**
 * Upload Service
 * Repository pattern implementation for file upload API operations
 */

import { UploadResponse } from '@/types/property';
import { BaseService } from './base';
import { API_ENDPOINTS } from '../endpoints';
import { handleApiError } from '../errors';

export class UploadService extends BaseService {
    /**
     * Upload single image
     */
    async uploadSingleImage(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('image', file);
        
        return this.upload<UploadResponse>(API_ENDPOINTS.upload.singleImage(), formData);
    }

    /**
     * Upload multiple images
     */
    async uploadMultipleImages(files: File[]): Promise<UploadResponse[]> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });
        
        return this.upload<UploadResponse[]>(API_ENDPOINTS.upload.multipleImages(), formData);
    }

    /**
     * Upload single file
     */
    async uploadSingleFile(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);
        
        return this.upload<UploadResponse>(API_ENDPOINTS.upload.singleFile(), formData);
    }

    /**
     * Upload multiple files
     */
    async uploadMultipleFiles(files: File[]): Promise<UploadResponse[]> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        
        return this.upload<UploadResponse[]>(API_ENDPOINTS.upload.multipleFiles(), formData);
    }
}

// Export singleton instance
export const uploadService = new UploadService(); 