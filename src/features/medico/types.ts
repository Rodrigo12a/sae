/**
 * @module MedicalTypes
 * @epic Épica 4 — Módulo Médico con Privacidad Diferencial
 * @hu HU009, HU010, HU011
 * @description Definición de tipos para el módulo médico, incluyendo guardias de privacidad.
 */

import { SemaforoEstado } from '@/src/types/alert';

export type MedicalSemaforoEstado = SemaforoEstado;

export interface MedicalCondition {
  id: string;
  name: string;
  category: 'física' | 'visual' | 'auditiva' | 'psicológica' | 'otra';
  operativeTag: string; // Lo que verá el tutor
  suggestedStatus: MedicalSemaforoEstado;
  requiresProlongedAlert?: boolean;
}

export interface BulkHealthEntry {
  studentId: string;
  studentName: string;
  matricula: string;
  selectedConditions: string[]; // IDs de MedicalCondition
  startDate?: string;
  estimatedDurationDays?: number;
  existingRecord?: boolean; // Flag para HU009 Criterion 2
}

export interface ProlongedAlertRequest {
  startDate: string;
  estimatedDurationDays: number;
  observation: string; // "Reposo médico sugerido", etc.
}

export interface BulkHealthRegisterRequest {
  groupId: string;
  entries: BulkHealthEntry[];
}

/**
 * @privacy Perfil visible solo para Médicos/Psicólogos
 */
export interface HealthProfileMedico {
  studentId: string;
  diagnosticoClinico: string; // ⚠️ DATO SENSIBLE
  recomendacionOperativa: string;
  semaforoEstado: MedicalSemaforoEstado;
  lastUpdate: string;
}

/**
 * @privacy Perfil filtrado para Tutores
 */
export interface HealthProfileTutor {
  studentId: string;
  // diagnosticoClinico: AUSENTE POR PRIVACIDAD
  recomendacionOperativa: string;
  semaforoEstado: MedicalSemaforoEstado;
  lastUpdate: string;
}

