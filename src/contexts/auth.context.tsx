"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";
import { UserData } from "@/types/auth.types";
import { toast } from "sonner";
import { AuthContextType } from "@/types/auth-context.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_KEY = "auth_status";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Kiểm tra xác thực khi khởi tạo
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_KEY);
    
    if (storedAuth) {
      // Nếu có dữ liệu trong localStorage, sử dụng trước
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.user && authData.timestamp) {
          // Kiểm tra thời gian lưu cache - ví dụ 30 phút
          const isValid = (Date.now() - authData.timestamp) < 30 * 60 * 1000;
          
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
    
    // Nếu không có dữ liệu localStorage hoặc hết hạn, gọi API
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
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
        
        toast.success("Đăng nhập thành công!");
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

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register({ name, email, password });
      
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
      toast.error("Đã xảy ra lỗi khi đăng xuất");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
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
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
}