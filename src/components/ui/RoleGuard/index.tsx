/**
 * @module RoleGuard
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU002
 * @ux UXAU-06, UXAU-07, UXAU-08
 * @description Wrapper declarativo de autorización en UI.
 *              Si el rol no tiene permiso, renderiza el fallback (o null)
 *              y NUNCA monta los children en el DOM.
 *              Durante hidratación muestra un skeleton para evitar flash de contenido.
 * @privacy El contenido protegido NUNCA se monta en el DOM si el rol no tiene acceso
 * @qa QA-03 (sin campos fantasma en DOM)
 * @accessibility Estado loading: aria-busy · Estado denegado: aria-hidden en contenido
 */

'use client';

import React from 'react';
import { useRBAC } from '@/src/hooks/useRBAC';
import { ResourceKey, Action } from '@/src/features/auth/domain/types';

interface RoleGuardProps {
  /** Recurso que se quiere acceder */
  resource: ResourceKey;
  /** Acción requerida sobre el recurso */
  action: Action;
  /** Contenido a mostrar si el acceso está permitido */
  children: React.ReactNode;
  /**
   * Contenido a mostrar si el acceso está denegado.
   * Si no se provee, no se renderiza nada (null).
   */
  fallback?: React.ReactNode;
  /**
   * Skeleton a mostrar durante la hidratación (isLoading).
   * Si no se provee, no se renderiza nada durante la carga.
   */
  loadingSkeleton?: React.ReactNode;
}

/**
 * Guardia declarativo de UI basado en RBAC.
 *
 * @example
 * // Solo médico y psicólogo ven el diagnóstico clínico
 * <RoleGuard
 *   resource="student.health.clinical"
 *   action="read"
 *   fallback={<LockIcon label="Solo personal clínico" />}
 * >
 *   <p>{diagnosticoClinico}</p>
 * </RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  resource,
  action,
  children,
  fallback = null,
  loadingSkeleton = null,
}) => {
  const { can, isLoading } = useRBAC();

  // Durante hidratación: mostrar skeleton para evitar flash de contenido
  if (isLoading) {
    return <>{loadingSkeleton}</>;
  }

  // Rol no tiene permiso: renderizar fallback (o nada)
  // IMPORTANTE: children NUNCA se monta en el DOM en este branch
  if (!can(resource, action)) {
    return <>{fallback}</>;
  }

  // Acceso permitido
  return <>{children}</>;
};
