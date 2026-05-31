import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware — protects /admin/* routes
 * Also handles sister-brand domain routing (royalcruisegoa.com, partyyachtgoa.com)
 */
export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // ── Admin protection ──
  // Auth.js v5 handles session validation; this catches unauthenticated requests
  // before they reach the page component (faster fail, no layout flash)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Check for NextAuth session token cookie
    const sessionToken =
      request.cookies.get("__Secure-authjs.session-token") ||
      request.cookies.get("authjs.session-token") ||
      request.cookies.get("next-auth.session-token");

    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Sister-brand routing ──
  // When royalcruisegoa.com or partyyachtgoa.com are Vercel domain aliases,
  // inject a brand header so pages can render brand-specific content
  const response = NextResponse.next();

  if (hostname.includes("royalcruisegoa")) {
    response.headers.set("x-brand", "royal-cruise");
  } else if (hostname.includes("partyyachtgoa")) {
    response.headers.set("x-brand", "party-yacht");
  } else {
    response.headers.set("x-brand", "goatrippackage");
  }

  return response;
}

export const config = {
  matcher: [
    // Match all admin routes except login and static files
    "/admin/:path*",
    // Match root for sister-brand routing
    "/",
    // Exclude Next.js internals and static files
    "/((?!_next/static|_next/image|favicon|images|fonts|api/auth).*)",
  ],
};
