"use client";

import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { useAuth } from "@/contexts/auth.context";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiUser, FiBarChart2, FiDollarSign, FiCreditCard, FiLogOut, FiSettings } from "react-icons/fi";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full py-4 px-6 border-b flex items-center justify-between bg-white dark:bg-gray-900">
      {/* Logo/Home bên trái */}
      <div className="flex items-center">
        <Link href="/" prefetch className="text-lg font-bold">
          Digital Wealth
        </Link>
      </div>

      {/* Navigation bên phải */}
      <div className="flex items-center gap-6">
        <nav>
          <ul className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <li>
                  <Link href="/login" prefetch className="hover:underline">
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link href="/register" prefetch className="hover:underline">
                    Đăng ký
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    href="/risk-assessment" 
                    prefetch
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                  >
                    <FiBarChart2 className="text-lg" />
                    <span>Đánh giá rủi ro</span>
                  </Link>
                </li>
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {user?.name?.[0] || 'U'}
                        </div>
                        <span>{user?.name || 'User'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/account/profile" prefetch className="flex items-center gap-2 w-full">
                          <FiUser className="text-lg" />
                          <span>Hồ sơ cá nhân</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/account/risk-history" prefetch className="flex items-center gap-2 w-full">
                          <FiBarChart2 className="text-lg" />
                          <span>Lịch sử đánh giá rủi ro</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/account/assets" prefetch className="flex items-center gap-2 w-full">
                          <FiDollarSign className="text-lg" />
                          <span>Tài sản của tôi</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/account/debts" prefetch className="flex items-center gap-2 w-full">
                          <FiCreditCard className="text-lg" />
                          <span>Nợ của tôi</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/account/net-worth" prefetch className="flex items-center gap-2 w-full">
                          <FiDollarSign className="text-lg" />
                          <span>Tài sản ròng</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/account/financial-analysis" prefetch className="flex items-center gap-2 w-full">
                          <FiDollarSign className="text-lg" />
                          <span>Phân tích tài chính</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/account/settings" prefetch className="flex items-center gap-2 w-full">
                          <FiSettings className="text-lg" />
                          <span>Cài đặt</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-red-600">
                        <div className="flex items-center gap-2 w-full">
                          <FiLogOut className="text-lg" />
                          <span>Đăng xuất</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </>
            )}
          </ul>
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}
