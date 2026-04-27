import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLE_ROUTE_MAP } from "@/src/lib/rbac.config";

/**
 * @module Proxy
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU001, HU002
 * @description Nuevo guardia de seguridad de Next.js 16 (reemplaza a middleware.ts).
 *              Centraliza el RBAC y la protección de rutas.
 */
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = (token?.role as string)?.toLowerCase();

    // 1. Verificar si la ruta actual requiere un rol específico según el mapa centralizado
    for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTE_MAP)) {
      if (path.startsWith(routePrefix)) {
        // Validación estricta: el rol del token debe estar en la lista permitida para el prefijo
        if (!allowedRoles.includes(role as any)) {
          console.warn(`[SECURITY] Access denied for role ${role} to ${path}. Redirecting to /403.`);
          
          // Redirigir físicamente a /403 para evitar fugas de renderizado
          return NextResponse.redirect(new URL("/403", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Protegemos todas las áreas de roles de forma dinámica
     */
    "/tutor/:path*",
    "/admin/:path*",
    "/psicologo/:path*",
    "/medico/:path*",
    "/estudiante/:path*",
    "/auth/consent",
  ],
};

