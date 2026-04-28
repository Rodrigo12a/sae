/**
 * @module useRBAC
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU002
 * @description Hook para verificar permisos del usuario actual en componentes cliente.
 *              No realiza llamadas a la API — consume la sesión local de NextAuth.
 *              Para autorización en Server Components, usar checkPermission() directamente.
 * @qa QA-03 (sin campos fantasma en DOM)
 * @privacy El hook nunca expone datos del estudiante — solo permisos del usuario en sesión
 */

'use client';

import { useSession } from 'next-auth/react';
import { UserRole, ResourceKey, Action } from '@/src/features/auth/domain/types';
import { checkPermission, ROLE_ALIAS_MAP } from '@/src/lib/rbac.config';

interface UseRBACReturn {
  /** Verifica si el usuario puede realizar una acción sobre un recurso */
  can: (resource: ResourceKey, action: Action) => boolean;
  /** Rol actual del usuario (null si no autenticado o cargando) */
  role: UserRole | null;
  /** true durante la hidratación inicial del cliente */
  isLoading: boolean;
  /** true si el usuario está autenticado */
  isAuthenticated: boolean;
}

/**
 * Hook para control de acceso basado en roles en componentes cliente.
 *
 * @example
 * const { can } = useRBAC();
 * if (can('student.health.clinical', 'read')) {
 *   // Solo se monta para medico/psicologo
 * }
 */
export function useRBAC(): UseRBACReturn {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  
  const rawRole = session?.user?.role as string | undefined;
  const role: UserRole | null = rawRole ? (ROLE_ALIAS_MAP[rawRole.toLowerCase()] ?? null) : null;

  const can = (resource: ResourceKey, action: Action): boolean => {
    if (isLoading || !role) return false;
    return checkPermission(role, resource, action);
  };

  return {
    can,
    role,
    isLoading,
    isAuthenticated,
  };
}
