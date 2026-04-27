/**
 * @module AlertsService
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU003, HU005, HU006
 * @ux UXDT-01, UXDT-02, UXDT-03, UXDT-04, UXDT-11, UXDT-12, UXDT-13
 * @qa QA-05 (datos pre-computados para latencia p95 < 1.5s)
 * @api GET /alerts/priority · POST /alerts/:id/followup · PUT /alerts/:id/close
 * @privacy Todos los tipos excluyen score numérico y diagnosticoClinico
 */

import { api } from '@/src/lib/api';
import type {
  PriorityAlertsResponse,
  FollowUpRequest,
  FollowUpResponse,
  CloseAlertRequest,
  CloseAlertResponse,
} from '@/src/types/alert';

// ─────────────────────────────────────────────────────────────────────────────
// Mock data — remover cuando el backend esté disponible
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_PRIORITY_ALERTS: PriorityAlertsResponse = {
  aiEngineStatus: 'ok',
  lastUpdatedAt: new Date().toISOString(),
  alerts: [
    {
      id: 'alert-001',
      studentId: 'stu-001',
      studentName: 'Ana García López',
      studentPhoto: undefined,
      semaforoEstado: 'rojo',
      etiquetaOperativa: 'Requiere apoyo en asistencia — 3 inasistencias consecutivas',
      status: 'nueva',
      isRead: false,
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      aiEngineStatus: 'ok',
    },
    {
      id: 'alert-002',
      studentId: 'stu-002',
      studentName: 'Carlos Mendoza Ruiz',
      studentPhoto: undefined,
      semaforoEstado: 'rojo',
      etiquetaOperativa: 'Seguimiento académico urgente — promedio < 6.0',
      status: 'nueva',
      isRead: false,
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      aiEngineStatus: 'ok',
    },
    {
      id: 'alert-003',
      studentId: 'stu-003',
      studentName: 'María Torres Vega',
      studentPhoto: undefined,
      semaforoEstado: 'amarillo',
      etiquetaOperativa: 'Seguimiento activo recomendado — variables socioeconómicas',
      status: 'en-seguimiento',
      isRead: true,
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      aiEngineStatus: 'ok',
    },
    {
      id: 'alert-004',
      studentId: 'stu-004',
      studentName: 'Diego Ramírez Soto',
      studentPhoto: undefined,
      semaforoEstado: 'revisar',
      etiquetaOperativa: 'Datos pendientes de verificación',
      status: 'nueva',
      isRead: false,
      updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      aiEngineStatus: 'degraded',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// HU003 — Obtener alertas de atención prioritaria
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene el listado de alertas prioritarias del Tutor (máx. 5, ordenadas por urgencia).
 * Los datos son pre-computados en el backend — no on-demand.
 * @returns PriorityAlertsResponse con estado del Motor de IA incluido
 */
export async function getPriorityAlerts(): Promise<PriorityAlertsResponse> {
  // TODO: conectar a GET /alerts/priority cuando esté disponible en Swagger
  // return api.get<PriorityAlertsResponse>('/alerts/priority').then(res => res.data);

  // Mock temporal con datos de prueba realistas
  await new Promise(resolve => setTimeout(resolve, 600)); // Simula latencia
  return MOCK_PRIORITY_ALERTS;
}

// ─────────────────────────────────────────────────────────────────────────────
// HU005 — Registrar seguimiento en bitácora
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registra una nota de seguimiento en la bitácora de una alerta.
 * Mínimo 30 caracteres — validado en frontend antes de llamar este servicio.
 */
export async function registerFollowUp(
  alertId: string,
  request: FollowUpRequest,
): Promise<FollowUpResponse> {
  // TODO: conectar a POST /alerts/:id/followup cuando esté disponible en Swagger
  // return api.post<FollowUpResponse>(`/alerts/${alertId}/followup`, request).then(res => res.data);

  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    id: `followup-${Date.now()}`,
    alertId,
    contenido: request.contenido,
    registeredAt: new Date().toISOString(),
    registeredBy: 'Tutor Demo',
    newAlertStatus: 'en-seguimiento',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HU006 — Cerrar alerta con evidencia
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cierra una alerta con evidencia adjunta.
 * La evidencia es obligatoria para garantizar la auditoría (HU022/HU023).
 */
export async function closeAlert(
  alertId: string,
  request: CloseAlertRequest,
): Promise<CloseAlertResponse> {
  // TODO: conectar a PUT /alerts/:id/close cuando esté disponible en Swagger
  // return api.put<CloseAlertResponse>(`/alerts/${alertId}/close`, request).then(res => res.data);

  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    alertId,
    newStatus: 'resuelta',
    closedAt: new Date().toISOString(),
    microSurveyScheduled: true,
  };
}
