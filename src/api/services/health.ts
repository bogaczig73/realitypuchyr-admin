/**
 * Health Service
 * Repository pattern implementation for health check API operations
 */

import { HealthResponse } from '@/types/property';
import { BaseService } from './base';
import { API_ENDPOINTS } from '../endpoints';

export class HealthService extends BaseService {
    /**
     * Check API health status
     */
    async checkHealth(): Promise<HealthResponse> {
        return this.get<HealthResponse>(API_ENDPOINTS.health.check());
    }
}

// Export singleton instance
export const healthService = new HealthService(); 