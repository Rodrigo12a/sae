/**
 * @module MedicalService
 * @epic Épica 4 — Módulo Médico con Privacidad Diferencial
 * @hu HU009, HU010
 * @description Servicio de comunicación con el backend para datos clínicos.
 */

import { api } from '@/src/lib/api';
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
    const { data } = await api.get('/medical/conditions');
    return data;
  },

  /**
   * Obtiene la lista de estudiantes para checklist por grupo.
   * @hu HU009
   */
  getStudentsByGroup: async (groupId: string): Promise<BulkHealthEntry[]> => {
    const { data } = await api.get('/medical/students', {
      params: { group: groupId }
    });
    return data;
  },

  /**
   * Registra masivamente los resultados de la jornada de salud.
   * @hu HU009
   */
  bulkRegister: async (payload: BulkHealthRegisterRequest): Promise<{ success: boolean; count: number }> => {
    const { data } = await api.post('/medical/bulk-register', payload);
    return data;
  },

  /**
   * Obtiene el perfil de salud de un estudiante con privacidad diferencial.
   */
  async getStudentHealth(studentId: string, role: string): Promise<HealthProfileMedico | HealthProfileTutor> {
    const { data } = await api.get(`/medical/students/${studentId}`, {
      params: { role }
    });
    return data;
  },

  /**
   * Actualiza el perfil de salud (Solo Médicos).
   */
  async updateStudentHealth(studentId: string, data: Partial<HealthProfileMedico>): Promise<boolean> {
    await api.patch(`/medical/students/${studentId}`, data);
    return true;
  },

  /**
   * Genera alerta de impacto prolongado al tutor (Solo Médicos).
   * @hu HU011
   */
  async sendProlongedAlert(studentId: string, data: ProlongedAlertRequest): Promise<boolean> {
    await api.post(`/medical/students/${studentId}/prolonged-alert`, data);
    return true;
  }
};
