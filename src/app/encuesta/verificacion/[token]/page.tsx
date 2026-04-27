/**
 * @page MicroSurveyPage
 * @epic EPICA-8 Auditoría y Control de Calidad
 * @hu HU022
 */

import React from 'react';
import { MicroSurvey } from '@/src/features/auditoria/components/MicroSurvey';
import { FiShield } from 'react-icons/fi';

interface MicroSurveyPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function MicroSurveyPage({ params }: MicroSurveyPageProps) {
  const { token } = await params;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header Institucional */}
      <header className="w-full py-6 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-md mx-auto flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FiShield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">SAE</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">Auditoría de Calidad</p>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="p-4 pt-10">
        <MicroSurvey token={token} />
      </main>

      {/* Footer minimalista */}
      <footer className="w-full py-10 text-center">
        <p className="text-xs text-slate-400">
          © 2026 Sistema Inteligente de Acompañamiento Estudiantil
        </p>
      </footer>
    </div>
  );
}
