/**
 * @module Semaforo
 * @epic Transversal — usado en Épicas 2, 4, 5, 6
 * @hu HU003, HU004, HU010
 * @ux UXDT-01, UXDT-03, UXDT-07, UXMM-05, UXMM-06
 * @qa QA-01 (nunca mostrar score al Tutor) · QA-09 (WCAG AA accesibilidad)
 * @accessibility Siempre: color + ícono + texto semántico. NUNCA solo color.
 * @privacy El componente no tiene acceso ni muestra scores numéricos del Motor de IA.
 */

'use client';

import React from 'react';
import type { SemaforoEstado } from '@/src/types/alert';

// ─────────────────────────────────────────────────────────────────────────────
// Configuración del semáforo — fuente de verdad visual
// ─────────────────────────────────────────────────────────────────────────────

interface SemaforoConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  icono: string;
  ariaLabel: string;
  textColor: string;
}

const SEMAFORO_CONFIG: Record<SemaforoEstado, SemaforoConfig> = {
  rojo: {
    color: '#D64545',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    textColor: '#991B1B',
    icono: '⚠️',
    ariaLabel: 'Atención urgente requerida',
  },
  amarillo: {
    color: '#F4B740',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#92400E',
    icono: '❕',
    ariaLabel: 'Seguimiento activo recomendado',
  },
  verde: {
    color: '#2FA36B',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    textColor: '#14532D',
    icono: '✓',
    ariaLabel: 'Sin acción requerida',
  },
  revisar: {
    color: '#7E57C2',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    textColor: '#4C1D95',
    icono: '👁',
    ariaLabel: 'Datos pendientes de verificación',
  },
  'sin-datos': {
    color: '#94A3B8',
    bgColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    textColor: '#475569',
    icono: '🕐',
    ariaLabel: 'Encuesta no completada',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface SemaforoProps {
  /** Estado del semáforo. Determina color, ícono y texto accesible. */
  estado: SemaforoEstado;
  /** Etiqueta operativa del catálogo configurable — NUNCA score numérico */
  etiqueta: string;
  /** Dimensión opcional (Académico / Socioeconómico / Salud) */
  dimension?: string;
  /** Tamaño del componente */
  size?: 'sm' | 'md' | 'lg';
  /** Si está en modo compacto (solo ícono + badge de color) */
  compact?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────

export function Semaforo({
  estado,
  etiqueta,
  dimension,
  size = 'md',
  compact = false,
  className = '',
}: SemaforoProps) {
  const config = SEMAFORO_CONFIG[estado];

  const sizeClasses = {
    sm: { container: 'gap-1.5', dot: 'w-2.5 h-2.5', icono: 'text-sm', text: 'text-xs' },
    md: { container: 'gap-2', dot: 'w-3.5 h-3.5', icono: 'text-base', text: 'text-sm' },
    lg: { container: 'gap-3', dot: 'w-4 h-4', icono: 'text-lg', text: 'text-base' },
  }[size];

  if (compact) {
    return (
      <span
        role="img"
        aria-label={`${config.ariaLabel}: ${etiqueta}`}
        title={etiqueta}
        className={`inline-flex items-center gap-1 ${className}`}
      >
        <span
          className={`inline-flex items-center justify-center rounded-full ${sizeClasses.dot}`}
          style={{ backgroundColor: config.color }}
          aria-hidden="true"
        />
        <span
          className={`${sizeClasses.icono}`}
          aria-hidden="true"
        >
          {config.icono}
        </span>
      </span>
    );
  }

  return (
    <div
      role="status"
      aria-label={`${dimension ? dimension + ': ' : ''}${config.ariaLabel}`}
      className={`inline-flex flex-col gap-1.5 ${className}`}
    >
      {dimension && (
        <span
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: 'var(--text-muted, #94A3B8)' }}
        >
          {dimension}
        </span>
      )}
      <div
        className={`inline-flex items-center ${sizeClasses.container} px-3 py-1.5 rounded-full border`}
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
        }}
      >
        {/* Indicador de color (accesible: no es el único diferenciador) */}
        <span
          className={`shrink-0 rounded-full ${sizeClasses.dot}`}
          style={{ backgroundColor: config.color }}
          aria-hidden="true"
        />
        {/* Ícono semántico */}
        <span
          className={`shrink-0 ${sizeClasses.icono}`}
          aria-hidden="true"
        >
          {config.icono}
        </span>
        {/* Texto operativo — el diferenciador principal (accesibilidad) */}
        <span
          className={`font-medium leading-tight ${sizeClasses.text}`}
          style={{ color: config.textColor }}
        >
          {etiqueta}
        </span>
      </div>
    </div>
  );
}

export default Semaforo;
