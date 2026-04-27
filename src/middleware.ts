/**
 * @module Middleware
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU001, HU002
 * @description Guardia de seguridad a nivel de servidor para proteger rutas según el rol.
 *              En accesos denegados añade el header X-SAE-Security-Event para auditoría.
 * @qa QA-01, QA-03
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLE_ROUTE_MAP } from "@/src/lib/rbac.config";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Verificar si la ruta actual requiere un rol específico
    for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTE_MAP)) {
      if (path.startsWith(routePrefix)) {
        const userRole = token?.role as string;

        if (!allowedRoles.includes(userRole as any)) {
          // 2. Registrar intento denegado como header HTTP (para logging de infraestructura)
          //    El frontend NO emite eventos al backend desde el cliente (QA-03 / privacidad)
          const response = NextResponse.rewrite(new URL("/403", req.url));
          response.headers.set(
            "X-SAE-Security-Event",
            JSON.stringify({
              type: "ACCESS_DENIED",
              userId: token?.uid ?? "unknown",
              role: userRole ?? "unknown",
              attemptedPath: path,
              timestamp: new Date().toISOString(),
            })
          );
          return response;
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Solo usuarios autenticados pasan
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

// Configurar qué rutas deben ser procesadas por el middleware
export const config = {
  matcher: [
    "/tutor/:path*",
    "/admin/:path*",
    "/psicologo/:path*",
    "/medico/:path*",
    "/auth/consent", // Protegemos también el consentimiento
  ],
};

