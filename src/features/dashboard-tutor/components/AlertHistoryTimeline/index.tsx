/**
 * @module AlertHistoryTimeline
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU004
 * @ux UXDT-09, UXDT-10
 * @privacy Solo muestra etiquetaOperativa — sin datos clínicos
 */

'use client';

import React from 'react';
import { RiskBadge } from '@/src/components/ui/RiskBadge';
import type { AlertHistoryItem } from '@/src/types/alert';

interface AlertHistoryTimelineProps {
  history: AlertHistoryItem[];
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Timeline del historial de alertas de un estudiante.
 * Muestra estado, etiqueta operativa, autor y fecha.
 */
export function AlertHistoryTimeline({ history }: AlertHistoryTimelineProps) {
  if (history.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center py-8 text-center"
      >
        <span className="text-2xl mb-2" aria-hidden="true">📋</span>
        <p className="text-sm text-gray-500">Sin historial de alertas registrado.</p>
      </div>
    );
  }

  return (
    <ol
      aria-label="Historial de alertas"
      className="relative flex flex-col gap-0"
    >
      {history.map((item, index) => (
        <li
          key={item.id}
          className="relative flex gap-4 pb-6 last:pb-0"
        >
          {/* Línea de tiempo vertical */}
          {index < history.length - 1 && (
            <div
              className="absolute left-[19px] top-8 bottom-0 w-px bg-gray-100"
              aria-hidden="true"
            />
          )}

          {/* Punto de la línea de tiempo */}
          <div
            className="shrink-0 w-10 h-10 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center text-sm"
            aria-hidden="true"
          >
            {index === 0 ? '🔔' : '📝'}
          </div>

          {/* Contenido del evento */}
          <div className="flex-1 pt-1.5">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <RiskBadge status={item.status} />
              <time
                dateTime={item.registeredAt}
                className="text-xs text-gray-400"
              >
                {formatDate(item.registeredAt)}
              </time>
            </div>
            <p className="text-sm font-medium text-gray-700 mb-0.5">
              {item.etiquetaOperativa}
            </p>
            <p className="text-xs text-gray-400">
              Por: {item.registeredBy}
            </p>
            {item.notes && (
              <p className="text-xs text-gray-500 mt-1 p-2 bg-gray-50 rounded-lg border border-gray-100">
                {item.notes}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default AlertHistoryTimeline;
