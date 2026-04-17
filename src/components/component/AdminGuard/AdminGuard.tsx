"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (status === "unauthenticated") {
      router.replace("/auth/signin");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "admin") {
      // Immediately redirect non-admin users
      router.replace("/");
      return;
    }
  }, [session, status, router]);

  // Don't render anything while loading
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render anything for unauthenticated users (they'll be redirected)
  if (status === "unauthenticated") {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Redirecting...
            </h1>
            <p className="text-gray-600">Please sign in to continue.</p>
          </div>
        </div>
      )
    );
  }

  // Don't render anything for non-admin users (they'll be redirected)
  if (session?.user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you to the homepage...
          </p>
        </div>
      </div>
    );
  }

  // Only render children for authenticated admin users
  return <>{children}</>;
}
