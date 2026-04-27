/**
 * @page SurveyPage
 * @epic Épica 3 — Encuesta de Contexto (Estudiante)
 * @hu HU007
 */

import React from 'react';
import { surveyService } from '@/src/services/api/surveys';
import { SurveyWizard } from '@/src/features/encuesta/components/SurveyWizard';
import Link from 'next/link';

interface SurveyPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const { token } = await params;
  const validation = await surveyService.validateToken(token);

  if (!validation.valid || validation.expired) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-6xl mb-6">⏳</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {validation.expired ? 'Enlace Expirado' : 'Enlace Inválido'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {validation.expired 
              ? 'Este enlace de encuesta ha superado los 7 días de validez. Por seguridad, debes solicitar uno nuevo.'
              : 'El enlace al que intentas acceder no es válido o ha sido desactivado.'}
          </p>
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all">
            Solicitar nuevo enlace
          </button>
          <div className="mt-6">
            <Link href="/" className="text-sm text-slate-500 hover:text-blue-600 underline">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!validation.survey) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  return <SurveyWizard survey={validation.survey} />;
}
