import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PUBLIC_PATHS, AUTH_REDIRECT_PATHS, ADMIN_PATHS } from '@/constants/routes'
import { getUserRoleFromToken, isAdminFromToken } from '@/lib/jwt.utils'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value
  const hasAccessToken = !!accessToken
  const hasRefreshToken = request.cookies.has('refreshToken')
  const pathname = request.nextUrl.pathname
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))
  const isAuthRedirectPath = AUTH_REDIRECT_PATHS.some(path => pathname.startsWith(path))
  const isAdminPath = ADMIN_PATHS.some(path => pathname.startsWith(path))

  // Lấy thông tin vai trò từ JWT token
  const userRole = getUserRoleFromToken(accessToken)
  
  // Log thông tin role cho việc debug
  if (accessToken) {
    console.log('User role from token:', userRole)
  }

  // Nếu có refreshToken nhưng không có accessToken, cho phép vào tất cả các trang
  // System sẽ tự động refresh trong ApiService
  if (!hasAccessToken && hasRefreshToken) {
    return NextResponse.next()
  }

  // Nếu không có cả 2 token và đang truy cập đường dẫn yêu cầu xác thực
  if (!hasAccessToken && !hasRefreshToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Nếu đã có accessToken nhưng lại truy cập trang login/register
  if (hasAccessToken && isAuthRedirectPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Kiểm tra quyền admin cho các route admin
  if (isAdminPath && !isAdminFromToken(accessToken)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Áp dụng middleware cho tất cả các đường dẫn trừ các tài nguyên tĩnh
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
