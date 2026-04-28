/**
 * @module useStudentProfile
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU004
 * @description Hook para obtener el perfil básico de un estudiante.
 *              Este hook es utilizado por el componente StudentExpediente.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStudentRiskProfile } from '@/src/services/api/students';
import type { StudentRiskProfile } from '@/src/types/student';
import type { SemaforoEstado } from '@/src/types/alert';

interface UseStudentProfileReturn {
  data: (StudentRiskProfile & { semaforoEstado: SemaforoEstado }) | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Determina el estado global del semáforo basado en las dimensiones de riesgo.
 * Prioridad: rojo > amarillo > revisar > verde > sin-datos.
 */
function calculateGlobalSemaforo(profile: StudentRiskProfile): SemaforoEstado {
  const states: SemaforoEstado[] = [
    profile.academico.semaforoEstado,
    profile.socioeconomico.semaforoEstado,
    profile.salud.semaforoEstado,
  ];

  if (states.includes('rojo')) return 'rojo';
  if (states.includes('amarillo')) return 'amarillo';
  if (states.includes('revisar')) return 'revisar';
  if (states.includes('verde')) return 'verde';
  return 'sin-datos';
}

export function useStudentProfile(studentId: string): UseStudentProfileReturn {
  const [data, setData] = useState<(StudentRiskProfile & { semaforoEstado: SemaforoEstado }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    setError(null);

    try {
      const profile = await getStudentRiskProfile(studentId);
      const semaforoEstado = calculateGlobalSemaforo(profile);
      
      setData({
        ...profile,
        semaforoEstado,
      });
    } catch (err) {
      setError('No se pudo cargar el perfil del estudiante.');
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, isLoading, error, refetch: fetchProfile };
}
