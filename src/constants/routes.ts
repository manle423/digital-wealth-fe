// Các đường dẫn công khai không cần đăng nhập
export const PUBLIC_PATHS = [
  '/', 
  '/login', 
  '/register', 
  '/forgot-password', 
  '/reset-password', 
  '/risk-assessment', 
  '/risk-assessment/result', 
  '/api/auth', 
  '/api/risk-assessment'
]

// Các đường dẫn không nên truy cập khi đã đăng nhập
export const AUTH_REDIRECT_PATHS = [
  '/login', 
  '/register'
]

// Các đường dẫn dành riêng cho admin
export const ADMIN_PATHS = [
  '/admin',
  '/admin/questions',
  '/admin/profiles',
  '/admin/assets',
  '/admin/allocations',
  '/admin/settings'
] 