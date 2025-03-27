import apiService from "./api.service";
import { ApiResponse } from "@/types/api.types";
import { LoginData, RegisterData, UserData, AuthResponse } from "@/types/auth.types";

class AuthService {
  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    return await apiService.post<AuthResponse, LoginData>("/auth/login", data);
  }

  async register(data: RegisterData): Promise<ApiResponse<UserData>> {
    return await apiService.post<UserData, RegisterData>("/auth/register", data);
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>("/auth/logout");
  }

  async getProfile(): Promise<ApiResponse<UserData>> {
    return await apiService.get<UserData>("/user/me");
  }
}

export const authService = new AuthService();
export default authService;