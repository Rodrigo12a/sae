'use client';

import React from 'react';
import { FiPieChart, FiUsers, FiAlertCircle, FiArrowRight, FiActivity, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import { usePendingReferrals } from '@/src/features/derivaciones/hooks/usePendingReferrals';
import { Drawer } from '@/src/components/ui/Drawer';
import { ReferralContextPanel } from '@/src/features/medico/components/ReferralContextPanel/ReferralContextPanel';
import { PendingReferral } from '@/src/features/derivaciones/types';


export default function MedicoDashboardPage() {
  const { data: allReferrals, isLoading } = usePendingReferrals();
  const [selectedReferral, setSelectedReferral] = React.useState<PendingReferral | null>(null);
  
  // Filtramos las derivaciones que corresponden al departamento médico
  const derivacionesPendientes = allReferrals?.filter(d => d.department === 'medical') || [];


  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Dashboard Médico</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Gestión de salud estudiantil y seguimiento de derivaciones.
          </p>
        </div>
        <Link 
          href="/medico/jornada" 
          className="px-6 py-2.5 bg-[var(--accent-primary)] text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <FiActivity /> Iniciar Jornada de Salud
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Derivaciones Hoy', value: '5', color: 'text-orange-600', bg: 'bg-orange-50', icon: <FiAlertCircle /> },
          { label: 'Evaluados (Mes)', value: '1,240', color: 'text-blue-600', bg: 'bg-blue-50', icon: <FiUsers /> },
          { label: 'Alertas Médicas', value: '12', color: 'text-red-600', bg: 'bg-red-50', icon: <FiActivity /> },
          { label: 'Efectividad Seguimiento', value: '94%', color: 'text-green-600', bg: 'bg-green-50', icon: <FiPieChart /> },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all group">
            <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {kpi.icon}
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{kpi.label}</p>
            <p className="text-3xl font-black text-[var(--text-primary)] mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Referrals List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <FiAlertCircle className="text-orange-500" />
              Derivaciones Pendientes por Atender
            </h2>
            <Link href="/medico/estudiantes" className="text-sm font-bold text-blue-600 hover:underline">Ver todo</Link>
          </div>

          <div className="bg-white border border-[var(--border-subtle)] rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Cargando derivaciones...</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {derivacionesPendientes.map((d) => (
                  <div key={d.id} className="p-5 hover:bg-gray-50/50 transition-all flex items-center justify-between group">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 w-2 h-2 rounded-full bg-orange-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[var(--text-primary)]">{d.studentName}</h3>
                          {d.aiValidation?.isAutoReport && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-[10px] font-black uppercase tracking-tighter">
                              Crítica
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{d.descripcionObservable}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1 font-medium"><FiUsers /> Estudiante ID: {d.studentId}</span>
                          <span className="flex items-center gap-1"><FiActivity /> {new Date(d.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedReferral(d)}
                      className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all"
                      title="Ver contexto de derivación"
                    >
                      <FiArrowRight className="w-5 h-5" />
                    </button>
                    <Link 
                      href={`/medico/estudiante/${d.studentId}`}
                      className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-500 hover:text-white transition-all ml-2"
                      title="Ir al expediente completo"
                    >
                      <FiExternalLink className="w-5 h-5" />
                    </Link>

                  </div>
                ))}
                {derivacionesPendientes.length === 0 && (
                  <div className="p-12 text-center">
                    <FiUsers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No hay derivaciones pendientes hoy.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Panel / Quick Links */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] px-2">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link 
              href="/medico/historial"
              className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all group"
            >
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FiActivity /> Cargas Masivas
              </h3>
              <p className="text-blue-100 text-sm mt-2 leading-relaxed">
                Gestiona y revisa los registros históricos de las jornadas de salud anteriores.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/80 group-hover:text-white">
                Ver historial <FiArrowRight />
              </div>
            </Link>

            <div className="p-6 bg-white border border-[var(--border-subtle)] rounded-2xl shadow-sm">
              <h3 className="font-bold text-[var(--text-primary)]">Resumen del Día</h3>
              <div className="mt-4 space-y-4">
                {[
                  { label: 'Jornada Actual', value: '45/120', sub: 'Estudiantes cargados' },
                  { label: 'Alertas Identificadas', value: '3', sub: 'Pendientes de bitácora' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-bold text-[var(--text-primary)]">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-[40%]" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar de Contexto (Drawer) */}
      <Drawer
        isOpen={!!selectedReferral}
        onClose={() => setSelectedReferral(null)}
        title="Detalles del Caso Especial"
      >
        {selectedReferral && (
          <div className="space-y-6">
            <ReferralContextPanel 
              derivation={{
                id: selectedReferral.id,
                studentName: selectedReferral.studentName,
                tutorName: 'Tutor Institucional', // Idealmente vendría del API
                fecha: new Date(selectedReferral.createdAt).toLocaleDateString(),
                motivo: selectedReferral.descripcionObservable,
                prioridad: selectedReferral.aiValidation?.isAutoReport ? 'crítica' : 'alta'
              }} 
            />
            
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                <FiActivity />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">Acción Requerida</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Revisa los antecedentes y realiza la evaluación clínica en la sección de expedientes.
                </p>
                <Link 
                  href={`/medico/estudiante/${selectedReferral.studentId}`}
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all"
                >
                  Abrir Expediente Completo
                </Link>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>

  );
}
