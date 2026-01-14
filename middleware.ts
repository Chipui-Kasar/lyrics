import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Skip processing for static assets and API routes
    if (
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/api/") ||
      pathname.startsWith("/static/") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    // Allow access to admin signin page
    if (pathname === "/admin/signin") {
      return NextResponse.next();
    }

    // Check admin auth for admin routes
    if (pathname.startsWith("/admin")) {
      const token = req.nextauth.token;
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
        
        // Always allow access to admin signin
        if (pathname === "/admin/signin") return true;
        
        // Require admin role for admin routes
        if (pathname.startsWith("/admin")) return token?.role === "admin";
        
        // Allow all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
