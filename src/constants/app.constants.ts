/**
 * Application constants
 */

// Authentication
export const AUTH_CONSTANTS = {
  CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
  STORAGE_KEY: 'auth_status',
  DEVICE_INFO_KEY: 'deviceInfo',
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
} as const;

// API
export const API_CONSTANTS = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// UI
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 1000,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  LOADING_SKELETON_ITEMS: 3,
} as const;

// Device Management
export const DEVICE_CONSTANTS = {
  FINGERPRINT_PREFIX: {
    WEB: 'web_',
    MOBILE: 'mobile_',
    DESKTOP: 'desktop_',
    SERVER: 'server-side-',
  },
  LAST_ACTIVE_THRESHOLDS: {
    NOW: 1, // hours
    RECENT: 24, // hours
    WEEK: 7 * 24, // hours
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Đã xảy ra lỗi khi kết nối tới server',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện hành động này',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  UNKNOWN_ERROR: 'Đã xảy ra lỗi không mong muốn',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  LOGOUT_SUCCESS: 'Đã đăng xuất thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  SAVE_SUCCESS: 'Lưu thành công!',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/account/profile',
  SETTINGS: '/account/settings',
  DEVICES: '/account/settings/devices',
  ADMIN: '/admin',
  RISK_ASSESSMENT: '/risk-assessment',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Device Types
export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  WEB: 'web',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10,11}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const; 