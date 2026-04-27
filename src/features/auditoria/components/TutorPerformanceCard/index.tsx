/**
 * @module TutorPerformanceCard
 * @epic EPICA-8 Auditoría y Control de Calidad
 * @hu HU023 — Alertar por inconsistencia de servicio
 */

import React from 'react';
import { FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { TutorAuditStats } from '../../types';

interface TutorPerformanceCardProps {
  stats: TutorAuditStats;
}

export const TutorPerformanceCard: React.FC<TutorPerformanceCardProps> = ({ stats }) => {
  return (
    <div className={`p-6 rounded-2xl border-2 transition-all ${
      stats.criticalStatus 
        ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' 
        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{stats.tutorName}</h3>
          <p className="text-sm text-slate-500">ID: {stats.tutorId}</p>
        </div>
        {stats.criticalStatus && (
          <div className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase rounded-full flex items-center animate-pulse">
            <FiAlertTriangle className="mr-1" /> Desempeño Crítico
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center text-xs text-slate-500">
            <FiActivity className="mr-1" /> Intervenciones
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalInterventions}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center text-xs text-slate-500">
            <FiTrendingUp className="mr-1" /> Inconsistencias
          </div>
          <p className={`text-2xl font-black ${stats.criticalStatus ? 'text-red-600' : 'text-amber-500'}`}>
            {stats.inconsistenciesCount}
          </p>
        </div>
      </div>

      {stats.criticalStatus ? (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/40 rounded-xl">
          <p className="text-xs text-red-800 dark:text-red-300 font-medium">
            Se han detectado {stats.inconsistenciesCount} inconsistencias en este ciclo. Se recomienda auditoría presencial y revisión de evidencias.
          </p>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center space-x-3">
          <FiCheckCircle className="text-green-600 shrink-0" />
          <p className="text-xs text-green-800 dark:text-green-400 font-medium">
            Cumplimiento del 96% en verificaciones estudiantiles.
          </p>
        </div>
      )}
    </div>
  );
};
