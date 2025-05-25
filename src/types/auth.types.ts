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
  deviceInfo?: DeviceInfo;
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