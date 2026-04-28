import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLE_ROUTE_MAP, ROLE_ALIAS_MAP } from "@/src/lib/rbac.config";

/**
 * @module Proxy
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU001, HU002
 * @description Nuevo guardia de seguridad de Next.js 16 (reemplaza a middleware.ts).
 *              Centraliza el RBAC y la protección de rutas.
 */
export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = (token?.role as string)?.toLowerCase();

    // 1. Normalizar el rol para manejar alias (ej. teacher -> tutor)
    const normalizedRole = role ? ROLE_ALIAS_MAP[role] : null;

    // 2. Verificar si la ruta actual requiere un rol específico según el mapa centralizado
    for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTE_MAP)) {
      if (path.startsWith(routePrefix)) {
        // Validación: el rol normalizado del token debe estar en la lista permitida para el prefijo
        if (!normalizedRole || !allowedRoles.includes(normalizedRole)) {
          console.warn(`[SECURITY] Access denied for role ${role} (normalized: ${normalizedRole}) to ${path}. Redirecting to /403.`);
          
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

