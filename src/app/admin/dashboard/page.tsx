'use client';

import React, { useState } from 'react';
import { useAdminKPIs } from '@/src/features/dashboard-admin/hooks/useAdminKPIs';
import { KPIFilters } from '@/src/features/dashboard-admin/types';
import { FilterPanel } from '@/src/features/dashboard-admin/components/FilterPanel';
import { CareerRiskChart } from '@/src/features/dashboard-admin/components/CareerRiskChart';
import { KpiCard } from '@/src/components/ui/KpiCard';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';
import { Drawer } from '@/src/components/ui/Drawer';
import { DrillDownPanel } from '@/src/features/dashboard-admin/components/DrillDownPanel';
import { ExportModal } from '@/src/features/dashboard-admin/components/ExportModal';
import { useRouter } from 'next/navigation';
import { useDashboardStore } from '@/src/features/dashboard-admin/store/dashboardStore';
import { CustomizeDashboardModal } from '@/src/features/dashboard-admin/components/CustomizeDashboardModal';
import { FiAlertCircle, FiClock, FiRefreshCw, FiDownload, FiGrid } from 'react-icons/fi';
import { toast } from 'sonner';

/**
 * @module AdminDashboardPage
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU016
 * @ux UXPA-01, UXPA-02, UXPA-03, UXPA-04
 * @qa QA-04 (Performance dashboard ejecutivo)
 * @privacy ⚠️ Vista protegida por middleware. Renderiza ÚNICAMENTE datos agregados.
 */

const inconsistenciasMock = [
  { tutor: "Prof. Ramírez", casos: 3, estado: "Crítico",  badgeClass: "bg-red-100 text-red-700" },
  { tutor: "Prof. López",   casos: 1, estado: "Revisión", badgeClass: "bg-amber-100 text-amber-700" },
  { tutor: "Prof. Morales", casos: 1, estado: "Revisión", badgeClass: "bg-amber-100 text-amber-700" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<KPIFilters>({});
  
  // Drill-down states
  const [drillDownCareer, setDrillDownCareer] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Customization state
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const { widgets } = useDashboardStore();
  
  const isVisible = (id: string) => widgets.find(w => w.id === id)?.visible ?? true;

  const { data, isLoading, isError, refetch } = useAdminKPIs(filters);

  const handleBarClick = (careerId: string) => {
    setDrillDownCareer(careerId);
    setIsDrawerOpen(true);
  };

  const handleNavigateToStudent = (studentId: string) => {
    toast.success(`Navegando al perfil del estudiante: ${studentId}`);
    // Opcionalmente podemos cerrar el drawer al navegar:
    // setIsDrawerOpen(false);
    // router.push(`/admin/estudiante/${studentId}`); 
    // Nota: Dependiendo de los requerimientos de la ruta (HU017), tal vez el Admin no navega a una vista de tutor, sino a una de admin, por ahora mock con toast.
  };

  // Funciones de formato de fechas
  const getRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes === 1) return 'Hace 1 minuto';
    return `Hace ${diffInMinutes} minutos`;
  };

  const isDataStale = data ? (new Date().getTime() - new Date(data.dataFreshness).getTime()) > 300000 : false;

  if (isError) {
    toast.error('Error al cargar los KPIs. Intente de nuevo.');
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Dashboard Ejecutivo</h1>
          <p className="text-sm text-[var(--text-muted)] font-medium mt-1">Vista global del rendimiento institucional</p>
        </div>
        
        {/* Badge de frescura de datos y Botón de exportación */}
        <div className="flex flex-wrap items-center gap-3">
          {data && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${isDataStale ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
              <FiClock size={14} />
              {isDataStale ? 'Datos desactualizados' : `Actualizado: ${getRelativeTime(data.dataFreshness)}`}
              {isDataStale && (
                <button onClick={() => refetch()} className="ml-2 p-1 hover:bg-orange-100 rounded-full transition-colors" aria-label="Actualizar datos">
                  <FiRefreshCw size={12} />
                </button>
              )}
            </div>
          )}
          
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-[var(--border-subtle)] hover:bg-gray-50 text-[var(--text-primary)] px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            <FiDownload size={16} />
            Exportar
          </button>

          <button 
            onClick={() => setIsCustomizeModalOpen(true)}
            className="flex items-center gap-2 bg-[var(--brand-primary)] hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            <FiGrid size={16} />
            Personalizar
          </button>
        </div>
      </div>

      {/* Panel de Filtros */}
      <FilterPanel filters={filters} onChange={setFilters} />

      {/* Loading State */}
      {isLoading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SkeletonCard className="h-[120px]" />
            <SkeletonCard className="h-[120px]" />
            <SkeletonCard className="h-[120px]" />
            <SkeletonCard className="h-[120px]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <SkeletonCard className="h-[350px]" />
            <SkeletonCard className="h-[350px]" />
          </div>
        </>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <FiAlertCircle className="text-red-500 mb-3" size={32} />
          <h3 className="text-red-800 font-bold text-lg mb-1">Error de conexión</h3>
          <p className="text-red-600 mb-4 max-w-md">No se pudieron cargar los datos del dashboard. Verifique su conexión y vuelva a intentarlo.</p>
          <button 
            onClick={() => refetch()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Success State */}
      {!isLoading && !isError && data && (
        <>
          {/* KPIs Principales */}
          {isVisible('kpi-summary') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard 
                label="Índice de Riesgo Global" 
                value={`${data.riesgoGlobal} pts`} 
                sub="Promedio institucional" 
                trend={data.riesgoGlobal >= 50 ? 'up' : 'down'}
              />
              <KpiCard 
                label="Alertas Atendidas" 
                value={data.alertasAtendidas.toString()} 
                sub="En los últimos 30 días" 
                trend="down"
              />
              <KpiCard 
                label="Alertas Ignoradas" 
                value={data.alertasIgnoradas.toString()} 
                sub="Requieren atención inmediata" 
                trend="up"
              />
              <KpiCard 
                label="Sin encuesta" 
                value="47" 
                sub="▲ pendientes" 
                trend="up"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfica Comparativa */}
            {isVisible('career-chart') && (
              data.comparativaPorCarrera.length === 0 ? (
                <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm h-[350px]">
                  <FiAlertCircle className="text-[var(--text-muted)] mb-3" size={32} />
                  <h3 className="text-[var(--text-primary)] font-bold text-lg mb-1">Sin datos para mostrar</h3>
                  <p className="text-[var(--text-secondary)] max-w-sm text-sm">No se encontraron registros de riesgo para los filtros seleccionados.</p>
                </div>
              ) : (
                <CareerRiskChart data={data.comparativaPorCarrera} onBarClick={handleBarClick} />
              )
            )}

            {/* Inconsistencias Card */}
            {isVisible('inconsistencies') && (
              <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-[350px]">
                <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-[0.1em] mb-6">Inconsistencias de Servicio</h2>
                <div className="overflow-y-auto flex-1">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-gray-100">
                        <th className="text-left pb-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">Tutor responsable</th>
                        <th className="text-left pb-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">Casos</th>
                        <th className="text-left pb-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {inconsistenciasMock.map((row) => (
                        <tr key={row.tutor} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3.5 text-gray-700 font-medium">{row.tutor}</td>
                          <td className="py-3.5 font-bold" style={{ color: row.casos >= 3 ? "var(--semaforo-rojo)" : "var(--text-secondary)" }}>
                            {row.casos}
                          </td>
                          <td className="py-3.5">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${row.badgeClass}`}>
                              {row.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <button 
                    onClick={() => setIsExportModalOpen(true)}
                    className="text-[11px] font-bold text-[#a10500] hover:underline flex items-center gap-1"
                  >
                    <span>📤</span> Exportar reporte detallado
                  </button>
                  <span className="text-[10px] text-gray-400 italic">Formato PDF / Excel</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Audit note */}
      {isVisible('audit-notice') && (
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 flex items-start gap-3 shadow-sm mt-2">
          <span className="text-lg">🔐</span>
          <p className="leading-relaxed">
            <strong>Aviso de Auditoría:</strong> El módulo de auditoría es técnicamente independiente del módulo de gestión de alertas (RP-02). 
            Los tutores no tienen acceso a sus propios registros de auditoría para garantizar la integridad del proceso.
          </p>
        </div>
      )}

      {/* Drawer para Drill-Down */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Detalle de Riesgo"
      >
        {drillDownCareer && (
          <DrillDownPanel
            request={{ careerId: drillDownCareer, semester: filters.semester }}
            onNavigateToStudent={handleNavigateToStudent}
          />
        )}
      </Drawer>

      {/* Modal para Personalización */}
      <CustomizeDashboardModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
      />

      {/* Modal para Exportación */}
      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        filters={filters}
      />
    </div>
  );
}