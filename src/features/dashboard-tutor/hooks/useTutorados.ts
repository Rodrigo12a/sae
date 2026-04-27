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
import {
  getTutorados,
  createTutorado,
  updateTutorado,
} from '@/src/services/api/tutorados';
import type { TutoradoItem, CreateTutoradoRequest, UpdateTutoradoRequest } from '@/src/types/tutorado';

interface UseTutoradosReturn {
  tutorados: TutoradoItem[];
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  submitError: string | null;
  refetch: () => void;
  handleCreate: (data: CreateTutoradoRequest) => Promise<boolean>;
  handleUpdate: (matricula: string, data: UpdateTutoradoRequest) => Promise<boolean>;
}

/**
 * Hook para gestión de cuentas de tutorados (HU007).
 * @privacy Estado del formulario (password) vive en el componente — no en este hook.
 */
export function useTutorados(): UseTutoradosReturn {
  const [tutorados, setTutorados] = useState<TutoradoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchTutorados = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTutorados();
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
  const handleCreate = async (data: CreateTutoradoRequest): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createTutorado(data);
      await fetchTutorados(); // Refrescar la lista
      return true;
    } catch (err) {
      const message = err instanceof Error
        ? (err.message === 'MATRICULA_DUPLICADA'
          ? 'Esta matrícula ya tiene una cuenta registrada.'
          : 'Error al crear la cuenta. Inténtalo de nuevo.')
        : 'Error desconocido.';
      setSubmitError(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /** @returns true si exitoso, false si hubo error */
  const handleUpdate = async (matricula: string, data: UpdateTutoradoRequest): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updateTutorado(matricula, data);
      await fetchTutorados();
      return true;
    } catch {
      setSubmitError('Error al actualizar la contraseña. Inténtalo de nuevo.');
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
  };
}
