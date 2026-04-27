/**
 * @page ReportesPage
 * @epic EPICA-6 Panel Ejecutivo y Reportes
 * @hu HU018 — Exportar reportes en múltiples formatos
 * @privacy Solo accesible para administradores. Nunca incluye datos clínicos.
 */
'use client';

import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { ExportModal } from '@/src/features/dashboard-admin/components/ExportModal';

export default function ReportesPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold text-sm uppercase tracking-wider mb-1">
          <FiDownload />
          <span>Exportación de datos</span>
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Exportar Datos</h1>
        <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
          Genera reportes en PDF o Excel con los datos del ciclo actual.
        </p>
      </div>

      <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-section)] flex items-center justify-center mb-4">
          <FiDownload size={28} className="text-[var(--text-muted)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Exportar reportes institucionales</h2>
        <p className="text-[var(--text-secondary)] max-w-md text-sm mb-6">
          Descarga el reporte ejecutivo del período actual en el formato que necesitas.
          Los datasets mayores a 10,000 filas se procesan en segundo plano.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all"
          >
            <FiDownload size={16} />
            Generar reporte PDF
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all"
          >
            <FiDownload size={16} />
            Exportar a Excel
          </button>
        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        filters={{}}
      />
    </div>
  );
}
