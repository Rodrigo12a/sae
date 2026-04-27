/**
 * @page TutoresPage
 * @epic EPICA-6 Panel Ejecutivo
 * @hu HU023 — Gestión de tutores e inconsistencias de servicio
 * @privacy Solo accesible para administradores. Tutores no ven su propio historial de auditoría.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { TutorPerformanceCard } from '@/src/features/auditoria/components/TutorPerformanceCard';
import { getTutorAuditStats } from '@/src/services/api/audit';
import { TutorAuditStats } from '@/src/features/auditoria/types';
import { FiUsers, FiAlertTriangle, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

export default function TutoresPage() {
  const [tutorStats, setTutorStats] = useState<TutorAuditStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadStats = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [stats1, stats2] = await Promise.all([
        getTutorAuditStats('tut-001'),
        getTutorAuditStats('tut-002'),
      ]);
      setTutorStats([stats1, stats2]);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  const alertCount = tutorStats.filter(t => t.missedFollowUps > 0 || t.incompleteRecords > 0).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold text-sm uppercase tracking-wider mb-1">
            <FiUsers />
            <span>Gestión docente</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Gestión de Tutores</h1>
            {alertCount > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-black px-2.5 py-1 rounded-full border border-red-200">
                {alertCount} alerta{alertCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
            Desempeño de tutores y alertas de servicio. Los tutores no tienen acceso a este panel.
          </p>
        </div>
        <button
          onClick={loadStats}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--border-subtle)] rounded-xl text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-section)] transition-all shadow-sm"
        >
          <FiRefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center text-center">
          <FiAlertCircle className="text-red-500 mb-3" size={32} />
          <h3 className="text-red-800 font-bold text-lg mb-1">Error al cargar datos</h3>
          <button onClick={loadStats} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg mt-4 transition-colors">
            Reintentar
          </button>
        </div>
      )}

      {/* Estado vacío */}
      {!isLoading && !isError && tutorStats.length === 0 && (
        <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-12 text-center shadow-sm">
          <FiUsers className="text-[var(--text-muted)] mx-auto mb-3" size={32} />
          <h3 className="font-bold text-[var(--text-primary)] mb-1">Sin tutores registrados</h3>
          <p className="text-[var(--text-secondary)] text-sm">No se encontraron tutores asignados en el sistema.</p>
        </div>
      )}

      {/* Cards de desempeño */}
      {!isLoading && !isError && tutorStats.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-red-500" size={16} />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Alertas de Desempeño</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorStats.map((stats) => (
              <TutorPerformanceCard key={stats.tutorId} stats={stats} />
            ))}
          </div>

          {/* Nota de privacidad */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 flex items-start gap-3">
            <span className="text-lg">🔐</span>
            <p className="leading-relaxed">
              <strong>Aviso RBAC:</strong> Los tutores no tienen acceso a sus propios registros de desempeño ni al historial
              de auditoría. Este panel es exclusivo del rol Administrador (RP-02).
            </p>
          </div>
        </>
      )}
    </div>
  );
}
