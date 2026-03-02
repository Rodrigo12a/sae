import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isFormRoute = pathname.startsWith("/form");
  const isLoginRoute = pathname.startsWith("/login");

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const nextAuthSessionCookie =
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("__Secure-next-auth.session-token") ??
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token");

  const hasSession = Boolean(token || nextAuthSessionCookie);
  const role = token?.role ? String(token.role).toUpperCase() : null;

  // Rutas protegidas: requieren sesión
  if ((isDashboardRoute || isFormRoute) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Control de acceso por rol (solo si logramos leer el token)
  if (isDashboardRoute && role === "ALUMNO") {
    return NextResponse.redirect(new URL("/form", request.url));
  }
  if (isFormRoute && role && role !== "ALUMNO") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si ya está autenticado (y podemos leer rol) y entra al login, redirigimos según su rol
  if (isLoginRoute && role) {
    return NextResponse.redirect(
      new URL(role === "ALUMNO" ? "/form" : "/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/form", "/login"],
};