/**
 * @module MedicalService
 * @epic Épica 4 — Módulo Médico con Privacidad Diferencial
 * @hu HU009, HU010
 * @description Servicio de comunicación con el backend para datos clínicos.
 */

import {
  MedicalCondition,
  BulkHealthRegisterRequest,
  BulkHealthEntry,
  HealthProfileMedico,
  HealthProfileTutor,
  ProlongedAlertRequest
} from '@/src/features/medico/types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


export const medicalService = {
  /**
   * Obtiene el catálogo de condiciones clínicas.
   * @hu HU009
   */
  getConditions: async (): Promise<MedicalCondition[]> => {
    // TODO: conectar a GET /api/medical/conditions cuando esté disponible
    await new Promise(resolve => setTimeout(resolve, 600)); // Simular latencia

    return [
      {
        id: 'c1',
        name: 'Miopía severa',
        category: 'visual',
        operativeTag: 'Apoyo visual requerido',
        suggestedStatus: 'amarillo'
      },
      {
        id: 'c2',
        name: 'Fractura de miembro inferior',
        category: 'física',
        operativeTag: 'Dificultad de movilidad temporal',
        suggestedStatus: 'rojo',
        requiresProlongedAlert: true
      },
      {
        id: 'c3',
        name: 'Diabetes tipo 1 controlada',
        category: 'otra',
        operativeTag: 'Seguimiento de salud preventivo',
        suggestedStatus: 'verde'
      },
      {
        id: 'c4',
        name: 'Trastorno de ansiedad',
        category: 'psicológica',
        operativeTag: 'Seguimiento por bienestar emocional',
        suggestedStatus: 'amarillo'
      }
    ];
  },

  /**
   * Obtiene la lista de estudiantes para checklist por grupo.
   * @hu HU009
   */
  getStudentsByGroup: async (groupId: string): Promise<BulkHealthEntry[]> => {
    // TODO: conectar a GET /api/medical/students?group=:id
    await new Promise(resolve => setTimeout(resolve, 800));

    return [
      {
        studentId: 's1',
        studentName: 'Ana García López',
        matricula: '20230001',
        selectedConditions: [],
        existingRecord: false
      },
      {
        studentId: 's2',
        studentName: 'Carlos Ruiz Méndez',
        matricula: '20230002',
        selectedConditions: ['c1'],
        existingRecord: true
      },
      {
        studentId: 's3',
        studentName: 'Berenice Torres',
        matricula: '20230003',
        selectedConditions: [],
        existingRecord: false
      }
    ];
  },

  /**
   * Registra masivamente los resultados de la jornada de salud.
   * @hu HU009
   */
  bulkRegister: async (payload: BulkHealthRegisterRequest): Promise<{ success: boolean; count: number }> => {
    // TODO: conectar a POST /api/medical/bulk-register
    console.log("Enviando registro masivo:", payload);
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      count: payload.entries.length
    };
  },

  /**
   * Obtiene el perfil de salud de un estudiante con privacidad diferencial.
   */
  async getStudentHealth(studentId: string, role: string): Promise<HealthProfileMedico | HealthProfileTutor> {

    await delay(800);

    // Mock de datos base
    const baseData = {
      studentId,
      recomendacionOperativa: 'Seguimiento activo recomendado',
      semaforoEstado: 'amarillo' as const,
      lastUpdate: new Date().toISOString(),
    };

    if (role === 'medico' || role === 'psicologo') {
      return {
        ...baseData,
        diagnosticoClinico: 'TDAH con hiperactividad leve', // DATO SENSIBLE
      } as HealthProfileMedico;
    }


    // Para Tutor, NUNCA incluimos el campo sensible
    return baseData as HealthProfileTutor;
  },

  /**
   * Actualiza el perfil de salud (Solo Médicos).
   */
  async updateStudentHealth(studentId: string, data: Partial<HealthProfileMedico>): Promise<boolean> {

    await delay(1200);
    console.log(`[API Mock] Actualizando salud para ${studentId}:`, data);
    return true;
  },

  /**
   * Genera alerta de impacto prolongado al tutor (Solo Médicos).
   * @hu HU011
   */
  async sendProlongedAlert(studentId: string, data: ProlongedAlertRequest): Promise<boolean> {
    // TODO: conectar a POST /api/medical/students/:id/prolonged-alert
    await delay(1500);
    console.log(`[API Mock] Generando alerta prolongada para ${studentId}:`, data);
    return true;
  }
};
