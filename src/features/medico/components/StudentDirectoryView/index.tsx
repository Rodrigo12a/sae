/**
 * @module StudentDirectoryView
 * @epic EPICA-4 Módulo Médico con Privacidad Diferencial
 * @hu HU010 — Directorio de consulta de expedientes
 * @ux UXMM-05, UXMM-06
 * @description Directorio de búsqueda y consulta de estudiantes para el rol médico.
 */

'use client';

import React, { useState } from 'react';
import { useGroupStudents } from '../../hooks/useGroupStudents';
import { Semaforo } from '@/src/components/ui/Semaforo';
import Link from 'next/link';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';
import { medicalService } from '@/src/services/api/medical';
import { FiSearch, FiUsers, FiFilter, FiExternalLink, FiActivity, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { usePendingReferrals } from '@/src/features/derivaciones/hooks/usePendingReferrals';
import { Drawer } from '@/src/components/ui/Drawer';
import { ReferralContextPanel } from '../ReferralContextPanel/ReferralContextPanel';
import { PendingReferral } from '@/src/features/derivaciones/types';

export function StudentDirectoryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('G501'); // Mock group for demo
  const [selectedReferral, setSelectedReferral] = useState<PendingReferral | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const { data: students, isLoading, error } = useGroupStudents(selectedGroup);
  const { data: allReferrals } = usePendingReferrals();
  
  const medicalReferrals = allReferrals?.filter(d => d.department === 'medical') || [];

  const filteredStudents = students?.filter(s =>
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.matricula.includes(searchTerm)
  );


  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold text-sm uppercase tracking-widest mb-1">
            <FiActivity />
            <span>Módulo Clínico</span>
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            Directorio Estudiantil
            <span className="px-2 py-1 bg-[var(--color-info-light)] text-[var(--color-info)] text-xs rounded-lg font-bold">
              PRIVACIDAD DIFERENCIAL ACTIVADA
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">
            Consulta y gestiona expedientes clínicos y antecedentes de salud.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Link
            href="/medico/jornada"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[var(--text-primary)] font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <FiCalendar /> Nueva Jornada
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
        <div className="relative md:col-span-2">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o matrícula..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-bold appearance-none cursor-pointer"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="G501">Grupo 501</option>
            <option value="G502">Grupo 502</option>
            <option value="G503">Grupo 503</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-[var(--border-subtle)] rounded-3xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map(i => <SkeletonCard key={i} className="h-20" />)}
          </div>
        ) : error ? (
          <div className="p-20 text-center">
            <p className="text-red-500 font-bold">Error al cargar el directorio</p>
          </div>
        ) : filteredStudents && filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-[var(--border-subtle)]">
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Estudiante</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Matrícula</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Expediente</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Estado Clínico</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredStudents.map((student) => (
                  <tr key={student.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center font-black text-xs border border-red-100">
                          {student.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-bold text-[var(--text-primary)]">{student.studentName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                        {student.matricula}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {student.existingRecord ? (
                        <span className="inline-flex items-center gap-1.5 text-[var(--semaforo-verde)] text-xs font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--semaforo-verde)] animate-pulse" />
                          Completado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[var(--semaforo-amarillo)] text-xs font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--semaforo-amarillo)]" />
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-2">
                        <Semaforo
                          estado={student.selectedConditions.length > 0 ? 'revisar' : 'verde'}
                          etiqueta={student.selectedConditions.length > 0 ? 'Bajo revisión' : 'Sin hallazgos'}
                          compact
                        />
                        {medicalReferrals.find(r => r.studentId === student.studentId) && (
                          <button 
                            onClick={() => {
                              const ref = medicalReferrals.find(r => r.studentId === student.studentId);
                              if (ref) {
                                setSelectedReferral(ref);
                                setIsDrawerOpen(true);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black uppercase tracking-wider hover:bg-indigo-100 transition-all border border-indigo-100 w-fit"
                          >
                            <FiAlertCircle /> Caso Derivado
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link
                        href={`/medico/estudiante/${student.studentId}`}
                        title="Ver Expediente"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm font-bold text-xs"
                      >
                        <FiExternalLink /> Ver Detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <FiUsers size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No se encontraron estudiantes</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Intenta ajustar los filtros de búsqueda o cambiar el grupo seleccionado.
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Estudiantes</p>
          <p className="text-2xl font-black text-[var(--text-primary)]">{filteredStudents?.length || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Con Expediente</p>
          <p className="text-2xl font-black text-[var(--semaforo-verde)]">{filteredStudents?.filter(s => s.existingRecord).length || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pendientes</p>
          <p className="text-2xl font-black text-[var(--semaforo-amarillo)]">{filteredStudents?.filter(s => !s.existingRecord).length || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Última Jornada</p>
          <p className="text-2xl font-black text-[var(--color-info)]">Hoy</p>
        </div>
      </div>



      {/* Sidebar de Contexto (Drawer) */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Contexto de Derivación Especial"
      >
        {selectedReferral && (
          <div className="space-y-6">
            <ReferralContextPanel 
              derivation={{
                id: selectedReferral.id,
                studentName: selectedReferral.studentName,
                tutorName: 'Tutor Institucional',
                fecha: new Date(selectedReferral.createdAt).toLocaleDateString(),
                motivo: selectedReferral.descripcionObservable,
                prioridad: selectedReferral.aiValidation?.isAutoReport ? 'crítica' : 'alta'
              }} 
            />
            
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-4">
              <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <FiActivity />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-900">Seguimiento Clínico</h4>
                <p className="text-xs text-indigo-700 mt-1">
                  Este estudiante ha sido derivado para valoración médica. Revisa el motivo y registra tus hallazgos.
                </p>
                <Link 
                  href={`/medico/estudiante/${selectedReferral.studentId}`}
                  className="inline-block mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all"
                >
                  Ir al Expediente Completo
                </Link>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>

  );
}
