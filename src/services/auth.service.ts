import apiService from "./api.service";
import { ApiResponse } from "@/types/api.types";
import { LoginData, RegisterData, UserData, AuthResponse, UserProfileData, DeviceSession, DeviceListResponse } from "@/types/auth.types";
import { getDeviceInfo } from "@/utils/device.utils";

class AuthService {
  private isRefreshing = false;
  private refreshPromise: Promise<ApiResponse<AuthResponse>> | null = null;

  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    // Auto-attach device info if not provided
    const loginData = {
      ...data,
      deviceInfo: data.deviceInfo || getDeviceInfo()
    };
    
    return await apiService.post<AuthResponse, LoginData>("/auth/login", loginData);
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
    
    // Don't try to refresh if TOKEN_NOT_FOUND - let global handler deal with it
    if (response.message === 'TOKEN_NOT_FOUND') {
      return response;
    }
    
    if (response.statusCode === 401) {
      return this.handleUnauthorizedRequest(() => 
        apiService.get<UserData>("/user/me")
      );
    }
    
    return response;
  }

  async getUserProfile(): Promise<ApiResponse<UserProfileData>> {
    const response = await apiService.get<UserProfileData>("/user/me/profile");
    
    // Don't try to refresh if TOKEN_NOT_FOUND - let global handler deal with it
    if (response.message === 'TOKEN_NOT_FOUND') {
      return response;
    }
    
    if (response.statusCode === 401) {
      return this.handleUnauthorizedRequest(() => 
        apiService.get<UserProfileData>("/user/me/profile")
      );
    }
    
    return response;
  }

  async updateProfile(data: Partial<UserProfileData>): Promise<ApiResponse<UserProfileData>> {
    const response = await apiService.put<UserProfileData>("/user/me/profile", data);
    
    // Don't try to refresh if TOKEN_NOT_FOUND - let global handler deal with it
    if (response.message === 'TOKEN_NOT_FOUND') {
      return response;
    }
    
    if (response.statusCode === 401) {
      return this.handleUnauthorizedRequest(() => 
        apiService.put<UserProfileData>("/user/me/profile", data)
      );
    }
    
    return response;
  }

  // Device Management Methods
  async getDevices(): Promise<ApiResponse<DeviceListResponse>> {
    const response = await apiService.get<DeviceListResponse>("/auth/devices");
    
    // Don't try to refresh if TOKEN_NOT_FOUND - let global handler deal with it
    if (response.message === 'TOKEN_NOT_FOUND') {
      return response;
    }
    
    if (response.statusCode === 401) {
      return this.handleUnauthorizedRequest(() => 
        apiService.get<DeviceListResponse>("/auth/devices")
      );
    }
    
    return response;
  }

  async logoutAllDevices(includeCurrentDevice: boolean = false): Promise<ApiResponse<{ message: string }>> {
    const response = await apiService.post<{ message: string }>("/auth/devices/logout-all", {
      includeCurrentDevice
    });
    
    // Don't try to refresh if TOKEN_NOT_FOUND - let global handler deal with it
    if (response.message === 'TOKEN_NOT_FOUND') {
      return response;
    }
    
    if (response.statusCode === 401) {
      return this.handleUnauthorizedRequest(() => 
        apiService.post<{ message: string }>("/auth/devices/logout-all", { includeCurrentDevice })
      );
    }
    
    return response;
  }

  async logoutDevice(deviceId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiService.delete<{ message: string }>(`/auth/devices/${deviceId}`);
    
    // Don't try to refresh if TOKEN_NOT_FOUND - let global handler deal with it
    if (response.message === 'TOKEN_NOT_FOUND') {
      return response;
    }
    
    if (response.statusCode === 401) {
      return this.handleUnauthorizedRequest(() => 
        apiService.delete<{ message: string }>(`/auth/devices/${deviceId}`)
      );
    }
    
    return response;
  }

  async trustDevice(deviceId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiService.post<{ message: string }>(`/auth/devices/${deviceId}/trust`);
    
    // Don't try to refresh if TOKEN_NOT_FOUND - let global handler deal with it
    if (response.message === 'TOKEN_NOT_FOUND') {
      return response;
    }
    
    if (response.statusCode === 401) {
      return this.handleUnauthorizedRequest(() => 
        apiService.post<{ message: string }>(`/auth/devices/${deviceId}/trust`)
      );
    }
    
    return response;
  }

  async untrustDevice(deviceId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiService.delete<{ message: string }>(`/auth/devices/${deviceId}/trust`);
    
    // Don't try to refresh if TOKEN_NOT_FOUND - let global handler deal with it
    if (response.message === 'TOKEN_NOT_FOUND') {
      return response;
    }
    
    if (response.statusCode === 401) {
      return this.handleUnauthorizedRequest(() => 
        apiService.delete<{ message: string }>(`/auth/devices/${deviceId}/trust`)
      );
    }
    
    return response;
  }

  // Password Reset Methods
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>("/auth/forgot-password", { email });
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>("/auth/reset-password", {
      email,
      token,
      newPassword
    });
  }

  async handleUnauthorizedRequest<T>(
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> {
    try {
      const refreshResult = await this.refresh();
      if (!refreshResult.success) {
        // Clear cookies and return unauthorized
        if (typeof document !== 'undefined') {
          document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
        return { success: false, message: "UNAUTHORIZED", statusCode: 401 };
      }
      return await requestFn();
    } catch (error) {
      // Clear cookies and return unauthorized
      if (typeof document !== 'undefined') {
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
      return { success: false, message: "UNAUTHORIZED", statusCode: 401 };
    }
  }
}

export const authService = new AuthService();
export default authService;