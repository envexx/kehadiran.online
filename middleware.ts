import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "kehadiran-super-secret-key-change-in-production";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not /login/admin or /api/auth)
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      // No token — redirect to admin login
      const loginUrl = new URL("/login/admin", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Verify the token is for a superadmin
      if (payload.role !== "superadmin") {
        const loginUrl = new URL("/login/admin", request.url);
        loginUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(loginUrl);
      }

      // Token valid — allow access
      return NextResponse.next();
    } catch {
      // Token invalid or expired — redirect to login
      const loginUrl = new URL("/login/admin", request.url);
      loginUrl.searchParams.set("error", "expired");
      
      // Clear the invalid cookie
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set("admin-token", "", { maxAge: 0, path: "/" });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
