import { jwtDecode } from 'jwt-decode'
import { JwtPayload } from '@/types/auth.types'

/**
 * Giải mã JWT token để lấy thông tin
 * @param token JWT token cần giải mã
 * @returns Thông tin đã giải mã hoặc null nếu có lỗi
 */
export function decodeJwt(token: string | undefined): JwtPayload | null {
  if (!token) return null
  
  try {
    return jwtDecode<JwtPayload>(token)
  } catch (error) {
    console.error('Invalid JWT token', error)
    return null
  }
}

/**
 * Lấy thông tin vai trò từ JWT token
 * @param token JWT token
 * @returns vai trò người dùng hoặc undefined
 */
export function getUserRoleFromToken(token: string | undefined): string | undefined {
  const decoded = decodeJwt(token)
  return decoded?.role
}

/**
 * Kiểm tra xem người dùng có quyền admin hay không
 * @param token JWT token
 * @returns true nếu là admin, false nếu không phải
 */
export function isAdminFromToken(token: string | undefined): boolean {
  const role = getUserRoleFromToken(token)
  return role?.toUpperCase() === 'ADMIN'
} 