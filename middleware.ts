import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Secure developer SaaS dashboard and checkout routes
  // 1. Secure developer SaaS dashboard, news feed, and checkout routes
  if (pathname.startsWith("/developer") || pathname.startsWith("/checkout")) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      const loginUrl = new URL("/login", request.url);
      const fromUrl = pathname + request.nextUrl.search;
      loginUrl.searchParams.set("from", fromUrl);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect legacy admin /dashboard routes
  if (pathname.startsWith("/dashboard") && pathname !== "/dashboard/login") {
    const adminSession = request.cookies.get("admin_session")?.value;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!adminSession || adminSession !== adminPassword) {
      const loginUrl = new URL("/dashboard/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/developer/:path*", "/checkout/:path*"],
};
