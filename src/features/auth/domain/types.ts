/**
 * @module AuthDomain
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU001, HU002
 * @description Tipos de dominio para la gestión de usuarios, sesiones y permisos RBAC.
 */

export type UserRole = 'tutor' | 'estudiante' | 'psicologo' | 'medico' | 'administrador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  institutionId: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expires: string;
  needsConsent: boolean;
}

export interface LoginResponse {
  success: boolean;
  session?: AuthSession;
  error?: string;
  attemptsRemaining?: number;
  lockoutExpiry?: string; // ISO date string
}

export interface LoginDto {
  email: string;
  password: string;
  matricula?: string; // Para login de alumnos
}

// ─────────────────────────────────────────────────────
// HU002 — RBAC: Tipos de Permisos
// ─────────────────────────────────────────────────────

/**
 * Recursos protegidos del sistema.
 * Clave de referencia en la matriz RBAC (rbac.config.ts).
 * @privacy student.health.clinical → NUNCA accesible por rol 'tutor'
 */
export type ResourceKey =
  | 'student.health.clinical'    // Diagnóstico clínico — SOLO medico/psicologo
  | 'student.health.operational' // Etiqueta operativa — tutor puede leer
  | 'alert.view'                 // Todos los roles autenticados
  | 'alert.close'                // tutor y administrador
  | 'audit.view'                 // Solo administrador
  | 'referral.create'            // tutor y administrador
  | 'referral.accept'            // psicologo y administrador
  | 'report.generate';           // Solo administrador

/** Acciones posibles sobre un recurso */
export type Action = 'read' | 'write';

/** Entrada del mapa de permisos por rol */
export type RBACMap = Partial<Record<ResourceKey, Action[]>>;

/** TODO: conectar a GET /auth/permissions cuando el backend lo exponga */
export interface PermissionsResponse {
  role: UserRole;
  permissions: Array<{ resource: ResourceKey; actions: Action[] }>;
}
