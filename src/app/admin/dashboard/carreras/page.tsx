/**
 * @page CarrerasPage
 * @epic EPICA-6 Panel Ejecutivo y Reportes
 * @hu HU016, HU017 — KPIs por Carrera y Drill-down
 * @privacy Solo accesible para administradores. Datos agregados únicamente.
 */
'use client';

import React, { useState } from 'react';
import { useAdminKPIs } from '@/src/features/dashboard-admin/hooks/useAdminKPIs';
import { CareerRiskChart } from '@/src/features/dashboard-admin/components/CareerRiskChart';
import { FilterPanel } from '@/src/features/dashboard-admin/components/FilterPanel';
import { Drawer } from '@/src/components/ui/Drawer';
import { DrillDownPanel } from '@/src/features/dashboard-admin/components/DrillDownPanel';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';
import { KpiCard } from '@/src/components/ui/KpiCard';
import { KPIFilters } from '@/src/features/dashboard-admin/types';
import { FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';

export default function CarrerasPage() {
  const [filters, setFilters] = useState<KPIFilters>({});
  const [drillDownCareer, setDrillDownCareer] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useAdminKPIs(filters);

  const handleBarClick = (careerId: string) => {
    setDrillDownCareer(careerId);
    setIsDrawerOpen(true);
  };

  const handleNavigateToStudent = (studentId: string) => {
    toast.info(`Estudiante: ${studentId}`);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold text-sm uppercase tracking-wider mb-1">
          <FiTrendingUp />
          <span>Análisis por programa</span>
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">KPIs por Carrera</h1>
        <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
          Comparativa de índices de riesgo por programa académico. Haz clic en una barra para ver el detalle.
        </p>
      </div>

      <FilterPanel 
        filters={filters} 
        onChange={setFilters} 
        availableCareers={data?.carrerasActivas}
      />

      {isLoading && !data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard className="h-[380px]" />
          <SkeletonCard className="h-[380px]" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.comparativaPorCarrera.map((c) => (
              <KpiCard
                key={c.careerId}
                label={c.careerName}
                value={`${c.riskIndex} pts`}
                sub="Índice de riesgo"
                trend={c.riskIndex >= 50 ? 'up' : 'down'}
              />
            ))}
          </div>

          {data.comparativaPorCarrera.length === 0 ? (
            <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-12 text-center shadow-sm">
              <FiAlertCircle className="text-[var(--text-muted)] mx-auto mb-3" size={32} />
              <h3 className="font-bold text-[var(--text-primary)] mb-1">Sin datos para mostrar</h3>
              <p className="text-[var(--text-secondary)] text-sm">No se encontraron registros con los filtros seleccionados.</p>
            </div>
          ) : (
            <CareerRiskChart 
              data={data.comparativaPorCarrera} 
              activeCareers={data.carrerasActivas}
              onBarClick={handleBarClick} 
            />
          )}
        </>
      )}

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Detalle de Riesgo por Carrera">
        {drillDownCareer && (
          <DrillDownPanel
            request={{ careerId: drillDownCareer, semester: filters.semester }}
            onNavigateToStudent={handleNavigateToStudent}
          />
        )}
      </Drawer>
    </div>
  );
}
