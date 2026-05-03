/**
 * @component SurveyHeader
 * @epic Épica 3 — Encuesta de Contexto (Estudiante)
 * @hu HU007
 */

import React from 'react';
import { ProgressBar } from '@/src/components/ui/ProgressBar';

interface SurveyHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
}

export const SurveyHeader: React.FC<SurveyHeaderProps> = ({ 
  title, 
  currentStep, 
  totalSteps 
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <header className="sticky top-0 z-10 bg-[var(--card-bg)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 py-4 mb-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-lg font-semibold text-[var(--text-primary)] mb-3 truncate">
          {title}
        </h1>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
            <span>Pregunta {currentStep} de {totalSteps}</span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <ProgressBar progress={progress} height="6px" />
        </div>
      </div>
    </header>
  );
};
