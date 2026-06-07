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
import { useSession } from 'next-auth/react';
import { getAdminCarreras, getCarreraAlumnos } from '@/src/services/api/admin';

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
  const { data: session } = useSession();
  const [tutorados, setTutorados] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchTutorados = useCallback(async () => {
    if (!session?.user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getTutorados();
      setTutorados(data);
    } catch (err) {
      console.error('Error fetching tutorados in hook:', err);
      setError('No se pudo cargar la lista de tutorados.');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchTutorados();
  }, [fetchTutorados]);

  /** @returns true si exitoso, false si hubo error */
  const handleCreate = async (data: CreateUserDto & { carreraId?: string; tutorId?: string }): Promise<boolean> => {
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
