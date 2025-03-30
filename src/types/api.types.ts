export type ApiResponse<T> = {
  data?: T;
  success: boolean;
  message?: string;
  statusCode?: number;
};