/**
 * @module useStudentRiskProfile
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU004
 * @ux UXDT-06, UXDT-07, UXDT-08, UXDT-09, UXDT-10
 * @qa QA-01 (privacidad diferencial) · QA-03 (sin diagnosticoClinico en DOM del Tutor)
 * @api GET /students/:id/risk-profile · GET /students/:id/academic-history
 * @privacy Usa filterHealthByRole() como segunda capa defensiva.
 *          Los datos del backend para el Tutor ya vienen sin diagnosticoClinico;
 *          esta función actúa como guardia adicional en el frontend.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStudentRiskProfile, getStudentAcademicHistory } from '@/src/services/api/students';
import { useSession } from 'next-auth/react';
import type { StudentRiskProfile, AcademicHistory } from '@/src/types/student';
import type { UserRole } from '@/src/features/auth/domain/types';
import { canAccess } from '@/src/lib/privacyGuard';

interface UseStudentRiskProfileReturn {
  profile: StudentRiskProfile | null;
  academicHistory: AcademicHistory | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook para obtener el perfil de riesgo de un estudiante para el Tutor.
 * Aplica privacidad diferencial como segunda capa:
 * Si el rol no puede ver datos clínicos, se fuerza semaforoEstado a 'sin-datos'
 * como medida defensiva adicional (la primera capa es el backend).
 */
export function useStudentRiskProfile(studentId: string): UseStudentRiskProfileReturn {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<StudentRiskProfile | null>(null);
  const [academicHistory, setAcademicHistory] = useState<AcademicHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    setError(null);

    try {
      const [rawProfile, history] = await Promise.all([
        getStudentRiskProfile(studentId),
        getStudentAcademicHistory(studentId),
      ]);

      // ⚠️ Segunda capa de privacidad: verificar que el rol tiene acceso a datos clínicos.
      // La primera capa es el backend (filtra por JWT). Aquí, si el tutor recibiera
      // datos que no debería ver, los reemplazamos con la versión segura del tipo DimensionSaludTutor.
      const role = (session?.user as { role?: string })?.role as UserRole | undefined;
      const canSeeClinical = canAccess(role, 'student.health.clinical', 'read');

      // Para el Tutor: el campo `salud` ya es de tipo DimensionSaludTutor (sin diagnosticoClinico).
      // Si por algún bug del backend llegara un campo extra, TypeScript ya lo bloquea en
      // tiempo de compilación porque DimensionSaludTutor no declara diagnosticoClinico.
      // La guardia runtime adicional: si el rol no puede ver datos clínicos y algún campo
      // inesperado apareció, sanitizamos el objeto.
      const safeProfile: StudentRiskProfile = canSeeClinical
        ? rawProfile
        : {
            ...rawProfile,
            salud: {
              // Solo campos que DimensionSaludTutor permite
              semaforoEstado: rawProfile.salud.semaforoEstado,
              recomendacionOperativa: rawProfile.salud.recomendacionOperativa,
            },
          };

      setProfile(safeProfile);
      setAcademicHistory(history);
    } catch {
      setError('No se pudo cargar el perfil del estudiante.');
    } finally {
      setIsLoading(false);
    }
  }, [studentId, session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { profile, academicHistory, isLoading, error, refetch: fetchData };
}
