/**
 * @module AdminTypes
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU016
 * @privacy ⚠️ Esta capa NO DEBE contener el campo diagnosticoClinico ni datos individuales. Solo datos agregados.
 */

export interface CareerRiskComparison {
  careerId: string;
  careerName: string;
  riskIndex: number; // 0-100
}

export interface AdminKPIs {
  riesgoGlobal: number;         // Índice 0-100
  alertasAtendidas: number;
  alertasIgnoradas: number;
  comparativaPorCarrera: CareerRiskComparison[];
  carrerasActivas: { id: string; nombre: string; materias: string[] }[];
  dataFreshness: string;        // ISO timestamp — para badge de frescura
  latencyMs: number;            // Si > 300000ms (5min), badge de advertencia
}

export interface KPIFilters {
  careerId?: string;
  semester?: number;
}

export interface DrillDownRequest {
  careerId: string;
  semester?: number;
}

export interface DrillDownStudent {
  id: string;
  name: string;
  semester: number;
  etiquetaOperativa: string; // Sin diagnóstico clínico
  semaforoEstado: 'rojo' | 'amarillo' | 'verde' | 'revisar' | 'sin-datos';
  predominantVariables: string[]; // Ej: ['Bajo rendimiento', 'Ausentismo']
  // No exponemos datos clínicos ni diagnosticos sensibles.
}

export interface DrillDownResponse {
  careerId: string;
  careerName: string;
  totalStudentsAtRisk: number;
  students: DrillDownStudent[];
}

export type ExportFormat = 'pdf' | 'excel';

export interface ExportRequest {
  format: ExportFormat;
  filters: KPIFilters;
}

export interface ExportResponse {
  status: 'ready' | 'processing';
  downloadUrl?: string;
  message?: string;
}
