/**
 * @module SaludTutorView
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU004
 * @ux UXDT-08 (dimensión de salud para el Tutor)
 * @qa QA-01 (sin datos clínicos) · QA-03 (LockIcon obligatorio)
 * @privacy ⚠️ COMPONENTE EXCLUSIVO PARA ROL TUTOR.
 *          Tipo DimensionSaludTutor — diagnosticoClinico ausente por diseño tipado.
 *          El candado visual 🔒 es obligatorio en este componente.
 */

'use client';

import React from 'react';
import { HealthSemaphoreBadge } from '@/src/features/medico/components/HealthSemaphoreBadge';
import type { DimensionSaludTutor } from '@/src/types/student';
import { HealthProfileTutor } from '@/src/features/medico/types';

interface SaludTutorViewProps {
  salud: DimensionSaludTutor;
}

/**
 * Vista de la dimensión de salud para el Tutor.
 * @privacy Reutiliza HealthSemaphoreBadge que ya tiene implementada la lógica de privacidad.
 */
export function SaludTutorView({ salud }: SaludTutorViewProps) {
  // Mapeo al tipo unificado de salud (HU010)
  const healthData: HealthProfileTutor = {
    studentId: '', // No requerido para el badge
    semaforoEstado: salud.semaforoEstado,
    recomendacionOperativa: salud.recomendacionOperativa,
    lastUpdate: new Date().toISOString(), // Fallback
  };

  return <HealthSemaphoreBadge data={healthData} className="border-none p-0 bg-transparent shadow-none" />;
}

export default SaludTutorView;

