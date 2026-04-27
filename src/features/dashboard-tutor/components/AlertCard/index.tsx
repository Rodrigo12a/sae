/**
 * @module AlertCard
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU003
 * @ux UXDT-01, UXDT-02, UXDT-03, UXDT-04
 * @qa QA-01 (sin score numérico ni diagnosticoClinico)
 * @accessibility min 44x44px · aria-label en botones · role="article"
 * @privacy ⚠️ Tipo PriorityAlert — ausencia de score y diagnosticoClinico garantizada por tipo
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Semaforo } from '@/src/components/ui/Semaforo';
import { RiskBadge } from '@/src/components/ui/RiskBadge';
import type { PriorityAlert } from '@/src/types/alert';

interface AlertCardProps {
  alert: PriorityAlert;
  /** Callback cuando se hace clic en "Ver perfil" */
  onViewProfile?: (studentId: string) => void;
}

/** Obtiene las iniciales del nombre para el avatar fallback */
function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

/** Formatea el timestamp relativo (ej: "hace 2 horas") */
function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  if (hours > 24) return `hace ${Math.floor(hours / 24)} días`;
  if (hours >= 1) return `hace ${hours}h`;
  if (minutes >= 1) return `hace ${minutes} min`;
  return 'recién actualizado';
}

/**
 * Tarjeta de alerta prioritaria para el widget del Dashboard del Tutor.
 * @privacy No muestra score ni diagnóstico — solo etiquetaOperativa + semáforo
 */
export function AlertCard({ alert, onViewProfile }: AlertCardProps) {
  const router = useRouter();

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(alert.studentId);
    } else {
      router.push(`/tutor/estudiante/${alert.studentId}`);
    }
  };

  return (
    <article
      className={`
        group relative flex items-start gap-4 p-4 bg-white rounded-xl border transition-all duration-200 cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-blue-500
        ${!alert.isRead ? 'border-l-4 border-l-red-400 border-gray-100' : 'border-gray-100'}
      `}
      aria-label={`Alerta para ${alert.studentName}: ${alert.etiquetaOperativa}`}
    >
      {/* Indicador de no leída */}
      {!alert.isRead && (
        <span
          className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500"
          aria-label="Alerta no leída"
        />
      )}

      {/* Avatar del estudiante */}
      <div
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
        style={{ backgroundColor: '#3A7BC8' }}
        aria-hidden="true"
      >
        {alert.studentPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={alert.studentPhoto}
            alt={`Foto de ${alert.studentName}`}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          getInitials(alert.studentName)
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {alert.studentName}
          </h3>
          <RiskBadge status={alert.status} className="shrink-0" />
        </div>

        {/* Semáforo compacto + etiqueta operativa */}
        <div className="flex items-center gap-2 mb-2">
          <Semaforo
            estado={alert.semaforoEstado}
            etiqueta={alert.etiquetaOperativa}
            size="sm"
            compact={false}
          />
        </div>

        {/* Timestamp y estado del Motor de IA */}
        <div className="flex items-center justify-between">
          <time
            dateTime={alert.updatedAt}
            className="text-xs text-gray-400"
          >
            {formatRelativeTime(alert.updatedAt)}
          </time>

          {alert.aiEngineStatus !== 'ok' && (
            <span
              className="inline-flex items-center gap-1 text-xs text-amber-600"
              title="Motor de IA en modo degradado — datos pueden no estar actualizados"
              aria-label="Motor de análisis no disponible"
            >
              <span aria-hidden="true">⚡</span>
              <span>Motor en espera</span>
            </span>
          )}
        </div>
      </div>

      {/* Botón de acción */}
      <button
        onClick={handleViewProfile}
        className="
          shrink-0 self-center p-2 rounded-lg text-blue-600 hover:bg-blue-50
          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
          min-w-[44px] min-h-[44px] flex items-center justify-center
        "
        aria-label={`Ver perfil de ${alert.studentName}`}
        title={`Ver perfil de ${alert.studentName}`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </article>
  );
}

export default AlertCard;
