/**
 * @page TutorAlertasPage
 * @epic EPICA-2 Dashboard y Gestión de Alertas
 * @hu HU003, HU006 — Historial y gestión de alertas
 */
'use client';

import React, { useState } from 'react';
import { FiLayers, FiFilter, FiSearch } from 'react-icons/fi';
import { usePriorityAlerts } from '@/src/features/dashboard-tutor/hooks/usePriorityAlerts';
import { AlertCard } from '@/src/features/dashboard-tutor/components/AlertCard';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';
import { AIEngineStatusBanner } from '@/src/features/dashboard-tutor/components/AIEngineStatusBanner';

export default function TutorAlertasPage() {
  const { alerts, isLoading, error, refetch } = usePriorityAlerts();
  const isError = !!error;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  const filteredAlerts = alerts?.filter(alert => {
    const matchesSearch = alert.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === 'todos' || alert.semaforoEstado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in p-6">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold text-sm uppercase tracking-wider mb-1">
          <FiLayers />
          <span>Gestión de Seguimiento</span>
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Historial de Alertas</h1>
        <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
          Consulta y gestiona todas las alertas activas de tus tutorados.
        </p>
      </div>

      <AIEngineStatusBanner />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de estudiante..."
            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary-light)] outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FiFilter className="text-gray-400" />
          <select
            className="flex-1 md:w-48 px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm bg-white"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="rojo">Urgente (Rojo)</option>
            <option value="amarillo">Seguimiento (Amarillo)</option>
            <option value="verde">Normal (Verde)</option>
            <option value="revisar">Inconsistencia (Revisar)</option>
          </select>
        </div>
      </div>

      {/* Grid de Alertas */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} className="h-48" />)}
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-red-500 font-bold mb-4">Error al cargar las alertas</p>
          <button onClick={() => refetch()} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-xl font-bold">
            Reintentar
          </button>
        </div>
      ) : filteredAlerts && filteredAlerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-[var(--text-muted)] font-medium">No se encontraron alertas con los filtros actuales.</p>
        </div>
      )}
    </div>
  );
}
