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