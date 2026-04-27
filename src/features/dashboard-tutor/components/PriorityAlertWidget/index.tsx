/**
 * @module PriorityAlertWidget
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU003
 * @ux UXDT-01, UXDT-02, UXDT-03, UXDT-04, UXDT-05
 * @qa QA-05 (latencia p95 < 1.5s) · QA-01 (sin score numérico)
 * @api GET /alerts/priority
 * @privacy Tipo PriorityAlert — sin score numérico ni diagnosticoClinico
 */

'use client';

import React from 'react';
import { usePriorityAlerts } from '../../hooks/usePriorityAlerts';
import { AlertCard } from '../AlertCard';
import { SkeletonAlertWidget } from '@/src/components/ui/SkeletonCard';
import { AIEngineStatusBanner } from '../AIEngineStatusBanner';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes de estados de UI
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      role="status"
      aria-label="Sin alertas prioritarias"
      className="flex flex-col items-center justify-center py-10 px-6 text-center"
    >
      <span
        className="text-4xl mb-3"
        aria-hidden="true"
      >
        ✓
      </span>
      <p className="text-base font-semibold text-gray-700 mb-1">
        Todos tus tutorados están en seguimiento normal
      </p>
      <p className="text-sm text-gray-400">
        No hay alertas prioritarias en este momento.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-8 px-6 text-center"
    >
      <span className="text-3xl mb-3" aria-hidden="true">⚠️</span>
      <p className="text-sm font-semibold text-red-700 mb-1">
        No se pudieron cargar las alertas
      </p>
      <p className="text-xs text-gray-500 mb-4">
        Verifica tu conexión a internet e intenta de nuevo.
      </p>
      <button
        onClick={onRetry}
        className="
          px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors min-h-[44px]
        "
        aria-label="Reintentar carga de alertas"
      >
        Reintentar
      </button>
    </div>
  );
}



// ─────────────────────────────────────────────────────────────────────────────
// Widget principal
// ─────────────────────────────────────────────────────────────────────────────

interface PriorityAlertWidgetProps {
  onViewStudent?: (studentId: string) => void;
}

/**
 * Widget de Atención Prioritaria del Dashboard del Tutor.
 * Implementa los 5 estados: loading, success, empty, error y degraded (Motor de IA).
 */
export function PriorityAlertWidget({ onViewStudent }: PriorityAlertWidgetProps) {
  const { alerts, aiEngineStatus, lastUpdatedAt, isLoading, error, refetch } =
    usePriorityAlerts();

  return (
    <section
      aria-labelledby="priority-alerts-heading"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header del widget */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-red-500 text-lg">🔔</span>
          <h2
            id="priority-alerts-heading"
            className="text-base font-bold text-gray-900"
          >
            Atención prioritaria
          </h2>
          {!isLoading && !error && alerts.length > 0 && (
            <span
              className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full"
              aria-label={`${alerts.length} alerta${alerts.length !== 1 ? 's' : ''}`}
            >
              {alerts.length}
            </span>
          )}
        </div>

        {!isLoading && (
          <button
            onClick={refetch}
            className="
              p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
              min-w-[44px] min-h-[44px] flex items-center justify-center
            "
            aria-label="Actualizar alertas"
            title="Actualizar"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        )}
      </div>

      {/* Cuerpo del widget */}
      <div className="p-4">
        {/* Estado: Loading */}
        {isLoading && <SkeletonAlertWidget count={3} />}

        {/* Estado: Error */}
        {!isLoading && error && <ErrorState onRetry={refetch} />}

        {/* Estado: Success / Empty / Degraded */}
        {!isLoading && !error && (
          <>
            {/* Banner de modo degradado del Motor de IA */}
            <AIEngineStatusBanner />

            {/* Estado vacío */}
            {alerts.length === 0 && <EmptyState />}

            {/* Lista de alertas */}
            {alerts.length > 0 && (
              <ul
                className="flex flex-col gap-3"
                aria-label="Lista de alertas prioritarias"
              >
                {alerts.map(alert => (
                  <li key={alert.id}>
                    <AlertCard
                      alert={alert}
                      onViewProfile={onViewStudent}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default PriorityAlertWidget;
