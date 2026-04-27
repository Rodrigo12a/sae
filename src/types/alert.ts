/**
 * @module AlertTypes
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU003, HU004, HU005, HU006
 * @ux UXDT-01, UXDT-02, UXDT-03, UXDT-04, UXDT-11, UXDT-12, UXDT-13, UXDT-14, UXDT-15
 * @qa QA-01, QA-05
 * @privacy Tipos del Tutor: NUNCA incluyen score numérico ni diagnosticoClinico
 * @description Contratos TypeScript para el sistema de alertas de riesgo estudiantil.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Tipos base del sistema de semáforo
// ─────────────────────────────────────────────────────────────────────────────

/** Estado visual del semáforo. Siempre acompañado de ícono + texto — NUNCA solo color. */
export type SemaforoEstado = 'rojo' | 'amarillo' | 'verde' | 'revisar' | 'sin-datos';

/** Estado del Motor de IA externo. Determina si mostrar el modo degradado. */
export type AIEngineStatus = 'ok' | 'degraded' | 'unavailable';

/** Estados del ciclo de vida de una alerta */
export type AlertStatus =
  | 'nueva'
  | 'en-seguimiento'
  | 'derivada-psicologia'
  | 'derivada-medicina'
  | 'resuelta';

// ─────────────────────────────────────────────────────────────────────────────
// HU003 — Widget de alertas prioritarias
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Alerta de prioridad para el widget del Dashboard del Tutor.
 * @privacy NUNCA incluir campo "score" ni "diagnosticoClinico"
 *          El backend filtra por JWT; esta interfaz refuerza la restricción en el tipo.
 */
export interface PriorityAlert {
  id: string;
  studentId: string;
  studentName: string;
  studentPhoto?: string;          // Opcional — fallback a iniciales del nombre
  semaforoEstado: SemaforoEstado;
  etiquetaOperativa: string;      // Del catálogo configurable — NUNCA score crudo del Motor de IA
  status: AlertStatus;
  isRead: boolean;
  updatedAt: string;              // ISO timestamp — para estado degradado
  aiEngineStatus: AIEngineStatus;
  // score: CAMPO PROHIBIDO — ausente por diseño tipado
  // diagnosticoClinico: CAMPO PROHIBIDO — ausente por diseño tipado
}

/** Respuesta del endpoint GET /alerts/priority */
export interface PriorityAlertsResponse {
  alerts: PriorityAlert[];
  aiEngineStatus: AIEngineStatus;
  lastUpdatedAt: string;          // Timestamp para banner de modo degradado
}

// ─────────────────────────────────────────────────────────────────────────────
// HU004 — Historial de alertas en el perfil del estudiante
// ─────────────────────────────────────────────────────────────────────────────

/** Entrada del historial de alertas de un estudiante */
export interface AlertHistoryItem {
  id: string;
  status: AlertStatus;
  etiquetaOperativa: string;
  registeredAt: string;
  registeredBy: string;           // Nombre del tutor que registró
  notes?: string;                 // Resumen de la nota de seguimiento
}

// ─────────────────────────────────────────────────────────────────────────────
// HU005 — Registrar seguimiento en bitácora ágil
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Request para registrar una nota de seguimiento.
 * El campo `contenido` tiene mínimo 30 caracteres — validado en frontend y backend.
 */
export interface FollowUpRequest {
  alertId: string;
  contenido: string;              // Mínimo 30 caracteres (validación en frontend + backend)
}

/** Respuesta del endpoint POST /alerts/:id/followup */
export interface FollowUpResponse {
  id: string;
  alertId: string;
  contenido: string;
  registeredAt: string;
  registeredBy: string;
  newAlertStatus: AlertStatus;    // Alerta cambia a 'en-seguimiento' tras el primer followup
}

// ─────────────────────────────────────────────────────────────────────────────
// HU006 — Cerrar alerta con evidencia obligatoria
// ─────────────────────────────────────────────────────────────────────────────

/** Request para cerrar una alerta. La evidencia es obligatoria para la auditoría. */
export interface CloseAlertRequest {
  alertId: string;
  evidencia: string;              // Obligatorio — auditable (HU022 / HU023)
}

/** Respuesta del endpoint PUT /alerts/:id/close */
export interface CloseAlertResponse {
  alertId: string;
  newStatus: 'resuelta';
  closedAt: string;
  microSurveyScheduled: boolean;  // Indica si se programó micro-encuesta al estudiante en 24h
}
