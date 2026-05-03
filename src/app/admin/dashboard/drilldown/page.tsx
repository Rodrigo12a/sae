/**
 * @page DrilldownPage
 * @epic EPICA-6 Panel Ejecutivo y Reportes
 * @hu HU017 — Drill-down por grupo y sección
 * @privacy Solo accesible para administradores. Datos agregados únicamente.
 */
'use client';

import React, { useState } from 'react';
import { useAdminKPIs } from '@/src/features/dashboard-admin/hooks/useAdminKPIs';
import { FilterPanel } from '@/src/features/dashboard-admin/components/FilterPanel';
import { DrillDownPanel } from '@/src/features/dashboard-admin/components/DrillDownPanel';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';
import { KPIFilters } from '@/src/features/dashboard-admin/types';
import { FiLayers, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';

export default function DrilldownPage() {
  const [filters, setFilters] = useState<KPIFilters>({});
  const [selectedCareer, setSelectedCareer] = useState<string>('all');

  const { data, isLoading, isError, refetch } = useAdminKPIs(filters);

  const handleNavigateToStudent = (studentId: string) => {
    toast.info(`Perfil del estudiante: ${studentId}`);
  };

  const careers = data?.comparativaPorCarrera ?? [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold text-sm uppercase tracking-wider mb-1">
          <FiLayers />
          <span>Detalle por grupo</span>
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Drill-down Grupos</h1>
        <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
          Vista detallada de anomalías por grupo y sección académica.
        </p>
      </div>

      <FilterPanel 
        filters={filters} 
        onChange={setFilters} 
        availableCareers={data?.carrerasActivas}
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-6">
          <SkeletonCard className="h-[200px]" />
          <SkeletonCard className="h-[400px]" />
        </div>
      )}

      {isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center text-center">
          <FiAlertCircle className="text-red-500 mb-3" size={32} />
          <h3 className="text-red-800 font-bold text-lg mb-1">Error de conexión</h3>
          <button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg mt-4 transition-colors">
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && data && (
        <>
          {/* Selector de carrera */}
          {careers.length > 0 && (
            <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Seleccionar carrera</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCareer('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCareer === 'all' ? 'bg-[var(--color-secondary)] text-white shadow' : 'bg-[var(--bg-section)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'}`}
                >
                  Todas
                </button>
                {careers.map((c) => (
                  <button
                    key={c.careerId}
                    onClick={() => setSelectedCareer(c.careerId)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCareer === c.careerId ? 'bg-[var(--color-secondary)] text-white shadow' : 'bg-[var(--bg-section)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]'}`}
                  >
                    {c.careerName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Panel de drill-down */}
          <DrillDownPanel
            request={{
              careerId: selectedCareer === 'all' ? careers[0]?.careerId ?? '' : selectedCareer,
              semester: filters.semester,
            }}
            onNavigateToStudent={handleNavigateToStudent}
          />
        </>
      )}
    </div>
  );
}
