/**
 * @component SurveyWizard
 * @epic Épica 3 — Encuesta de Contexto (Estudiante)
 * @hu HU007
 * @ux UXEN-01 to UXEN-08
 */

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Survey, SurveyResponse } from '../../types';
import { SurveyHeader } from '../SurveyHeader';
import { QuestionStep } from '../QuestionStep';
import { OfflineBanner } from '../OfflineBanner';
import { useOffline } from '@/src/hooks/useOffline';
import { surveyService } from '@/src/services/api/surveys';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

interface SurveyWizardProps {
  survey: Survey;
}

export const SurveyWizard: React.FC<SurveyWizardProps> = ({ survey }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startTime = useRef<number>(Date.now());
  const { isOffline } = useOffline();
  const router = useRouter();

  // Guardar en localStorage si está offline (QA-07)
  useEffect(() => {
    if (Object.keys(responses).length > 0) {
      localStorage.setItem(`survey_draft_${survey.id}`, JSON.stringify(responses));
    }
  }, [responses, survey.id]);

  // Cargar borrador al inicio
  useEffect(() => {
    const draft = localStorage.getItem(`survey_draft_${survey.id}`);
    if (draft) {
      setResponses(JSON.parse(draft));
    }
  }, [survey.id]);

  const handleResponseChange = (questionId: string, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = async () => {
    if (currentStep < survey.questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const formattedResponses: SurveyResponse[] = Object.entries(responses).map(([questionId, value]) => ({
      questionId,
      value
    }));

    const completionTimeMs = Date.now() - startTime.current;

    const payload = {
      surveyId: survey.id,
      responses: formattedResponses,
      completionTimeMs,
      offlineCached: isOffline
    };

    try {
      const response = await surveyService.submitSurvey(payload);
      if (response.success) {
        localStorage.removeItem(`survey_draft_${survey.id}`);
        // Redirigir a pantalla de éxito (HU008)
        // Por ahora redirigimos a una sub-ruta de éxito o mostramos estado
        // TODO: Implement HU008 Success Page
        router.push(`/encuesta/success?name=${encodeURIComponent('Estudiante')}&surveyId=${survey.id}`);
      }
    } catch (error) {
      console.error("Error submitting survey", error);
      // Si falla y está offline, el usuario ya tiene el banner, pero podríamos mostrar un error específico
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = survey.questions[currentStep];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] pb-20">
      <OfflineBanner isVisible={isOffline} />
      
      <SurveyHeader 
        title={survey.title} 
        currentStep={currentStep + 1} 
        totalSteps={survey.questions.length} 
      />

      <main className="pt-6">
        <AnimatePresence mode="wait">
          <QuestionStep
            key={currentQuestion.id}
            question={currentQuestion}
            value={responses[currentQuestion.id] || ''}
            onChange={(val) => handleResponseChange(currentQuestion.id, val)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentStep === 0}
            isLast={currentStep === survey.questions.length - 1}
          />
        </AnimatePresence>
      </main>

      {isSubmitting && (
        <div className="fixed inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-medium text-[var(--text-primary)]">Guardando tus respuestas...</p>
        </div>
      )}
    </div>
  );
};
