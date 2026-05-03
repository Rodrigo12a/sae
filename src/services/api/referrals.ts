import axios from 'axios';
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sae-backend-theta.vercel.app/api';

/**
 * Servicio para la gestión de derivaciones a especialistas.
 * @epic EPICA-5
 */
export const referralsService = {
  /**
   * Obtiene la capacidad actual del departamento de psicología.
   * @api GET /referrals/capacity/psychology
   */
  getPsychologyCapacity: async (): Promise<DepartmentCapacity> => {
    // Simulamos latencia y saturación aleatoria para pruebas
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      isSaturated: Math.random() > 0.7, // 30% de probabilidad de saturación en mock
      currentLoad: 42,
      maxCapacity: 50,
      estimatedWaitDays: 5
    };
  },

  /**
   * Obtiene el catálogo de motivos de derivación.
   * @api GET /referrals/reasons/psychology
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
    // TODO: Conectar a endpoint real cuando esté disponible
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Referral created:', data);
    
    return {
      id: `ref-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  },

  /**
   * Crea una nueva derivación a servicios médicos.
   * @api POST /referrals/medical
   */
  createMedicalReferral: async (data: MedicalReferralRequest): Promise<ReferralResponse> => {
    // TODO: Conectar a endpoint real cuando esté disponible
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Medical referral created:', data);
    
    return {
      id: `ref-med-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  },

  /**
   * Obtiene la bandeja de casos pendientes de psicología.
   * @api GET /referrals/pending
   */
  getPendingReferrals: async (): Promise<PendingReferral[]> => {
    // TODO: Conectar a endpoint real
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'ref-001',
        studentId: 'stu-001',
        studentName: 'Ana García',
        motivoId: '1',
        descripcionObservable: 'Baja repentina en calificaciones y ausentismo desde hace 2 semanas.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // hace 2 días
        department: 'psychology'
      },
      {
        id: 'ref-002',
        studentId: 'stu-004',
        studentName: 'Luis Rodríguez',
        motivoId: '2',
        descripcionObservable: 'El estudiante muestra irritabilidad durante las asesorías grupales.',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // hace 5 días
        department: 'psychology'
      },
      {
        id: 'ref-003',
        studentId: 'stu-005',
        studentName: 'Sofía Martínez',
        motivoId: '5',
        descripcionObservable: 'Solicitud de apoyo por estrés académico y ansiedad.',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        department: 'psychology',
        aiValidation: {
          isAutoReport: true,
          symptomatologyDetected: true,
          confidence: 0.94
        }
      },
      {
        id: 'ref-004',
        studentId: 'stu-006',
        studentName: 'Roberto Gómez',
        motivoId: '3',
        descripcionObservable: 'El estudiante reporta mareos constantes durante las clases de educación física.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        department: 'medical',
        aiValidation: {
          isAutoReport: false,
          symptomatologyDetected: true,
          confidence: 0.88
        }
      }
    ];
  },

  /**
   * Acepta un caso derivado en la bandeja de psicología.
   * @api PUT /referrals/:id/accept
   */
  acceptReferral: async (data: AcceptReferralRequest): Promise<void> => {
    // TODO: Conectar a endpoint real
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Referral accepted:', data);
  },

  /**
   * Agrega una nota clínica confidencial al caso.
   * @api POST /referrals/:id/notes
   */
  addClinicalNote: async (data: ClinicalNoteRequest): Promise<void> => {
    // TODO: Conectar a endpoint real
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular error aleatorio ocasional para probar Circuit Breaker
    if (Math.random() > 0.9) {
      throw new Error('Network error simulado al guardar bitácora');
    }
    
    console.log('Clinical note saved:', {
      ...data,
      // Recordatorio de privacidad
      _security_note: data.esPrivada ? 'Cifrado requerido en backend' : 'Nota pública'
    });
  }
};
