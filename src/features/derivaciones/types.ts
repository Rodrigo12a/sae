/**
 * @module ReferralsTypes
 * @epic EPICA-5 Derivaciones y Atención Especializada
 * @hu HU012
 * @privacy rol:tutor -> sin datos clínicos. La descripción es "observable".
 */

export interface PsychologyReferralRequest {
  studentId: string;
  alertId?: string; // Opcional si la derivación viene de una alerta específica
  motivoId: string;
  descripcionObservable: string;
}

export interface MedicalReferralRequest {
  studentId: string;
  alertId?: string; // Opcional si la derivación viene de una alerta específica
  descripcionObservable: string;
}

export interface DepartmentCapacity {
  isSaturated: boolean;
  currentLoad: number;
  maxCapacity: number;
  estimatedWaitDays: number;
}

export interface ReferralReason {
  id: string;
  label: string;
  description?: string;
}

export interface ReferralResponse {
  id: string;
  status: 'pending' | 'attending' | 'completed';
  createdAt: string;
}

/**
 * Representa una derivación pendiente en la bandeja del psicólogo.
 * El psicólogo tiene permisos para visualizar expediente clínico.
 */
export interface PendingReferral {
  id: string;
  studentId: string;
  studentName: string;
  motivoId: string;
  descripcionObservable: string;
  createdAt: string;
  department: 'psychology' | 'medical';
  /** Metadata del Motor de IA (HU021) */
  aiValidation?: {
    isAutoReport: boolean;
    symptomatologyDetected: boolean;
    confidence: number;
  };
}

/**
 * Payload para aceptar un caso derivado.
 */
export interface AcceptReferralRequest {
  referralId: string;
  motivoAceptacion: string;
}

/**
 * Payload para registrar una nota clínica.
 */
export interface ClinicalNoteRequest {
  referralId: string;
  contenido: string;
  esPrivada: boolean;
  recomendacionOperativa?: string;
}

