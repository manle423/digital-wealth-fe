export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
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