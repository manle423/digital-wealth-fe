/**
 * Centralized logging utility
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.level = process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG) && this.isDevelopment) {
      console.log(this.formatMessage('DEBUG', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, context));
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = error ? { ...context, error: error.message, stack: error.stack } : context;
      console.error(this.formatMessage('ERROR', message, errorContext));
    }
  }

  // Specific methods for common use cases
  apiError(endpoint: string, error: Error, context?: LogContext): void {
    this.error(`API Error: ${endpoint}`, error, { ...context, endpoint });
  }

  authEvent(event: string, context?: LogContext): void {
    this.info(`Auth Event: ${event}`, { ...context, category: 'auth' });
  }

  userAction(action: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, { ...context, category: 'user' });
  }
}

export const logger = new Logger();
export default logger; 