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
  const isProtectedRoute = pathname.startsWith('/account/')

  // Nếu đang ở public path, cho phép truy cập
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Nếu đã có accessToken nhưng lại truy cập trang login/register
  if (hasAccessToken && isAuthRedirectPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Nếu có refreshToken nhưng không có accessToken, cho phép vào để refresh token
  if (!hasAccessToken && hasRefreshToken) {
    return NextResponse.next()
  }

  // Kiểm tra quyền admin cho các route admin
  if (isAdminPath) {
    if (!hasAccessToken || !isAdminFromToken(accessToken)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Kiểm tra authentication cho protected routes
  if (isProtectedRoute && !hasAccessToken && !hasRefreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Áp dụng middleware cho tất cả các đường dẫn trừ các tài nguyên tĩnh
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
