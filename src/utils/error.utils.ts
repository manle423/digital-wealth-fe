/**
 * Error handling utilities
 */

import { toast } from 'sonner';
import { logger } from './logger.utils';
import { ERROR_MESSAGES, HTTP_STATUS } from '@/constants/app.constants';
import { ApiResponse } from '@/types/api.types';

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  context?: Record<string, any>;
}

export class CustomError extends Error implements AppError {
  public code?: string;
  public statusCode?: number;
  public context?: Record<string, any>;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
  }
}

/**
 * Create standardized error objects
 */
export const createError = {
  network: (context?: Record<string, any>) => 
    new CustomError(ERROR_MESSAGES.NETWORK_ERROR, 'NETWORK_ERROR', 0, context),
  
  unauthorized: (context?: Record<string, any>) => 
    new CustomError(ERROR_MESSAGES.UNAUTHORIZED, 'UNAUTHORIZED', HTTP_STATUS.UNAUTHORIZED, context),
  
  forbidden: (context?: Record<string, any>) => 
    new CustomError(ERROR_MESSAGES.FORBIDDEN, 'FORBIDDEN', HTTP_STATUS.FORBIDDEN, context),
  
  notFound: (context?: Record<string, any>) => 
    new CustomError(ERROR_MESSAGES.NOT_FOUND, 'NOT_FOUND', HTTP_STATUS.NOT_FOUND, context),
  
  validation: (message?: string, context?: Record<string, any>) => 
    new CustomError(message || ERROR_MESSAGES.VALIDATION_ERROR, 'VALIDATION_ERROR', HTTP_STATUS.BAD_REQUEST, context),
  
  unknown: (context?: Record<string, any>) => 
    new CustomError(ERROR_MESSAGES.UNKNOWN_ERROR, 'UNKNOWN_ERROR', HTTP_STATUS.INTERNAL_SERVER_ERROR, context),
};

/**
 * Handle API response errors
 */
export const handleApiError = <T>(
  response: ApiResponse<T>,
  context?: Record<string, any>
): never => {
  const errorContext = {
    ...context,
    statusCode: response.statusCode,
    message: response.message,
  };

  logger.error('API Error', undefined, errorContext);

  switch (response.statusCode) {
    case HTTP_STATUS.UNAUTHORIZED:
      throw createError.unauthorized(errorContext);
    case HTTP_STATUS.FORBIDDEN:
      throw createError.forbidden(errorContext);
    case HTTP_STATUS.NOT_FOUND:
      throw createError.notFound(errorContext);
    case HTTP_STATUS.BAD_REQUEST:
      throw createError.validation(response.message, errorContext);
    default:
      throw createError.unknown(errorContext);
  }
};

/**
 * Handle errors with toast notifications
 */
export const handleErrorWithToast = (
  error: Error | AppError,
  context?: Record<string, any>
): void => {
  const appError = error as AppError;
  
  logger.error('Error with toast', error, context);
  
  // Show user-friendly message
  const message = appError.message || ERROR_MESSAGES.UNKNOWN_ERROR;
  toast.error(message);
};

/**
 * Async error wrapper for try-catch blocks
 */
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: Record<string, any>
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleErrorWithToast(error as Error, context);
      return null;
    }
  };
};

/**
 * Error boundary helper
 */
export const isAuthError = (error: Error | AppError): boolean => {
  const appError = error as AppError;
  return (
    appError.code === 'UNAUTHORIZED' ||
    appError.code === 'TOKEN_NOT_FOUND' ||
    appError.statusCode === HTTP_STATUS.UNAUTHORIZED ||
    error.message?.includes('TOKEN_NOT_FOUND') ||
    error.message?.includes('UNAUTHORIZED')
  );
};

/**
 * Format error for logging
 */
export const formatErrorForLogging = (error: Error | AppError): Record<string, any> => {
  const appError = error as AppError;
  return {
    name: error.name,
    message: error.message,
    code: appError.code,
    statusCode: appError.statusCode,
    context: appError.context,
    stack: error.stack,
  };
}; 