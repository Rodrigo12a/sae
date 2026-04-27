/**
 * @module HealthSemaphoreBadge
 * @epic Épica 4 — Módulo Médico con Privacidad Diferencial
 * @hu HU010
 * @ux UXMM-05
 * @privacy Muestra Diagnóstico o Etiqueta Operativa según disponibilidad en el objeto.
 */

import React from 'react';
import { Semaforo } from '@/src/components/ui/Semaforo';
import { HealthProfileMedico, HealthProfileTutor, MedicalSemaforoEstado } from '../../types';
import { LockIcon } from '@/src/components/ui/LockIcon';

interface HealthSemaphoreBadgeProps {
  data: HealthProfileMedico | HealthProfileTutor;
  showLock?: boolean;
  className?: string;
}

export const HealthSemaphoreBadge: React.FC<HealthSemaphoreBadgeProps> = ({
  data,
  showLock = true,
  className = '',
}) => {
  // Verificamos si es médico/psicólogo (tiene diagnóstico)
  const isMedicalView = 'diagnosticoClinico' in data;
  const status = data.semaforoEstado as MedicalSemaforoEstado;

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-lg border bg-white dark:bg-slate-900 shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Semaforo 
            estado={status} 
            etiqueta={data.recomendacionOperativa}
            compact
            size="md"
          />
          <span className="font-semibold text-slate-700 dark:text-slate-200 uppercase text-xs tracking-wider">
            Estado de Salud
          </span>
        </div>
        
        {isMedicalView && showLock && (
          <LockIcon label="Solo personal médico" size="sm" />
        )}
      </div>

      <div className="mt-1">
        <p className={`text-sm font-medium ${isMedicalView ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400"}`}>
          {isMedicalView ? (data as HealthProfileMedico).diagnosticoClinico : data.recomendacionOperativa}
        </p>
        
        {isMedicalView && (
          <p className="text-xs text-slate-400 mt-1 italic">
            Vista para el Tutor: "{data.recomendacionOperativa}"
          </p>
        )}
      </div>
      
      <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
        <span>Última actualización:</span>
        <span>{new Date(data.lastUpdate).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
