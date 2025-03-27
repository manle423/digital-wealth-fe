"use client";

import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { useAuth } from "@/contexts/auth.context";
import { Button } from "../ui/button";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full py-4 px-6 border-b flex items-center justify-between">
      {/* Logo/Home bên trái */}
      <div className="flex items-center">
        <Link href={"/"} className="text-lg font-bold">
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
                  <Link href={"/login"} className="hover:underline">
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link href={"/register"} className="hover:underline">
                    Đăng ký
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <span className="mr-2">Xin chào, {user?.name}</span>
                </li>
                <li>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Đăng xuất
                  </Button>
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
