/**
 * @module MedicoHistorialPage
 * @epic EPICA-4 Módulo Médico con Privacidad Diferencial
 * @hu HU011 — Historial de jornadas y registros previos
 * @description Vista histórica de las jornadas de salud realizadas y resultados agregados.
 */

import React from 'react';
import { FiActivity, FiSearch, FiDownload, FiCalendar } from 'react-icons/fi';

export default function MedicoHistorialPage() {
  // Mock de historial de jornadas
  const historialJornadas = [
    { id: 'J-2026-001', fecha: '2026-04-15', estudiantes: 45, alertas: 3, estado: 'completado' },
    { id: 'J-2026-002', fecha: '2026-04-22', estudiantes: 120, alertas: 8, estado: 'completado' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FiActivity className="w-6 h-6" />
            </span>
            Historial de Jornadas
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Consulta y descarga los registros de jornadas de salud previas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Estudiantes</span>
          <div className="text-3xl font-bold text-[var(--text-primary)] mt-1">165</div>
          <div className="text-xs text-green-600 mt-1 font-medium">Evaluados este mes</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Alertas Médicas</span>
          <div className="text-3xl font-bold text-red-600 mt-1">11</div>
          <div className="text-xs text-red-400 mt-1 font-medium">Requieren seguimiento</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Jornadas</span>
          <div className="text-3xl font-bold text-blue-600 mt-1">2</div>
          <div className="text-xs text-blue-400 mt-1 font-medium">Ciclo escolar actual</div>
        </div>
      </div>

      <div className="bg-white border border-[var(--border-subtle)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border-subtle)] bg-gray-50/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por ID de jornada o fecha..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-all">
            <FiDownload /> Exportar Historial
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 tracking-wider">ID Jornada</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 tracking-wider text-center">Estudiantes</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 tracking-wider text-center">Alertas</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historialJornadas.map((j) => (
                <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-bold text-blue-600">{j.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FiCalendar className="text-gray-400" />
                      {j.fecha}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-gray-900">{j.estudiantes}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold ${j.alertas > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {j.alertas}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-green-50 text-green-600 border border-green-100">
                      {j.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <FiDownload className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
