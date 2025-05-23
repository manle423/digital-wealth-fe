import apiService from "./api.service";
import { ApiResponse } from "@/types/api.types";
import { LoginData, RegisterData, UserData, AuthResponse, UserProfileData } from "@/types/auth.types";

class AuthService {
  private isRefreshing = false;
  private refreshPromise: Promise<ApiResponse<AuthResponse>> | null = null;

  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    return await apiService.post<AuthResponse, LoginData>("/auth/login", data);
  }

  async register(data: RegisterData): Promise<ApiResponse<UserData>> {
    return await apiService.post<UserData, RegisterData>("/auth/register", data);
  }

  async refresh(): Promise<ApiResponse<AuthResponse>> {
    if (this.isRefreshing) {
      return this.refreshPromise!;
    }

    this.isRefreshing = true;
    this.refreshPromise = apiService.post<AuthResponse>("/auth/refresh", undefined);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>("/auth/logout");
  }

  async getProfile(): Promise<ApiResponse<UserData>> {
    const response = await apiService.get<UserData>("/user/me");
    
    if (response.statusCode === 401) {
      return this.handleUnauthorizedRequest(() => 
        apiService.get<UserData>("/user/me")
      );
    }
    
    return response;
  }

  async getUserProfile(): Promise<ApiResponse<UserProfileData>> {
    const response = await apiService.get<UserProfileData>("/user/me/profile");
    
    if (response.statusCode === 401) {
      return this.handleUnauthorizedRequest(() => 
        apiService.get<UserProfileData>("/user/me/profile")
      );
    }
    
    return response;
  }

  async handleUnauthorizedRequest<T>(
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> {
    try {
      const refreshResult = await this.refresh();
      if (!refreshResult.success) {
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        return { success: false, message: "UNAUTHORIZED" };
      }
      return await requestFn();
    } catch (error) {
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      return { success: false, message: "UNAUTHORIZED" };
    }
  }
}

export const authService = new AuthService();
export default authService;