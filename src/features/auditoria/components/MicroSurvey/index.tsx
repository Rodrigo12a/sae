/**
 * @module MicroSurvey
 * @epic EPICA-8 Auditoría y Control de Calidad
 * @hu HU022
 */

'use client';

import React from 'react';
import { useMicroSurvey } from '../../hooks/useMicroSurvey';
import { MicroSurveyWizard } from './MicroSurveyWizard';
import { SuccessStep } from './SuccessStep';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';
import { FiInfo, FiClock, FiAlertTriangle } from 'react-icons/fi';

interface MicroSurveyProps {
  token: string;
}

export const MicroSurvey: React.FC<MicroSurveyProps> = ({ token }) => {
  const { status, data, isSubmitting, submit, retry } = useMicroSurvey(token);

  if (status === 'loading') {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <SkeletonCard height={400} />
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="max-w-md mx-auto text-center p-12 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border-2 border-amber-100 dark:border-amber-900/20 space-y-6">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto">
          <FiClock className="w-10 h-10 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-500">Enlace Expirado</h2>
          <p className="text-amber-700 dark:text-amber-600/80">
            Este link de verificación tiene más de 48 horas de antigüedad y ya no es válido por motivos de seguridad.
          </p>
        </div>
        <p className="text-sm text-amber-600/60 italic">
          Si crees que esto es un error, contacta a la coordinación de tu carrera.
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto text-center p-12 bg-red-50 dark:bg-red-900/10 rounded-2xl border-2 border-red-100 dark:border-red-900/20 space-y-6">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
          <FiAlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-500">Algo salió mal</h2>
          <p className="text-red-700 dark:text-red-600/80">
            No pudimos cargar la encuesta de verificación. El link podría ser inválido.
          </p>
        </div>
        <button
          onClick={retry}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (status === 'success') {
    return <SuccessStep />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {data && (
        <MicroSurveyWizard 
          data={data} 
          onComplete={submit} 
          isSubmitting={isSubmitting} 
        />
      )}
      
      {/* Banner de Privacidad */}
      <div className="max-w-md mx-auto flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
        <FiInfo className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="font-semibold">Nota de Privacidad:</span> Tus respuestas son confidenciales y se utilizan exclusivamente para auditar la calidad del servicio de tutoría institucional.
        </p>
      </div>
    </div>
  );
};
