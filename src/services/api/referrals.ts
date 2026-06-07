/**
 * @module ReferralsService
 * @epic EPICA-5 Derivaciones
 * @hu HU012, HU013, HU014, HU015
 * @ux UXDE-01 to UXDE-08
 * @api GET /referrals/capacity/psychology · POST /referrals/psychology · POST /referrals/medical · GET /referrals/pending · PUT /referrals/{id}/accept · POST /referrals/{id}/notes
 * @privacy aiValidation.confidence es visible únicamente para el rol PSICOLOGO.
 */

import { api } from '@/src/lib/api';
import { 
  PsychologyReferralRequest, 
  MedicalReferralRequest,
  DepartmentCapacity, 
  ReferralReason, 
  ReferralResponse,
  PendingReferral,
  AcceptReferralRequest,
  ClinicalNoteRequest
} from '@/src/features/derivaciones/types';

export const referralsService = {
  /**
   * Obtiene la capacidad actual del departamento de psicología.
   * @api GET /referrals/capacity/psychology
   */
  getPsychologyCapacity: async (): Promise<DepartmentCapacity> => {
    try {
      const response = await api.get<DepartmentCapacity>('/referrals/capacity/psychology');
      return response.data;
    } catch (error) {
      console.warn("Referrals API: getPsychologyCapacity fallback to mock", error);
      return {
        isSaturated: false,
        currentLoad: 12,
        maxCapacity: 20,
        estimatedWaitDays: 5
      };
    }
  },

  /**
   * Obtiene el catálogo de motivos de derivación.
   * Catalogado estático del frontend.
   */
  getReferralReasons: async (): Promise<ReferralReason[]> => {
    return [
      { id: '1', label: 'Bajo rendimiento académico persistente' },
      { id: '2', label: 'Cambios bruscos de conducta' },
      { id: '3', label: 'Inasistencias injustificadas' },
      { id: '4', label: 'Dificultades en relaciones interpersonales' },
      { id: '5', label: 'Solicitud explícita del estudiante' },
      { id: 'other', label: 'Otro (especificar en descripción)' },
    ];
  },

  /**
   * Crea una nueva derivación a psicología.
   * @api POST /referrals/psychology
   */
  createPsychologyReferral: async (data: PsychologyReferralRequest): Promise<ReferralResponse> => {
    const response = await api.post<ReferralResponse>('/referrals/psychology', data);
    return response.data;
  },

  /**
   * Crea una nueva derivación a servicios médicos.
   * @api POST /referrals/medical
   */
  createMedicalReferral: async (data: MedicalReferralRequest): Promise<ReferralResponse> => {
    const response = await api.post<ReferralResponse>('/referrals/medical', data);
    return response.data;
  },

  /**
   * Obtiene la bandeja de casos pendientes de psicología/medicina.
   * @api GET /referrals/pending
   */
  getPendingReferrals: async (): Promise<PendingReferral[]> => {
    try {
      const response = await api.get<PendingReferral[]>('/referrals/pending');
      return response.data;
    } catch (error) {
      console.warn("Referrals API: getPendingReferrals fallback to mock", error);
      return [
        {
          id: 'ref-001',
          studentId: 'stu-001',
          studentName: 'Ana García',
          motivoId: '1',
          descripcionObservable: 'Baja repentina en calificaciones y ausentismo desde hace 2 semanas.',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          department: 'psychology'
        }
      ];
    }
  },

  /**
   * Acepta un caso derivado en la bandeja de psicología/medicina.
   * @api PUT /referrals/:id/accept
   */
  acceptReferral: async (data: AcceptReferralRequest): Promise<void> => {
    await api.put(`/referrals/${data.referralId}/accept`, data);
  },

  /**
   * Agrega una nota clínica confidencial al caso.
   * @api POST /referrals/:id/notes
   */
  addClinicalNote: async (data: ClinicalNoteRequest): Promise<void> => {
    await api.post(`/referrals/${data.referralId}/notes`, data);
  }
};
