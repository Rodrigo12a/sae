/**
 * @module StudentTypes
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU003, HU004
 * @ux UXDT-06, UXDT-07, UXDT-08, UXDT-09, UXDT-10
 * @qa QA-01, QA-03
 * @privacy ⚠️ REGLA INVIOLABLE: DimensionSaludTutor NUNCA contiene diagnosticoClinico.
 *          El backend filtra por JWT — este tipo es la segunda capa defensiva.
 * @description Contratos TypeScript para perfiles de riesgo estudiantil (vista Tutor).
 */

import type { SemaforoEstado, AlertHistoryItem } from './alert';

// ─────────────────────────────────────────────────────────────────────────────
// Dimensiones de riesgo
// ─────────────────────────────────────────────────────────────────────────────

/** Dimensión de riesgo genérica (Académico, Socioeconómico) */
export interface DimensionRiesgo {
  semaforoEstado: SemaforoEstado;
  etiquetaOperativa: string;      // Del catálogo configurable
}

/**
 * Dimensión de salud — EXCLUSIVA PARA EL ROL TUTOR.
 * @privacy diagnosticoClinico: CAMPO PROHIBIDO EN ESTE TIPO.
 *          Sólo el rol medico/psicologo accede al diagnóstico completo.
 *          El tutor ve ÚNICAMENTE la etiqueta operativa traducida + semáforo.
 */
export interface DimensionSaludTutor {
  semaforoEstado: SemaforoEstado;
  recomendacionOperativa: string;   // Etiqueta del catálogo — NO diagnóstico clínico
  // diagnosticoClinico: CAMPO PROHIBIDO — ausente por diseño tipado
}

// ─────────────────────────────────────────────────────────────────────────────
// HU004 — Perfil de riesgo del estudiante (vista Tutor)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Perfil holístico del estudiante para el Tutor.
 * @privacy El campo `salud` usa DimensionSaludTutor — sin acceso a datos clínicos.
 */
export interface StudentRiskProfile {
  id: string;
  name: string;
  photo?: string;                   // Opcional — fallback a iniciales
  matricula: string;
  carrera: string;
  semestre: number;
  tutor: string;                    // Nombre del tutor asignado
  academico: DimensionRiesgo;
  socioeconomico: DimensionRiesgo;
  salud: DimensionSaludTutor;       // ⚠️ Tipo específico sin datos clínicos
  alertHistory: AlertHistoryItem[];
  encuestaCompletada: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// HU004 — Historial académico (gráficas Recharts)
// ─────────────────────────────────────────────────────────────────────────────

/** Punto de dato de asistencia mensual para gráfica de líneas */
export interface AsistenciaMensual {
  mes: string;                      // Ej: "Ene", "Feb", "Mar"
  porcentaje: number;               // 0-100
}

/** Calificación por materia para gráfica de barras */
export interface CalificacionMateria {
  materia: string;                  // Nombre corto de la materia
  promedio: number;                 // Escala 0-100
}

/** Historial académico completo del estudiante */
export interface AcademicHistory {
  studentId: string;
  asistencia: AsistenciaMensual[];
  calificaciones: CalificacionMateria[];
  promedioGeneral: number;
  asistenciaGeneral: number;
}
