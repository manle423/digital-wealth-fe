import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import { LoginData, RegisterData, UserData } from "@/types/auth.types";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success("Đăng nhập thành công!");
        router.push("/");
        return true;
      } else {
        toast.error(response.message || "Đăng nhập thất bại");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      
      if (response.success) {
        toast.success("Đăng ký thành công!");
        router.push("/login");
        return true;
      } else {
        toast.error(response.message || "Đăng ký thất bại");
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
      toast.success("Đã đăng xuất");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Đã xảy ra lỗi khi đăng xuất");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout
  };
}