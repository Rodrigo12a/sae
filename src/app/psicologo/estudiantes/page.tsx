/**
 * @page EstudiantesPsicologoPage
 * @epic EPICA-5 Derivaciones y Atención Especializada
 * @hu HU014 — Gestión de casos y expedientes
 */
'use client';

import React from 'react';
import { FiUsers, FiSearch, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';

export default function EstudiantesPsicologoPage() {
  // Mock de estudiantes atendidos
  const estudiantesAtendidos = [
    { id: 'S1001', name: 'María González Pérez', carrera: 'Ing. en Sistemas', semaforo: 'rojo', ultimaAtencion: '2026-04-20' },
    { id: 'S1004', name: 'Roberto Jasso', carrera: 'Lic. en Derecho', semaforo: 'amarillo', ultimaAtencion: '2026-04-22' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <span className="p-2 bg-[var(--psico-private-bg)] text-[var(--psico-accent)] rounded-lg">
              <FiUsers className="w-6 h-6" />
            </span>
            Directorio de Estudiantes
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Consulta el historial de apoyo de estudiantes atendidos por el departamento.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[var(--border-subtle)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border-subtle)] bg-gray-50/50">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, matrícula o carrera..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[var(--psico-accent)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 tracking-wider">Estudiante</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 tracking-wider">Carrera</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 tracking-wider">Última Atención</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {estudiantesAtendidos.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[var(--text-primary)]">{e.name}</span>
                      <span className="text-xs text-gray-400 font-mono">{e.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{e.carrera}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      e.semaforo === 'rojo' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {e.semaforo === 'rojo' ? '🔴 Urgente' : '🟡 En seguimiento'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{e.ultimaAtencion}</td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/psicologo/estudiante/${e.id}`}
                      className="inline-flex items-center gap-2 text-[var(--psico-accent)] font-bold text-sm hover:underline"
                    >
                      Ver Expediente <FiExternalLink />
                    </Link>
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
