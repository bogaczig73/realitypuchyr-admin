# API Layer Architecture

This document describes the industry-standard API layer implementation for the Reality Puchýř admin application.

## Architecture Overview

The API layer follows the **Repository Pattern** with a **Unified API Client** approach, providing:

- ✅ **Centralized Configuration** - Single source of truth for API settings
- ✅ **Automatic Retries** - Built-in retry mechanism for failed requests
- ✅ **Error Handling** - Consistent error handling across all services
- ✅ **Type Safety** - Full TypeScript support with proper typing
- ✅ **Logging** - Development logging for debugging
- ✅ **Authentication** - Automatic API key injection
- ✅ **File Uploads** - Streamlined file upload handling

## Why Single API Structure?

**Before:** We had multiple API client files and inconsistent patterns:
- `src/services/api.ts` - Old service with direct axios calls
- `src/services/propertyService.ts` - Deprecated service with fetch calls
- `src/api/services/` - New unified service layer

**After:** Single, unified API structure:
- `src/api/` - Complete API layer with consistent patterns
- All services follow the same Repository pattern
- Single source of truth for API configuration
- Consistent error handling and retry logic

This consolidation eliminates:
- ❌ **Confusion** - No more wondering which service to use
- ❌ **Duplication** - No duplicate transformer functions
- ❌ **Maintenance overhead** - Single codebase to maintain
- ❌ **Inconsistent patterns** - All services follow the same architecture

## File Structure

```
src/api/
├── config.ts          # Centralized configuration
├── client.ts          # Unified API client with retries
├── errors.ts          # Error handling utilities
├── endpoints.ts       # API endpoint definitions
├── transformers.ts    # Data transformation utilities
├── index.ts           # Main export file
├── README.md          # This documentation
└── services/
    ├── base.ts        # Base service class
    ├── index.ts       # Service exports
    ├── property.ts    # Property service
    ├── reviews.ts     # Reviews service
    ├── blogs.ts       # Blogs service
    ├── contact.ts     # Contact form service
    ├── upload.ts      # File upload service
    └── health.ts      # Health check service
```

## Core Components

### 1. Configuration (`config.ts`)

Centralized configuration for all API settings:

```typescript
export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
} as const;
```

### 2. API Client (`client.ts`)

Unified HTTP client with automatic retries and error handling:

```typescript
import { apiClient } from '@/api';

// GET request
const response = await apiClient.get('/properties', { page: 1, limit: 10 });

// POST request
const response = await apiClient.post('/properties', propertyData);

// File upload
const response = await apiClient.upload('/upload/image', formData);
```

**Features:**
- Automatic retries for network errors and 5xx responses
- Exponential backoff
- Request/response logging in development
- Automatic API key injection
- Locale handling

### 3. Error Handling (`errors.ts`)

Consistent error handling across the application:

```typescript
import { ApiClientError, ApiError, handleApiError } from '@/api';

try {
    const data = await propertyService.getProperties();
} catch (error) {
    if (error instanceof ApiClientError) {
        console.log('Status:', error.status);
        console.log('Retryable:', error.isRetryable);
    }
}
```

### 4. Base Service (`services/base.ts`)

Abstract base class for all services, implementing the Repository pattern:

```typescript
export abstract class BaseService {
    protected client = apiClient;

    protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T>
    protected async post<T>(endpoint: string, data?: any): Promise<T>
    protected async put<T>(endpoint: string, data?: any): Promise<T>
    protected async patch<T>(endpoint: string, data?: any): Promise<T>
    protected async delete(endpoint: string): Promise<void>
    protected async upload<T>(endpoint: string, formData: FormData): Promise<T>
}
```

## Usage Examples

### Property Service

```typescript
import { propertyService } from '@/api';

// Get properties with filtering
const properties = await propertyService.getProperties(1, 12, "apartment", "en", "ACTIVE", 1);

// Create property with file upload
const formData = new FormData();
formData.append('data', JSON.stringify(propertyData));
formData.append('images', imageFile);
const property = await propertyService.createProperty(formData, "en");

// Get statistics
const stats = await propertyService.getPropertyStats();
const categoryStats = await propertyService.getCategoryStats();
```

### Reviews Service

```typescript
import { reviewService } from '@/api';

// Get all reviews
const reviews = await reviewService.getReviews();

// Create review
const review = await reviewService.createReview({
    name: "John Doe",
    description: "Great property!",
    rating: 5,
    propertyId: 123
});
```

### Upload Service

```typescript
import { uploadService } from '@/api';

// Upload single image
const imageResponse = await uploadService.uploadSingleImage(imageFile);

// Upload multiple files
const fileResponses = await uploadService.uploadMultipleFiles([file1, file2, file3]);
```

### Error Handling

```typescript
import { propertyService, ApiClientError, API_ERROR_CODES } from '@/api';

try {
    const properties = await propertyService.getProperties();
} catch (error) {
    if (error instanceof ApiClientError) {
        switch (error.status) {
            case 401:
                // Handle unauthorized
                break;
            case 404:
                // Handle not found
                break;
            case 422:
                // Handle validation errors
                break;
            default:
                // Handle other errors
                break;
        }
    }
}
```

## Environment Variables

Required environment variables:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_KEY=your_api_key_here
```

## Migration Guide

### From Old API Usage

**Before:**
```typescript
import { api } from '@/api/api';
import { propertyService as oldService } from '@/services/propertyService';
import { propertyApi } from '@/services/api';

const response = await api.get('/properties');
const properties = await oldService.getProperties();
const property = await propertyApi.getById(123);
```

**After:**
```typescript
import { propertyService } from '@/api';

const properties = await propertyService.getProperties();
const property = await propertyService.getPropertyById(123, 'en');
```

### From Direct Fetch Calls

**Before:**
```typescript
const response = await fetch(`${API_BASE_URL}/properties`, {
    headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
    },
});
```

**After:**
```typescript
import { propertyService } from '@/api';

const properties = await propertyService.getProperties();
```

## Best Practices

1. **Always use services** - Don't make direct API calls, use the service layer
2. **Handle errors properly** - Use try-catch blocks and check error types
3. **Use TypeScript** - Leverage the built-in type safety
4. **Follow naming conventions** - Use consistent method names across services
5. **Test error scenarios** - Test both success and failure cases

## Testing

The API layer is designed to be easily testable:

```typescript
// Mock the API client for testing
jest.mock('@/api/client', () => ({
    apiClient: {
        get: jest.fn(),
        post: jest.fn(),
        // ... other methods
    }
}));
```

## Performance Considerations

- **Automatic retries** - Built-in retry mechanism reduces failed requests
- **Request caching** - Consider implementing caching for frequently accessed data
- **Batch requests** - Use batch endpoints when available
- **Pagination** - Always use pagination for large datasets

## Security

- **API key injection** - Automatic API key handling
- **Input validation** - Validate all inputs before sending to API
- **Error sanitization** - Don't expose sensitive information in error messages
- **HTTPS only** - Always use HTTPS in production

## Troubleshooting

### Common Issues

1. **401 Unauthorized** - Check API key configuration
2. **Network errors** - Check API URL and network connectivity
3. **Timeout errors** - Increase timeout in config if needed
4. **Retry loops** - Check if the error is actually retryable

### Debug Mode

Enable debug logging by setting `NODE_ENV=development`:

```bash
# .env.local
NODE_ENV=development
```

This will log all API requests and responses to the console. 