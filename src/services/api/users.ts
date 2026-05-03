import { api } from '@/src/lib/api';

/**
 * @module UserService
 * @epic EPICA-6 Panel Ejecutivo
 * @hu HU002, HU023
 * @description Gestión de usuarios y roles del sistema.
 */

export type UserRole = 'ADMIN' | 'DOCENTE' | 'MEDICO' | 'PSICOLOGO' | 'ALUMNO';

export interface User {
  uid: string;
  nombre: string;
  email?: string;
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
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  /**
   * Crea un nuevo usuario en el sistema.
   */
  create: async (user: CreateUserDto): Promise<User> => {
    // Limpieza de payload según rol para cumplir con Swagger
    const payload: any = {
      nombre: user.nombre,
      password: user.password,
      role: user.role,
    };

    if (user.role === 'ALUMNO') {
      payload.matricula = user.matricula;
      // No enviar email para alumnos
    } else {
      payload.email = user.email;
      // No enviar matricula para personal
    }

    const { data } = await api.post('/users', payload);
    return data;
  },

  /**
   * Actualiza un usuario existente.
   */
  update: async (uid: string, user: Partial<CreateUserDto>): Promise<User> => {
    // Limpieza de payload para actualización
    const payload: any = { ...user };
    
    // Si la contraseña está vacía, no la enviamos
    if (!payload.password) {
      delete payload.password;
    }

    // Asegurar que no enviamos campos cruzados según el rol actual o nuevo
    if (payload.role === 'ALUMNO') {
      delete payload.email;
    } else if (payload.role) {
      delete payload.matricula;
    }

    const { data } = await api.patch(`/users/${uid}`, payload);
    return data;
  },

  /**
   * Elimina un usuario.
   */
  delete: async (uid: string): Promise<void> => {
    await api.delete(`/users/${uid}`);
  }
};
