"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";
import { setGlobalLogoutHandler } from "@/services/api.service";
import apiService from "@/services/api.service";
import { UserData } from "@/types/auth.types";
import { toast } from "sonner";
import { AuthContextType } from "@/types/auth-context.types";
import { logger } from "@/utils/logger.utils";
import { AUTH_CONSTANTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/app.constants";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_KEY = AUTH_CONSTANTS.STORAGE_KEY;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Force logout function for TOKEN_NOT_FOUND errors
  const forceLogout = () => {
    logger.authEvent('Force logout triggered due to TOKEN_NOT_FOUND');
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    toast.error(ERROR_MESSAGES.UNAUTHORIZED);
    router.push("/login");
  };

  // Helper function to check if user has auth tokens
  const hasAuthTokens = (): boolean => {
    return apiService.hasValidTokens();
  };

  // Register global logout handler
  useEffect(() => {
    setGlobalLogoutHandler(forceLogout);
  }, []);

  // Kiểm tra xác thực khi khởi tạo
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_KEY);
    
    if (storedAuth) {
      // Nếu có dữ liệu trong localStorage, sử dụng trước
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.user && authData.timestamp) {
          // Kiểm tra thời gian lưu cache
          const isValid = (Date.now() - authData.timestamp) < AUTH_CONSTANTS.CACHE_DURATION;
          
          if (isValid) {
            setUser(authData.user);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        // Xử lý lỗi parse JSON
        localStorage.removeItem(AUTH_KEY);
      }
    }
    
    // Chỉ gọi API nếu có token trong cookies (người dùng đã đăng nhập trước đó)
    if (hasAuthTokens()) {
      checkAuth();
    } else {
      // Không có token, người dùng chưa đăng nhập
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    // Kiểm tra xem có token không trước khi gọi API
    if (!hasAuthTokens()) {
      logger.debug('No auth tokens found, skipping API call', { component: 'AuthContext' });
      setUser(null);
      setIsLoading(false);
      return false;
    }

    try {
      setIsLoading(true);
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        setUser(response.data);
        
        // Lưu vào localStorage với timestamp
        localStorage.setItem(AUTH_KEY, JSON.stringify({
          user: response.data,
          timestamp: Date.now()
        }));
        
        return true;
      } else {
        // Handle TOKEN_NOT_FOUND or other auth errors
        if (response.message === 'TOKEN_NOT_FOUND' || response.statusCode === 401) {
          forceLogout();
          return false;
        }
        
        setUser(null);
        localStorage.removeItem(AUTH_KEY);
        return false;
      }
    } catch (error) {
      console.error("Kiểm tra xác thực thất bại:", error);
      setUser(null);
      localStorage.removeItem(AUTH_KEY);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{success: boolean; errorMessage?: string}> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        
        // Lưu vào localStorage với timestamp
        localStorage.setItem(AUTH_KEY, JSON.stringify({
          user: response.data.user,
          timestamp: Date.now()
        }));
        
        toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
        return { success: true };
      } else {
        return { 
          success: false, 
          errorMessage: response.message || "UNKNOWN_ERROR"
        };
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      return { success: false, errorMessage: "SERVER_ERROR" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register({ name, email, password, confirmPassword });
      
      if (response.success) {
        toast.success("Đăng ký thành công!");
        return true;
      } else {
        toast.error(response.message || "Đăng ký thất bại");
        return false;
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      localStorage.removeItem(AUTH_KEY);
      toast.success("Đã đăng xuất thành công");
      router.push("/login");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      // Even if logout API fails, clear local state
      setUser(null);
      localStorage.removeItem(AUTH_KEY);
      toast.error("Đã xảy ra lỗi khi đăng xuất");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // Kiểm tra nếu người dùng có quyền admin
  const isAdmin = (): boolean => {
    return user?.role?.toUpperCase() === 'ADMIN';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}