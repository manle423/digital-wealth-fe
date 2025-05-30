export type LoginData = {
  email: string;
  password: string;
  deviceInfo?: DeviceInfo;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export type UserDetail = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  userId: string;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  occupation: string | null;
  annualIncome: string | null;
  investmentExperience: string | null;
  riskTolerance: string | null;
  investmentPreferences: string | null;
  totalPortfolioValue: number | null;
  isVerified: boolean;
  kycDetails: any | null;
};

export type UserProfileData = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
  email: string;
  name: string;
  role: string;
  userDetail: UserDetail | null;
};

export type TokenData = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
};

export type AuthResponse = {
  user: UserData;
  tokens: TokenData;
  sessionInfo?: SessionInfo;
};

export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  exp: number;
}

// Device Information Types
export type DeviceType = "mobile" | "tablet" | "desktop" | "web";

export type DeviceInfo = {
  deviceId: string;
  deviceType: DeviceType;
  deviceName: string;
  deviceModel: string;
  osVersion: string;
  appVersion: string;
};

export type SessionInfo = {
  sessionId: string;
  deviceId: string;
  isNewDevice: boolean;
  isTrusted: boolean;
};

export type DeviceSession = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  userId?: string;
  sessionId?: string;
  deviceId: string;
  deviceType: DeviceType;
  deviceName: string;
  deviceModel: string;
  osVersion: string;
  appVersion: string;
  ipAddress: string;
  location: string;
  lastAccessAt: string;
  isActive?: boolean;
  isTrusted: boolean;
  trustedAt: string | null;
  isCurrentDevice: boolean;
  deviceInfo?: DeviceInfo;
  lastActiveAt?: string;
  isCurrentSession?: boolean;
};

// API response for device list
export type DeviceListResponse = {
  devices: DeviceSession[];
  currentDeviceCanLogoutOthers: boolean;
};

export interface FinanceProfile {
  profile: {
    user: {
      name: string;
      email: string;
      age: number;
      occupation: string;
      investmentExperience: string;
      riskTolerance: number;
    };
    financial: {
      monthlyIncome: number;
      monthlyExpenses: number;
      monthlySavings: number;
      savingsRate: number;
      totalAssets: number;
      totalDebts: number;
      netWorth: number;
      liquidAssets: number;
      emergencyFundMonths: number;
    };
    assets: {
      breakdown: Array<{
        categoryName: string;
        totalValue: number;
        percentage: number;
      }>;
      liquid: Array<{
        name: string;
        type: string;
        value: number;
        category: string;
      }>;
      totalCategories: number;
    };
    debts: {
      breakdown: Array<{
        categoryName: string;
        totalValue: number;
        percentage: number;
      }>;
      totalCategories: number;
      debtToAssetRatio: number;
    };
    healthMetrics: {
      overallScore: number;
      trend: {
        change: number;
        changePercentage: number;
        trend: 'INCREASING' | 'DECREASING' | 'STABLE';
      };
      liquidityRatio: number;
    };
    preferences: {
      goals: string[];
      preferredTypes: string[];
      timeHorizon: string;
    };
  };
  advice: {
    aiGenerated: string;
    generatedAt: string;
    source: string;
  };
  summary: {
    netWorth: number;
    totalAssets: number;
    totalDebts: number;
    liquidAssets: number;
    monthlyIncome: number;
    monthlySavings: number;
    financialHealthScore: number;
  };
}