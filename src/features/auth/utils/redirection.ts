/**
 * @module redirection
 * @description Utilidades centralizadas para gestionar las rutas de destino por rol.
 */

import { UserRole } from "../domain/types";

/**
 * Mapa oficial de rutas de landing por rol según design.md
 */
export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  tutor: '/tutor/dashboard',
  administrador: '/admin/dashboard',
  psicologo: '/psicologo/bandeja',
  medico: '/medico/jornada',
  estudiante: '/estudiante/encuesta',
};

/**
 * Obtiene la ruta de destino para un rol específico.
 * @param role Rol del usuario autenticado
 * @returns Ruta de la página de inicio correspondiente
 */
export const getDashboardByRole = (role: UserRole | string | undefined | null): string => {
  if (!role) return ROLE_DASHBOARDS.tutor;
  
  const normalizedRole = role.toLowerCase();
  
  // Mapeo de alias a roles canónicos
  if (normalizedRole === 'admin') return ROLE_DASHBOARDS.administrador;
  if (normalizedRole === 'psychologist') return ROLE_DASHBOARDS.psicologo;
  if (normalizedRole === 'doctor') return ROLE_DASHBOARDS.medico;
  if (normalizedRole === 'student') return ROLE_DASHBOARDS.estudiante;
  
  return ROLE_DASHBOARDS[normalizedRole as UserRole] || ROLE_DASHBOARDS.tutor;
};
