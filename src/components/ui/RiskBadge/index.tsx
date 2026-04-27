/**
 * @module RiskBadge
 * @epic Transversal — Épica 2
 * @hu HU003, HU004
 * @ux UXDT-01, UXDT-02, UXDT-07
 * @qa QA-01 (sin score numérico)
 * @accessibility Badge con rol="status" y aria-label semántico
 * @privacy Muestra solo etiqueta operativa — NUNCA score numérico ni diagnóstico
 */

'use client';

import React from 'react';
import type { AlertStatus } from '@/src/types/alert';

// ─────────────────────────────────────────────────────────────────────────────
// Configuración visual de estados de alerta
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AlertStatus, { label: string; bgColor: string; textColor: string; dot: string }> = {
  'nueva': {
    label: 'Nueva',
    bgColor: '#FEF2F2',
    textColor: '#991B1B',
    dot: '#D64545',
  },
  'en-seguimiento': {
    label: 'En seguimiento',
    bgColor: '#FFFBEB',
    textColor: '#92400E',
    dot: '#F4B740',
  },
  'derivada-psicologia': {
    label: 'Derivada · Psicología',
    bgColor: '#F5F3FF',
    textColor: '#4C1D95',
    dot: '#7E57C2',
  },
  'derivada-medicina': {
    label: 'Derivada · Medicina',
    bgColor: '#EFF6FF',
    textColor: '#1E40AF',
    dot: '#3A7BC8',
  },
  'resuelta': {
    label: 'Resuelta',
    bgColor: '#F0FDF4',
    textColor: '#14532D',
    dot: '#2FA36B',
  },
};

interface RiskBadgeProps {
  status: AlertStatus;
  className?: string;
}

/** Badge compacto del estado de una alerta. */
export function RiskBadge({ status, className = '' }: RiskBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      role="status"
      aria-label={`Estado: ${config.label}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        borderColor: config.dot + '40', // 25% opacity del color del dot
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: config.dot }}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}

export default RiskBadge;
