// src/api/errors.ts

/**
 * Custom API error class
 */
export class ApiError extends Error {
    public status: number;
    public data: any;
  
    constructor(message: string, status: number, data?: any) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.data = data;
    }
  }
  
  /**
   * Handle API errors in components
   * @param error - The caught error
   * @param fallbackMessage - Optional fallback message
   */
  export const handleApiError = (error: unknown, fallbackMessage = 'An error occurred'): string => {
    console.error('API Error:', error);
    
    if (error instanceof ApiError) {
      return error.message;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return fallbackMessage;
  };