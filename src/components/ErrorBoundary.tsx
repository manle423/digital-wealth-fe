'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if error is related to TOKEN_NOT_FOUND
    if (error.message?.includes('TOKEN_NOT_FOUND') || 
        error.message?.includes('UNAUTHORIZED') ||
        error.message?.includes('401')) {
      
      console.warn('Authentication error detected in ErrorBoundary');
      
      // Clear auth data
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('auth_status');
      }
      
      if (typeof document !== 'undefined') {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
      
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else {
      // Log other errors for debugging
      toast.error('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Đã xảy ra lỗi
            </h2>
            <p className="text-gray-600 mb-4">
              Ứng dụng gặp sự cố không mong muốn. Vui lòng tải lại trang.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 