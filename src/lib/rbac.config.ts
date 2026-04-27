/**
 * @module rbac.config
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU002
 * @description Matriz declarativa de permisos por rol. Fuente de verdad del RBAC en el frontend.
 *              El backend es la fuente canónica — esta matriz es la segunda capa de defensa.
 * @privacy student.health.clinical → NUNCA incluido para rol 'tutor'
 * @qa QA-01, QA-03
 */

import { UserRole, ResourceKey, Action, RBACMap } from '@/src/features/auth/domain/types';

// ─────────────────────────────────────────────────────────────────────────────
// Matriz de permisos: Record<Rol, Record<Recurso, Acciones permitidas>>
// ─────────────────────────────────────────────────────────────────────────────

export const RBAC_MATRIX: Record<UserRole, RBACMap> = {
  tutor: {
    'student.health.operational': ['read'],
    'alert.view':                  ['read'],
    'alert.close':                 ['write'],
    'referral.create':             ['write'],
    // student.health.clinical → AUSENTE INTENCIONALMENTE (privacidad diferencial)
  },

  estudiante: {
    // El estudiante solo accede a la encuesta pública (sin auth RBAC)
  },

  psicologo: {
    'student.health.clinical':     ['read'],
    'student.health.operational':  ['read'],
    'alert.view':                  ['read'],
    'referral.accept':             ['write'],
  },

  medico: {
    'student.health.clinical':     ['read', 'write'],
    'student.health.operational':  ['read'],
    'alert.view':                  ['read'],
  },

  administrador: {
    'student.health.clinical':     ['read'],
    'student.health.operational':  ['read'],
    'alert.view':                  ['read'],
    'alert.close':                 ['write'],
    'audit.view':                  ['read'],
    'referral.create':             ['write'],
    'referral.accept':             ['write'],
    'report.generate':             ['write'],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Función utilitaria pura — no importar en componentes directamente,
// usar el hook useRBAC o el componente RoleGuard
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verifica si un rol tiene permiso para realizar una acción sobre un recurso.
 * @returns true si el permiso existe en la matriz RBAC local
 * @privacy Nunca retorna true para 'student.health.clinical' con rol 'tutor'
 */
export function checkPermission(
  role: UserRole | string | undefined | null,
  resource: ResourceKey,
  action: Action,
): boolean {
  if (!role) return false;
  const roleMap = RBAC_MATRIX[role as UserRole];
  if (!roleMap) return false;
  const allowedActions = roleMap[resource];
  return Array.isArray(allowedActions) && allowedActions.includes(action);
}

/**
 * Rutas protegidas por rol (espejo del middleware.ts para consistencia).
 * No modifiques esta tabla sin actualizar también el middleware.
 */
export const ROLE_ROUTE_MAP: Record<string, UserRole[]> = {
  '/tutor':     ['tutor'],
  '/admin':     ['administrador'],
  '/psicologo': ['psicologo'],
  '/medico':    ['medico'],
};
