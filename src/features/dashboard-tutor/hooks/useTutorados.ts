/**
 * @module useTutorados
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU007
 * @api GET /tutor/tutorados · POST /tutor/tutorados · PUT /tutor/tutorados/:matricula
 * @privacy ⚠️ Este hook NO almacena contraseñas en estado global.
 *          El estado del formulario (con password) vive en el componente hoja — no aquí.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/src/services/api/users';
import type { User, CreateUserDto } from '@/src/services/api/users';
import type { CreateTutoradoRequest, UpdateTutoradoRequest } from '@/src/types/tutorado';

interface UseTutoradosReturn {
  tutorados: User[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  submitError: string | null;
  refetch: () => void;
  handleCreate: (data: CreateUserDto) => Promise<boolean>;
  handleUpdate: (id: string, data: Partial<CreateUserDto>) => Promise<boolean>;
  handleDelete: (id: string) => Promise<boolean>;
}

/**
 * Hook para gestión de cuentas de tutorados (HU007).
 * @privacy Estado del formulario (password) vive en el componente — no en este hook.
 */
export function useTutorados(): UseTutoradosReturn {
  const [tutorados, setTutorados] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchTutorados = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      // El backend ya filtra por tutorados si el rol es DOCENTE
      setTutorados(data);
    } catch {
      setError('No se pudo cargar la lista de tutorados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTutorados();
  }, [fetchTutorados]);

  /** @returns true si exitoso, false si hubo error */
  const handleCreate = async (data: CreateUserDto): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await userService.create(data);
      await fetchTutorados(); 
      return true;
    } catch (err: any) {
      const message = err.response?.status === 409
        ? 'Esta matrícula o correo ya tiene una cuenta registrada.'
        : 'Error al crear el estudiante.';
      setSubmitError(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /** @returns true si exitoso, false si hubo error */
  const handleUpdate = async (id: string, data: Partial<CreateUserDto>): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await userService.update(id, data);
      await fetchTutorados();
      return true;
    } catch {
      setSubmitError('Error al actualizar los datos del estudiante.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /** @returns true si exitoso, false si hubo error */
  const handleDelete = async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await userService.delete(id);
      await fetchTutorados();
      return true;
    } catch {
      setSubmitError('No se pudo eliminar al estudiante.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    tutorados,
    isLoading,
    error,
    isSubmitting,
    submitError,
    refetch: fetchTutorados,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
