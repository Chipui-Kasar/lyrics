import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow access to admin signin page
    if (req.nextUrl.pathname === "/admin/signin") {
      return NextResponse.next();
    }

    // Check if user is trying to access admin routes (excluding signin)
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const token = req.nextauth.token;

      // If no token or user is not an admin, redirect
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always allow access to admin signin page
        if (req.nextUrl.pathname === "/admin/signin") {
          return true;
        }

        // Allow access to admin routes only for admin users
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }

        // Allow access to all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/((?!signin).*)", // Match all admin routes except signin
    // Add any other protected routes here
  ],
};
