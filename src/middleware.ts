import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Các đường dẫn công khai không cần đăng nhập
const publicPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
  const hasCookies = request.cookies.has('accessToken') || request.cookies.has('refreshToken')
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // Nếu không có cookie xác thực và đang truy cập đường dẫn yêu cầu xác thực
  if (!hasCookies && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Nếu đã có cookie xác thực nhưng lại truy cập trang login/register
  if (hasCookies && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Áp dụng middleware cho tất cả các đường dẫn trừ các tài nguyên tĩnh
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
