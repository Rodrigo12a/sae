/**
 * @page CatalogoAlertasPage
 * @epic EPICA-6 Panel Ejecutivo
 * @hu HU016 — Configuración del catálogo de alertas
 * @privacy Solo accesible para administradores
 */
'use client';

import { FiClipboard } from 'react-icons/fi';

export default function CatalogoAlertasPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold text-sm uppercase tracking-wider mb-1">
          <FiClipboard />
          <span>Gestión de catálogo</span>
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Catálogo de Alertas</h1>
        <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
          Configuración de etiquetas operativas y criterios de activación de alertas.
        </p>
      </div>

      <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-section)] flex items-center justify-center mb-4">
          <FiClipboard size={28} className="text-[var(--text-muted)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Módulo en desarrollo</h2>
        <p className="text-[var(--text-secondary)] max-w-md text-sm">
          La configuración del catálogo de alertas y etiquetas operativas estará disponible en la próxima versión del sistema.
        </p>
        <span className="mt-6 inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-200">
          Próximamente
        </span>
      </div>
    </div>
  );
}
