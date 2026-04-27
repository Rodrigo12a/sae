/**
 * @module AuditoriaTypes
 * @epic EPICA-8 Auditoría y Control de Calidad
 * @hu HU022, HU023
 */

export interface MicroSurveyData {
  studentName: string;
  tutorName: string;
  alertCategory: string;
  expiresAt: string;
}

export interface MicroSurveyResponse {
  wasIntervened: boolean;
  helpfulnessScore: number; // 1-5
  comments?: string;
}

export interface MicroSurveyStatus {
  id: string;
  status: 'pending' | 'completed' | 'expired';
  data?: MicroSurveyData;
}

export interface ServiceInconsistency {
  id: string;
  alertId: string;
  tutorId: string;
  tutorName: string;
  studentId: string;
  studentName: string;
  detectedAt: string;
  severity: 'standard' | 'critical';
  discrepancyType: 'meeting_denied' | 'low_quality' | 'no_response';
  tutorReported: string;
  studentReported: string;
  isResolved: boolean;
}

export interface TutorAuditStats {
  tutorId: string;
  tutorName: string;
  totalInterventions: number;
  inconsistenciesCount: number;
  criticalStatus: boolean; // true if inconsistenciesCount >= 3
  lastDiscrepancyDate?: string;
}
