/**
 * @page AuditoriaPage
 * @epic EPICA-8 Auditoría y Control de Calidad
 * @hu HU023 — Alertar por inconsistencia de servicio
 * @privacy Solo accesible para administradores
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAudit } from '@/src/features/auditoria/hooks/useAudit';
import { InconsistencyList } from '@/src/features/auditoria/components/InconsistencyList';
import { TutorPerformanceCard } from '@/src/features/auditoria/components/TutorPerformanceCard';
import { getTutorAuditStats } from '@/src/services/api/audit';
import { TutorAuditStats } from '@/src/features/auditoria/types';
import { FiShield, FiFilter, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

export default function AuditoriaPage() {
  const { inconsistencies, isLoading, handleAction, retry } = useAudit();
  const [tutorStats, setTutorStats] = useState<TutorAuditStats[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [stats1, stats2] = await Promise.all([
          getTutorAuditStats('tut-001'),
          getTutorAuditStats('tut-002')
        ]);
        setTutorStats([stats1, stats2]);
      } catch (err) {
        console.error('Error loading stats');
      } finally {
        setIsStatsLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wider mb-1">
            <FiShield />
            <span>Panel de Auditoría</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Control de Calidad</h1>
          <p className="text-slate-500">Monitoreo de inconsistencias en el servicio de tutorías.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={retry}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button className="flex items-center space-x-2 py-3 px-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
            <FiFilter />
            <span>Filtrar</span>
          </button>
        </div>
      </header>

      {/* Grid de Desempeño Crítico */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <FiAlertTriangle className="text-red-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Alertas de Desempeño</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isStatsLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))
          ) : (
            tutorStats.map(stats => (
              <TutorPerformanceCard key={stats.tutorId} stats={stats} />
            ))
          )}
        </div>
      </section>

      {/* Lista de Inconsistencias */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Discrepancias Detectadas</h2>
        <InconsistencyList 
          items={inconsistencies} 
          isLoading={isLoading} 
          onAction={handleAction} 
        />
      </section>
    </div>
  );
}
