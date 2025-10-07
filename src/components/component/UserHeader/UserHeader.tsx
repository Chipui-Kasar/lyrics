"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User, LogOut, LogIn, Settings } from "lucide-react";
import Link from "next/link";

export default function UserHeader() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Tangkhul Lyrics
              </Link>
            </div>
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Tangkhul Lyrics
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* Contribute Link */}
                <Link
                  href="/contribute"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Contribute
                </Link>

                {/* Admin Link (only for admins) */}
                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Settings className="w-4 h-4 inline mr-1" />
                    Admin
                  </Link>
                )}

                {/* User Profile Dropdown */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {session.user.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="ml-1 hidden sm:block">Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signIn()}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="ml-1">Sign In</span>
                </Button>
                <Link href="/signup">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <User className="w-4 h-4" />
                    <span className="ml-1">Sign Up</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
