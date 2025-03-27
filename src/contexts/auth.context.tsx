"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";
import { UserData } from "@/types/auth.types";
import { toast } from "sonner";

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Kiểm tra xác thực khi khởi tạo
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Kiểm tra xác thực thất bại:", error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success("Đăng nhập thành công!");
        return true;
      } else {
        toast.error(response.message || "Đăng nhập thất bại");
        return false;
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      return false;
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