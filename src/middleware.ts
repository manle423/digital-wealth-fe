import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Các đường dẫn công khai không cần đăng nhập
const publicPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
  const hasAccessToken = request.cookies.has('accessToken')
  const hasRefreshToken = request.cookies.has('refreshToken')
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

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
  if (hasAccessToken && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Áp dụng middleware cho tất cả các đường dẫn trừ các tài nguyên tĩnh
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
