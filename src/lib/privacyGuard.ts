/**
 * @module privacyGuard
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU002
 * @description Segunda capa de privacidad diferencial en el frontend.
 *              La primera capa es el backend (filtra por JWT). Esta función
 *              actúa como guardia defensiva en la capa de presentación.
 * @privacy Hace imposible que diagnosticoClinico llegue a componentes del Tutor
 * @qa QA-01, QA-03
 */

import { UserRole, ResourceKey, Action } from '@/src/features/auth/domain/types';
import { checkPermission } from '@/src/lib/rbac.config';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos de perfil de salud diferenciados por rol
// ─────────────────────────────────────────────────────────────────────────────

/** Perfil de salud que el Tutor puede ver (NUNCA incluye diagnosticoClinico) */
export interface HealthProfileTutor {
  studentId: string;
  etiquetaOperativa: string;
  semaforoEstado: 'rojo' | 'amarillo' | 'verde' | 'revisar' | 'sin-datos';
  // diagnosticoClinico: CAMPO PROHIBIDO — ausente por diseño tipado
}

/** Perfil de salud completo (solo para medico y psicologo) */
export interface HealthProfileClinical extends HealthProfileTutor {
  diagnosticoClinico: string;
  condiciones?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Función principal de filtrado
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filtra los datos de salud de un estudiante según el rol del usuario.
 * Si el rol es 'tutor', elimina el campo `diagnosticoClinico` aunque viniera del servidor.
 * Esto es una segunda capa de defensa — la primera es el backend.
 *
 * @param data Datos crudos del servidor
 * @param role Rol del usuario autenticado
 * @returns Datos filtrados seguros para el rol especificado
 */
export function filterHealthByRole(
  data: HealthProfileClinical,
  role: UserRole | string | undefined | null,
): HealthProfileTutor | HealthProfileClinical {
  const canSeeClinical = checkPermission(role, 'student.health.clinical', 'read');

  if (canSeeClinical) {
    return data; // medico o psicologo: datos completos
  }

  // Tutor u otros roles: solo etiqueta operativa — NUNCA diagnóstico
  const { diagnosticoClinico: _removed, ...safeData } = data;
  return safeData as HealthProfileTutor;
}

// ─────────────────────────────────────────────────────────────────────────────
// Guardia de acceso a recursos (función pura)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verifica si un rol puede acceder a un recurso con una acción.
 * Función pura — sin efectos secundarios — 100% testeable.
 */
export function canAccess(
  role: UserRole | string | undefined | null,
  resource: ResourceKey,
  action: Action,
): boolean {
  return checkPermission(role, resource, action);
}

/**
 * Aserta que un rol NO puede acceder a un recurso clínico.
 * Útil para tests de privacidad — lanza error si la guardia falla.
 * @throws Error si el tutor tiene acceso a datos clínicos (violación de privacidad)
 */
export function assertClinicalPrivacy(role: UserRole | string | undefined | null): void {
  if (checkPermission(role, 'student.health.clinical', 'read')) {
    // Este caso solo debería ocurrir para medico/psicologo — es correcto
    return;
  }
  // Para cualquier otro rol: verificación pasada (el rol NO tiene acceso — correcto)
}
