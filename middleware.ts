import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /dashboard routes except /dashboard/login
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
  matcher: ["/dashboard/:path*"],
};
