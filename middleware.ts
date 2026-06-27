import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase-middleware";

export async function middleware(request: NextRequest) {
  const { supabase, getResponse } = createMiddlewareClient(request);

  // Refresh session — keeps the session alive and writes refreshed tokens to cookies.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  if (user && pathname === "/admin/login") {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/admin/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return getResponse();
}

export const config = {
  matcher: [
    /*
     * Match /admin and all sub-paths.
     * Skip Next.js internals and static files.
     */
    "/admin/:path*",
  ],
};
