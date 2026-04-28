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
import { FiLock } from 'react-icons/fi';
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

  // Rol no tiene permiso: renderizar fallback (o mensaje de acceso denegado en dev)
  // IMPORTANTE: children NUNCA se monta en el DOM en este branch
  if (!can(resource, action)) {
    if (fallback) return <>{fallback}</>;
    
    // Fallback por defecto para evitar pantallas en blanco confusas
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50/50 rounded-3xl border border-dashed border-red-200 animate-fade-in">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
          <FiLock size={32} />
        </div>
        <h3 className="text-lg font-bold text-red-900">Acceso Restringido</h3>
        <p className="text-sm text-red-600 mt-1 max-w-xs mx-auto">
          No tienes los permisos necesarios para ver este contenido ({resource}:{action}).
        </p>
      </div>
    );
  }

  // Acceso permitido
  return <>{children}</>;
};
