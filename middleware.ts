import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    // ----------------------------
    // 1. Lowercase redirect for public URLs
    // ----------------------------
    if (
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/static") &&
      pathname !== pathname.toLowerCase()
    ) {
      url.pathname = pathname.toLowerCase();
      return NextResponse.redirect(url, 301); // Permanent redirect
    }

    // ----------------------------
    // 2. Admin auth logic
    // ----------------------------
    // Allow access to admin signin page
    if (pathname === "/admin/signin") {
      return NextResponse.next();
    }

    // Check if user is trying to access admin routes (excluding signin)
    if (pathname.startsWith("/admin")) {
      const token = req.nextauth.token;

      // If no token or user is not an admin, redirect to home
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Always allow access to admin signin page
        if (pathname === "/admin/signin") return true;

        // Allow access to admin routes only for admin users
        if (pathname.startsWith("/admin")) return token?.role === "admin";

        // Allow access to all other routes
        return true;
      },
    },
  }
);

// ----------------------------
// Apply middleware
// ----------------------------
export const config = {
  matcher: [
    "/admin/((?!signin).*)", // Match all admin routes except signin
    "/:path*", // Apply lowercase redirect to all public pages
  ],
};
