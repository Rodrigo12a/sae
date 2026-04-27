import { api } from '@/src/lib/api';

/**
 * @module UserService
 * @epic EPICA-6 Panel Ejecutivo
 * @hu HU002, HU023
 * @description Gestión de usuarios y roles del sistema.
 */

export type UserRole = 'ADMIN' | 'DOCENTE' | 'MEDICO' | 'PSICOLOGO' | 'ALUMNO';

export interface User {
  id: string;
  nombre: string;
  email: string;
  role: UserRole;
  matricula?: string;
  createdAt: string;
}

export interface CreateUserDto {
  nombre: string;
  email?: string;
  password?: string;
  role: UserRole;
  matricula?: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export const userService = {
  /**
   * Obtiene la lista de todos los usuarios del sistema.
   */
  getAll: async (): Promise<User[]> => {
    // TODO: conectar a GET /users cuando el backend tenga el endpoint de listado
    // return api.get<User[]>('/users').then(res => res.data);
    
    // Mock temporal para desarrollo de UI
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { id: '1', nombre: 'Rodrigo Admin', email: 'admin@sae.edu', role: 'ADMIN', createdAt: '2026-01-01' },
      { id: '2', nombre: 'Ana García', email: 'ana.garcia@sae.edu', role: 'DOCENTE', createdAt: '2026-02-15' },
      { id: '3', nombre: 'Carlos Médico', email: 'carlos.medico@sae.edu', role: 'MEDICO', createdAt: '2026-03-10' },
      { id: '4', nombre: 'Sofía Psicóloga', email: 'sofia.psi@sae.edu', role: 'PSICOLOGO', createdAt: '2026-03-20' },
      { id: '5', nombre: 'Juan Estudiante', email: 'juan.est@sae.edu', role: 'ALUMNO', matricula: '20230001', createdAt: '2026-04-01' },
    ];
  },

  /**
   * Crea un nuevo usuario en el sistema.
   */
  create: async (data: CreateUserDto): Promise<User> => {
    return api.post<User>('/users', data).then(res => res.data);
  },

  /**
   * Actualiza un usuario existente.
   */
  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    return api.patch<User>(`/users/${id}`, data).then(res => res.data);
  },

  /**
   * Elimina un usuario.
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`/users/${id}`).then(res => res.data);
  }
};
