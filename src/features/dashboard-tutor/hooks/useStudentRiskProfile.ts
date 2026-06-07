/**
 * @module useStudentRiskProfile
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU004, HU007
 * @ux UXDT-06 a UXDT-10
 * @qa QA-01 (privacidad diferencial) · QA-03 (sin diagnosticoClinico en DOM del Tutor)
 * @api GET /students/:id/risk-profile · GET /students/:id/academic-history · GET /questionnaire/alumno/:uid
 * @privacy Aplica filterHealthByRole() y sanitización de evaluaciones.
 *          El tutor NUNCA ve scores de riesgo numéricos (riesgo_pct) en las evaluaciones.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStudentRiskProfile, getStudentAcademicHistory } from '@/src/services/api/students';
import { surveyService } from '@/src/features/student-survey/services/survey.service';
import { useSession } from 'next-auth/react';
import type { StudentRiskProfile, AcademicHistory } from '@/src/types/student';
import { EvaluationItem } from '@/src/types/questionnaire';
import type { UserRole } from '@/src/features/auth/domain/types';
import { canAccess } from '@/src/lib/privacyGuard';

interface UseStudentRiskProfileReturn {
  profile: StudentRiskProfile | null;
  academicHistory: AcademicHistory | null;
  evaluations: EvaluationItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook para obtener el perfil de riesgo y evaluaciones de un estudiante para el Tutor.
 * Aplica privacidad diferencial defensiva para el rol DOCENTE.
 */
export function useStudentRiskProfile(studentId: string): UseStudentRiskProfileReturn {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<StudentRiskProfile | null>(null);
  const [academicHistory, setAcademicHistory] = useState<AcademicHistory | null>(null);
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    setError(null);

    try {
      const [rawProfile, history, rawEvaluations] = await Promise.all([
        getStudentRiskProfile(studentId),
        getStudentAcademicHistory(studentId),
        surveyService.getEvaluacionesAlumno(studentId).catch(() => [] as EvaluationItem[]),
      ]);

      // ⚠️ Segunda capa de privacidad: verificar acceso a datos clínicos y scores.
      const role = (session?.user as { role?: string })?.role as UserRole | undefined;
      const canSeeClinical = canAccess(role, 'student.health.clinical', 'read');

      // Sanitizar perfil de riesgo
      const safeProfile: StudentRiskProfile = canSeeClinical
        ? rawProfile
        : {
            ...rawProfile,
            salud: {
              semaforoEstado: rawProfile.salud.semaforoEstado,
              recomendacionOperativa: rawProfile.salud.recomendacionOperativa,
            },
          };

      // ⚠️ Sanitización defensiva de evaluaciones del tutor: Excluir riesgo_pct
      const safeEvaluations = rawEvaluations.map(item => {
        if (canSeeClinical) return item;
        return {
          ...item,
          resultado: item.resultado ? {
            semaforo: item.resultado.semaforo,
            diagnostico: item.resultado.diagnostico
            // riesgo_pct queda omitido por diseño de seguridad
          } : undefined
        };
      });

      setProfile(safeProfile);
      setAcademicHistory(history);
      setEvaluations(safeEvaluations);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      setError(err.message || 'No se pudo cargar el perfil del estudiante.');
    } finally {
      setIsLoading(false);
    }
  }, [studentId, session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    profile, 
    academicHistory, 
    evaluations, 
    isLoading, 
    error, 
    refetch: fetchData 
  };
}
