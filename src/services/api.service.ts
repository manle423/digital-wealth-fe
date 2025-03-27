import envConfig from "@/config";
import { ApiResponse } from "@/types/api.types";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
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

  // Thêm các methods khác: put, delete, patch nếu cần
}

export const apiService = new ApiService();
export default apiService; 