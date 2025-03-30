import envConfig from "@/config";
import { ApiResponse } from "@/types/api.types";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT;
  }

  private hasAuthToken(): boolean {
    // Kiểm tra nếu đang chạy ở client-side
    if (typeof window !== 'undefined') {
      // Kiểm tra jwt cookie (giả sử cookie của bạn có tên là 'jwt')
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
      return !!authCookie;
    }
    return false;
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const result: ApiResponse<T> = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: result.message || `Error: ${response.statusText}`,
        };
      }
      
      return result;
    } catch (error) {
      console.error(`Request ${endpoint} error:`, error);
      return { 
        success: false, 
        message: "Đã xảy ra lỗi khi kết nối tới server"
      };
    }
  }

  async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<ApiResponse<T>> {
    if (requiresAuth && !this.hasAuthToken()) {
      return { success: false, message: "UNAUTHORIZED" };
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      return await response.json();
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      return { success: false, message: "Đã xảy ra lỗi khi kết nối tới server" };
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
      
      return await response.json();
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      return { success: false, message: "Đã xảy ra lỗi khi kết nối tới server" };
    }
  }

}

export const apiService = new ApiService();
export default apiService; 