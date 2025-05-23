export type LoginData = {
  email: string;
  password: string;
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
};

export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  exp: number;
}