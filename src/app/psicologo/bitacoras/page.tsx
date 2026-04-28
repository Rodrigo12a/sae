/**
 * @page BitacorasPsicologoPage
 * @epic EPICA-5 Derivaciones y Atención Especializada
 * @hu HU015 — Bitácora confidencial
 */
'use client';

import React from 'react';
import { FiBook, FiSearch, FiFilter } from 'react-icons/fi';

export default function BitacorasPsicologoPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <span className="p-2 bg-[var(--psico-private-bg)] text-[var(--psico-accent)] rounded-lg">
              <FiBook className="w-6 h-6" />
            </span>
            Mis Bitácoras
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Registro histórico de intervenciones y notas clínicas confidenciales.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[var(--border-subtle)] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border-subtle)] bg-gray-50/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por estudiante o folio..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[var(--psico-accent)]"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              <FiFilter /> Filtrar
            </button>
          </div>
        </div>

        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-[var(--psico-private-bg)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiBook className="text-[var(--psico-accent)] w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Sin bitácoras registradas</h3>
          <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto">
            Aún no has registrado intervenciones clínicas. Las notas que guardes en los casos derivados aparecerán aquí.
          </p>
        </div>
      </div>
    </div>
  );
}
