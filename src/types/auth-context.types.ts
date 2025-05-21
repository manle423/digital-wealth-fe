import { UserData } from "@/types/auth.types";

export interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
  login: (email: string, password: string) => Promise<{success: boolean; errorMessage?: string}>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}