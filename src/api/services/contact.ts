/**
 * Contact Service
 * Repository pattern implementation for contact form API operations
 */

import { ContactFormRequest, ContactFormSubmission } from '@/types/property';
import { BaseService } from './base';
import { API_ENDPOINTS } from '../endpoints';

export class ContactService extends BaseService {
    /**
     * Submit contact form
     */
    async submitContactForm(data: ContactFormRequest): Promise<ContactFormSubmission> {
        return this.post<ContactFormSubmission>(API_ENDPOINTS.contactform.submit(), data);
    }

    /**
     * Get all contact form submissions (admin only)
     */
    async getContactFormSubmissions(): Promise<ContactFormSubmission[]> {
        return this.get<ContactFormSubmission[]>(API_ENDPOINTS.contactform.list());
    }
}

// Export singleton instance
export const contactService = new ContactService(); 