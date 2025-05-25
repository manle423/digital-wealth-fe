import envConfig from "@/config";
import { ApiResponse } from "@/types/api.types";
import { logger } from "@/utils/logger.utils";
import { ERROR_MESSAGES, HTTP_STATUS } from "@/constants/app.constants";

// Global logout function - will be set by AuthContext
let globalLogoutHandler: (() => void) | null = null;

export const setGlobalLogoutHandler = (handler: () => void) => {
  globalLogoutHandler = handler;
};

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT;
  }

  private hasAuthToken(): boolean {
    if (typeof document !== 'undefined') {
      return document.cookie.includes('accessToken') || document.cookie.includes('refreshToken');
    }
    return false;
  }

  // Public method to check if user has auth tokens
  public hasValidTokens(): boolean {
    return this.hasAuthToken();
  }

  private handleTokenNotFound(response: ApiResponse<any>) {
    // Check if the error is TOKEN_NOT_FOUND
    if (response.message === 'TOKEN_NOT_FOUND' || 
        response.message?.includes('TOKEN_NOT_FOUND') ||
        response.statusCode === HTTP_STATUS.UNAUTHORIZED) {
      
      logger.authEvent('TOKEN_NOT_FOUND detected - triggering automatic logout', {
        statusCode: response.statusCode,
        message: response.message
      });
      
      // Clear all auth-related cookies
      if (typeof document !== 'undefined') {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
      
      // Clear localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth_status');
        localStorage.clear();
      }
      
      // Trigger global logout if handler is available
      if (globalLogoutHandler) {
        globalLogoutHandler();
      } else {
        // Fallback: redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const result: ApiResponse<T> = await response.json();
      
      if (!response.ok) {
        const errorResponse = {
          success: false,
          message: result.message || `Error: ${response.statusText}`,
          statusCode: response.status
        };
        
        // Handle TOKEN_NOT_FOUND
        this.handleTokenNotFound(errorResponse);
        
        return errorResponse;
      }
      
      return result;
    } catch (error) {
      logger.apiError(endpoint, error as Error);
      return { 
        success: false, 
        message: ERROR_MESSAGES.NETWORK_ERROR
      };
    }
  }

  async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<ApiResponse<T>> {
    if (requiresAuth && !this.hasAuthToken()) {
      const unauthorizedResponse = { success: false, message: "UNAUTHORIZED" };
      this.handleTokenNotFound(unauthorizedResponse);
      return unauthorizedResponse;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      const result = await response.json();
      
      // Add status code to result
      result.statusCode = response.status;
      
      // Handle TOKEN_NOT_FOUND
      if (!response.ok) {
        this.handleTokenNotFound(result);
      }
      
      return result;
    } catch (error) {
      logger.apiError(`GET ${endpoint}`, error as Error);
      return { success: false, message: ERROR_MESSAGES.NETWORK_ERROR };
    }
  }

  async post<T, D = any>(endpoint: string, data?: D): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: data ? JSON.stringify(data) : undefined,
      });
      
      const result = await response.json();
      
      // Add status code to result
      result.statusCode = response.status;
      
      // Handle TOKEN_NOT_FOUND
      if (!response.ok) {
        this.handleTokenNotFound(result);
      }
      
      return result;
    } catch (error) {
      logger.apiError(`POST ${endpoint}`, error as Error);
      return { success: false, message: ERROR_MESSAGES.NETWORK_ERROR };
    }
  }

  async put<T, D = any>(endpoint: string, data?: D): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: data ? JSON.stringify(data) : undefined,
      });
      
      const result = await response.json();
      
      // Add status code to result
      result.statusCode = response.status;
      
      // Handle TOKEN_NOT_FOUND
      if (!response.ok) {
        this.handleTokenNotFound(result);
      }
      
      return result;
    } catch (error) {
      logger.apiError(`PUT ${endpoint}`, error as Error);
      return { success: false, message: ERROR_MESSAGES.NETWORK_ERROR };
    }
  }

  async delete<T, D = any>(endpoint: string, data?: D): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: data ? JSON.stringify(data) : undefined,
      });
      
      const result = await response.json();
      
      // Add status code to result
      result.statusCode = response.status;
      
      // Handle TOKEN_NOT_FOUND
      if (!response.ok) {
        this.handleTokenNotFound(result);
      }
      
      return result;
    } catch (error) {
      logger.apiError(`DELETE ${endpoint}`, error as Error);
      return { success: false, message: ERROR_MESSAGES.NETWORK_ERROR };
    }
  }
}

export const apiService = new ApiService();
export default apiService; 