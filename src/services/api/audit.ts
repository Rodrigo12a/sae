/**
 * @module AuditService
 * @epic EPICA-8 Auditoría y Control de Calidad
 * @hu HU022
 * @api /api/audit
 */

import { 
  MicroSurveyData, 
  MicroSurveyResponse, 
  MicroSurveyStatus, 
  ServiceInconsistency, 
  TutorAuditStats 
} from '@/src/features/auditoria/types';

// TODO: Conectar con el backend real cuando los endpoints estén disponibles.
// URL base: https://sae-backend-theta.vercel.app/api

/**
 * Valida un token de micro-encuesta y obtiene los datos asociados.
 */
export async function getMicroSurvey(token: string): Promise<MicroSurveyStatus> {
  console.log(`[AuditService] Validating token: ${token}`);
  
  // Simulación de delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Simulación de token expirado (ejemplo: token que empieza con 'exp')
  if (token.startsWith('expired')) {
    return {
      id: token,
      status: 'expired'
    };
  }

  // Mock de éxito
  return {
    id: token,
    status: 'pending',
    data: {
      studentName: 'Roberto Gómez',
      tutorName: 'Prof. Mario Casas',
      alertCategory: 'Riesgo Académico Grave',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  };
}

/**
 * Envía las respuestas de la micro-encuesta.
 */
export async function submitMicroSurvey(token: string, data: MicroSurveyResponse): Promise<{ success: boolean }> {
  console.log(`[AuditService] Submitting micro-survey for token: ${token}`, data);
  
  // Simulación de delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { success: true };
}

/**
 * Obtiene la lista de inconsistencias detectadas (Solo Admin).
 */
export async function getInconsistencies(): Promise<ServiceInconsistency[]> {
  console.log('[AuditService] Fetching inconsistencies');
  await new Promise(resolve => setTimeout(resolve, 1200));

  return [
    {
      id: 'inc-001',
      alertId: 'alt-101',
      tutorId: 'tut-001',
      tutorName: 'Prof. Mario Casas',
      studentId: 'est-501',
      studentName: 'Juan Pérez',
      detectedAt: new Date().toISOString(),
      severity: 'critical',
      discrepancyType: 'meeting_denied',
      tutorReported: 'Reunión presencial realizada el 15/04. Se acordó plan de mejora.',
      studentReported: 'El tutor nunca me contactó para la reunión.',
      isResolved: false,
    },
    {
      id: 'inc-002',
      alertId: 'alt-102',
      tutorId: 'tut-002',
      tutorName: 'Dra. Elena Rivas',
      studentId: 'est-502',
      studentName: 'Lucía Méndez',
      detectedAt: new Date(Date.now() - 86400000).toISOString(),
      severity: 'standard',
      discrepancyType: 'low_quality',
      tutorReported: 'Asesoría completa de 45 min.',
      studentReported: 'Fue una charla de 5 minutos en el pasillo, no sentí que fuera una tutoría formal.',
      isResolved: false,
    }
  ];
}

/**
 * Obtiene las estadísticas de auditoría de un tutor.
 */
export async function getTutorAuditStats(tutorId: string): Promise<TutorAuditStats> {
  console.log(`[AuditService] Fetching stats for tutor: ${tutorId}`);
  await new Promise(resolve => setTimeout(resolve, 600));

  const inconsistencies = tutorId === 'tut-001' ? 4 : 1;

  return {
    tutorId,
    tutorName: tutorId === 'tut-001' ? 'Prof. Mario Casas' : 'Dra. Elena Rivas',
    totalInterventions: 25,
    inconsistenciesCount: inconsistencies,
    criticalStatus: inconsistencies >= 3,
    lastDiscrepancyDate: new Date().toISOString(),
  };
}

/**
 * Resuelve o escala una inconsistencia.
 */
export async function resolveInconsistency(id: string, action: 'resolve' | 'escalate'): Promise<{ success: boolean }> {
  console.log(`[AuditService] Resolving inconsistency ${id} with action: ${action}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}
