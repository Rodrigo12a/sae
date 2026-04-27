/**
 * @module SkeletonCard
 * @epic Transversal — Épicas 2, 3, 4
 * @hu HU003, HU004, HU007
 * @ux UXDT-01 (QA-05: p95 < 1.5s — skeleton en lugar de spinner bloqueante)
 * @qa QA-05 (latencia del widget de alertas)
 * @accessibility aria-busy + aria-label para lectores de pantalla
 */

'use client';

import React from 'react';

interface SkeletonCardProps {
  /** Altura aproximada del card en píxeles */
  height?: number;
  /** Muestra el avatar/foto circular al inicio */
  showAvatar?: boolean;
  /** Número de líneas de texto a simular */
  lines?: number;
  /** Clase CSS adicional */
  className?: string;
}

function SkeletonPulse({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({
  height = 80,
  showAvatar = true,
  lines = 2,
  className = '',
}: SkeletonCardProps) {
  return (
    <div
      role="status"
      aria-label="Cargando..."
      aria-busy="true"
      className={`flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm ${className}`}
      style={{ minHeight: height }}
    >
      {showAvatar && (
        <SkeletonPulse className="w-10 h-10 rounded-full shrink-0" />
      )}
      <div className="flex-1 flex flex-col gap-2 pt-1">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonPulse
            key={i}
            className="h-3.5 rounded-full"
            // Se elimina Math.random() para evitar Hydration Mismatch en SSR.
            style={{ width: ['60%', '45%', '65%', '50%', '70%'][i % 5] }}
          />
        ))}
      </div>
      {/* Badge de estado skeleton */}
      <SkeletonPulse className="w-20 h-6 rounded-full shrink-0" />
      <span className="sr-only">Cargando información del estudiante...</span>
    </div>
  );
}

/** Skeleton para el widget completo de alertas prioritarias (HU003) */
export function SkeletonAlertWidget({ count = 5 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Cargando alertas prioritarias..."
      aria-busy="true"
      className="flex flex-col gap-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} showAvatar lines={2} />
      ))}
      <span className="sr-only">Cargando lista de alertas prioritarias...</span>
    </div>
  );
}

/** Skeleton para el perfil de riesgo completo (HU004) */
export function SkeletonRiskProfile() {
  return (
    <div
      role="status"
      aria-label="Cargando perfil del estudiante..."
      aria-busy="true"
      className="flex flex-col gap-6"
    >
      {/* Header del perfil */}
      <div className="flex items-center gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
        <SkeletonPulse className="w-16 h-16 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <SkeletonPulse className="h-5 w-48 rounded-full" />
          <SkeletonPulse className="h-3.5 w-32 rounded-full" />
          <SkeletonPulse className="h-3.5 w-24 rounded-full" />
        </div>
      </div>
      {/* Semáforos de dimensiones */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
            <SkeletonPulse className="h-3.5 w-24 rounded-full" />
            <SkeletonPulse className="h-8 w-full rounded-full" />
          </div>
        ))}
      </div>
      {/* Gráficas */}
      <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
        <SkeletonPulse className="h-4 w-40 rounded-full mb-4" />
        <SkeletonPulse className="h-48 w-full rounded-lg" />
      </div>
      <span className="sr-only">Cargando perfil del estudiante...</span>
    </div>
  );
}

export default SkeletonCard;
