// src/api/methods.ts

/**
 * API methods utility for making HTTP requests
 * 
 */
export const apiMethods = {
    /**
     * Make a GET request
     * @param url - The endpoint URL
     * @param token - Authentication token
     */
    async get<T>(url: string, token?: string): Promise<T> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
        });
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
  
      return response.json();
    },
  
    /**
     * Make a POST request
     * @param url - The endpoint URL
     * @param data - The data to send
     * @param token - Authentication token
     */
    async post<T>(url: string, data: any, token?: string): Promise<T> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      // Log the request for debugging
      console.log('Making POST request:', { url, headers });
  
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        credentials: 'include', // Important for cookies
        mode: 'cors',
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
  
      return response.json();
    },
  
    /**
     * Make a PUT request
     * @param url - The endpoint URL
     * @param data - The data to send
     * @param token - Authentication token
     */
    async put<T>(url: string, data: any, token?: string): Promise<T> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
  
      return response.json();
    },
  
    /**
     * Make a DELETE request
     * @param url - The endpoint URL
     * @param token - Authentication token
     */
    async delete<T>(url: string, token?: string): Promise<T> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }
  
      return response.json();
    }
  };