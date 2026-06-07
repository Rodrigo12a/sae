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
  carreraId?: string;
  tutorId?: string;
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
    // If it's an ALUMNO and we have tutorId/carreraId, use the new /users/alumno-completo endpoint
    if (user.role === 'ALUMNO' && user.carreraId && user.tutorId) {
      const payload = {
        nombre: user.nombre.trim(),
        matricula: user.matricula?.trim(),
        password: user.password,
        role: 'ALUMNO' as UserRole,
        carreraId: user.carreraId,
        tutorId: user.tutorId,
      };
      const { data } = await api.post<User>('/users/alumno-completo', payload);
      return data;
    }

    // Limpieza de payload según rol para cumplir con Swagger: ALUMNO usa matricula, STAFF usa email
    const payload: any = {
      nombre: user.nombre.trim(),
      password: user.password,
      role: user.role,
    };

    if (user.role === 'ALUMNO') {
      payload.matricula = user.matricula?.trim();
    } else {
      if (user.email) {
        payload.email = user.email.trim().toLowerCase();
      }
    }

    if (user.carreraId) {
      payload.carreraId = user.carreraId;
    }

    const { data } = await api.post<User>('/users', payload);
    return data;
  },

  /**
   * Actualiza un usuario existente.
   */
  update: async (uid: string, user: UpdateUserDto): Promise<User> => {
    // Limpieza de payload para actualización parcial
    const payload: any = {};
    
    if (user.nombre) payload.nombre = user.nombre.trim();
    if (user.role) payload.role = user.role;
    
    // El password es opcional en la actualización
    if (user.password && user.password.trim() !== '') {
      payload.password = user.password;
    }

    if (user.role === 'ALUMNO' || (!user.role && user.matricula)) {
      if (user.matricula) payload.matricula = user.matricula.trim();
    } else {
      // Si el rol es staff o no se cambia pero se envía email
      if (user.email) payload.email = user.email.trim().toLowerCase();
    }

    if (user.carreraId !== undefined) {
      payload.carreraId = user.carreraId;
    }

    const { data } = await api.patch<User>(`/users/${uid}`, payload);
    return data;
  },

  /**
   * Elimina un usuario.
   */
  delete: async (uid: string): Promise<void> => {
    await api.delete(`/users/${uid}`);
  },

  /**
   * Obtiene un usuario por su UID.
   * @api GET /users/{id}
   */
  getById: async (uid: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${uid}`);
    return data;
  },

  /**
   * Obtiene la lista de alumnos tutorados para el docente autenticado.
   * @api GET /users/tutor/tutorados
   */
  getTutorados: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users/tutor/tutorados');
    return data;
  }
};
