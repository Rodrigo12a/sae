import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas protegidas
  const protectedRoutes = ["/dashboard"];

  // Simulación de sesión (luego será token real)
  const hasSession = request.cookies.get("sae-session");

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
  };