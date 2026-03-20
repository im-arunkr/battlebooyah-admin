import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // Yahan 'next/server' hona chahiye

export default function middleware(request: NextRequest) {
  // 1. Cookie se token nikalna
  const token = request.cookies.get("adminToken")?.value;
  
  // 2. Path check karna
  const { pathname } = request.nextUrl;
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === "/login";

  // Case A: Dashboard access kar raha hai bina token ke -> Redirect to Login
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Case B: Login page par hai aur token pehle se hai -> Redirect to Dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/login"
  ],
};