'use client';

import React from 'react';
import { KPIFilters } from '../../types';

/**
 * @module FilterPanel
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU016
 * @ux UXPA-03
 */

interface FilterPanelProps {
  filters: KPIFilters;
  onChange: (filters: KPIFilters) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-[var(--border-subtle)] shadow-sm flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 w-full">
        <label htmlFor="careerId" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Carrera</label>
        <select
          id="careerId"
          value={filters.careerId || ''}
          onChange={(e) => onChange({ ...filters, careerId: e.target.value || undefined })}
          className="w-full bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
        >
          <option value="">Todas las carreras</option>
          <option value="ing-sistemas">Ing. en Sistemas</option>
          <option value="ing-industrial">Ing. Industrial</option>
          <option value="lic-administracion">Lic. en Administración</option>
          <option value="lic-derecho">Lic. en Derecho</option>
        </select>
      </div>
      
      <div className="flex-1 w-full">
        <label htmlFor="semester" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">Semestre</label>
        <select
          id="semester"
          value={filters.semester || ''}
          onChange={(e) => onChange({ ...filters, semester: e.target.value ? parseInt(e.target.value) : undefined })}
          className="w-full bg-[var(--bg-section)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
        >
          <option value="">Todos los semestres</option>
          <option value="1">1º Semestre</option>
          <option value="2">2º Semestre</option>
          <option value="3">3º Semestre</option>
          <option value="4">4º Semestre</option>
          <option value="5">5º Semestre</option>
          <option value="6">6º Semestre</option>
          <option value="7">7º Semestre</option>
          <option value="8">8º Semestre</option>
        </select>
      </div>
    </div>
  );
};
