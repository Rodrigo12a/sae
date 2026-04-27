/**
 * @module MicroSurveyWizard
 * @epic EPICA-8 Auditoría y Control de Calidad
 * @hu HU022
 * @ux UXAU-01 mobile-first, una pregunta por pantalla
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiStar, FiArrowRight, FiMessageSquare } from 'react-icons/fi';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { MicroSurveyData, MicroSurveyResponse } from '../../types';

interface MicroSurveyWizardProps {
  data: MicroSurveyData;
  onComplete: (responses: MicroSurveyResponse) => void;
  isSubmitting: boolean;
}

export const MicroSurveyWizard: React.FC<MicroSurveyWizardProps> = ({ data, onComplete, isSubmitting }) => {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState<Partial<MicroSurveyResponse>>({});

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  
  const handleComplete = () => {
    if (responses.wasIntervened !== undefined && responses.helpfulnessScore !== undefined) {
      onComplete(responses as MicroSurveyResponse);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Verificación de Apoyo</h2>
          <span className="text-sm font-medium text-slate-500">Paso {step} de {totalSteps}</span>
        </div>
        <ProgressBar progress={progress} />
      </div>

      <div className="p-8 min-h-[300px] flex flex-col">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Hola <span className="font-semibold text-slate-800 dark:text-white">{data.studentName}</span>, para nosotros es muy importante tu acompañamiento.
                </p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                  ¿Te reuniste con <span className="text-blue-600">{data.tutorName}</span> para conversar sobre tu situación de <span className="italic">{data.alertCategory}</span>?
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setResponses({ ...responses, wasIntervened: true });
                    nextStep();
                  }}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                    responses.wasIntervened === true 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 bg-slate-50 dark:bg-slate-800/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-3">
                    <FiCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="font-semibold">Sí, nos reunimos</span>
                </button>

                <button
                  onClick={() => {
                    setResponses({ ...responses, wasIntervened: false, helpfulnessScore: 0 });
                    // Si no hubo intervención, saltamos al feedback o terminamos
                    setStep(3);
                  }}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                    responses.wasIntervened === false 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-red-200 bg-slate-50 dark:bg-slate-800/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-3">
                    <FiX className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="font-semibold">No, no hubo reunión</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                ¿Qué tan útil te resultó la orientación recibida?
              </h3>
              
              <div className="flex justify-between items-center py-4 px-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => {
                      setResponses({ ...responses, helpfulnessScore: score });
                    }}
                    className={`group flex flex-col items-center space-y-2 transition-all`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      (responses.helpfulnessScore || 0) >= score 
                        ? 'bg-amber-400 text-white shadow-lg scale-110' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-amber-100'
                    }`}>
                      <FiStar className={`w-6 h-6 ${ (responses.helpfulnessScore || 0) >= score ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-xs font-medium text-slate-500">{score}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-slate-400 px-2 italic">
                <span>Poco útil</span>
                <span>Muy útil</span>
              </div>

              <button
                disabled={!responses.helpfulnessScore}
                onClick={nextStep}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
              >
                <span>Continuar</span>
                <FiArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <FiMessageSquare className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                  ¿Algún comentario adicional?
                </h3>
              </div>
              
              <textarea
                placeholder="Escribe aquí tu opinión (opcional)..."
                value={responses.comments || ''}
                onChange={(e) => setResponses({ ...responses, comments: e.target.value })}
                className="w-full h-32 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:border-blue-500 focus:bg-white transition-all outline-none resize-none"
              />

              <button
                disabled={isSubmitting}
                onClick={handleComplete}
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-green-200 dark:shadow-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Enviando...</span>
                  </span>
                ) : (
                  <span>Finalizar Verificación</span>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
