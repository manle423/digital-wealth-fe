/**
 * Authentication utility functions
 */

/**
 * Check if an error is related to authentication/token issues
 */
export const isAuthError = (error: any): boolean => {
  if (!error) return false;
  
  const message = error.message || error.toString();
  const statusCode = error.statusCode || error.status;
  
  return (
    message === 'TOKEN_NOT_FOUND' ||
    message?.includes('TOKEN_NOT_FOUND') ||
    message === 'UNAUTHORIZED' ||
    message?.includes('UNAUTHORIZED') ||
    statusCode === 401 ||
    message?.includes('Session expired') ||
    message?.includes('Invalid token')
  );
};

/**
 * Clear all authentication data from browser storage
 */
export const clearAuthData = (): void => {
  // Clear localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('auth_status');
    // Clear any other auth-related items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth') || key.includes('token') || key.includes('user'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
  
  // Clear sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
  }
  
  // Clear cookies
  if (typeof document !== 'undefined') {
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Clear any other auth cookies
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.includes('token') || name.includes('auth') || name.includes('session')) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
      }
    });
  }
};

/**
 * Force logout and redirect to login page
 */
export const forceLogout = (message?: string): void => {
  console.warn('Force logout triggered:', message || 'Authentication error');
  
  // Clear all auth data
  clearAuthData();
  
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

/**
 * Test function to simulate TOKEN_NOT_FOUND error (for development/testing)
 */
export const simulateTokenNotFound = (): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Simulating TOKEN_NOT_FOUND error for testing');
    clearAuthData();
    throw new Error('TOKEN_NOT_FOUND - Simulated for testing');
  }
};

/**
 * Check if user has auth tokens in cookies
 */
export const hasAuthTokens = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes('accessToken') || document.cookie.includes('refreshToken');
};

/**
 * Check if user is authenticated based on stored data
 */
export const isAuthenticated = (): boolean => {
  if (typeof localStorage === 'undefined') return false;
  
  try {
    const authData = localStorage.getItem('auth_status');
    if (!authData) return false;
    
    const parsed = JSON.parse(authData);
    if (!parsed.user || !parsed.timestamp) return false;
    
    // Check if auth data is still valid (30 minutes)
    const isValid = (Date.now() - parsed.timestamp) < 30 * 60 * 1000;
    
    if (!isValid) {
      localStorage.removeItem('auth_status');
      return false;
    }
    
    return true;
  } catch (error) {
    localStorage.removeItem('auth_status');
    return false;
  }
};

/**
 * Get stored user data if available and valid
 */
export const getStoredUser = (): any | null => {
  if (!isAuthenticated()) return null;
  
  try {
    const authData = localStorage.getItem('auth_status');
    if (!authData) return null;
    
    const parsed = JSON.parse(authData);
    return parsed.user || null;
  } catch (error) {
    return null;
  }
}; 