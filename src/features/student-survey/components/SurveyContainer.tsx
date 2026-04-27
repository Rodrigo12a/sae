/**
 * @component SurveyContainer
 * @epic EPICA-1 / HU007 Encuesta Estudiantil
 * @description Contenedor principal de la encuesta de descerción. 
 * Implementa un flujo de una pregunta por pantalla para maximizar el enfoque del estudiante.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SURVEY_QUESTIONS, LIKERT_OPTIONS, Question } from '../types/questions';
import { surveyService } from '../services/survey.service';
import { toast } from 'sonner';
import { FiArrowRight, FiArrowLeft, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const SurveyContainer: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(SURVEY_QUESTIONS.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [step, setStep] = useState<'welcome' | 'consent' | 'questions'>('welcome');

  const currentQuestion = SURVEY_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / SURVEY_QUESTIONS.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);

    // Auto-advance if it's not a numeric input (better UX)
    if (currentQuestion.type !== 'numeric' && currentIndex < SURVEY_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  const handleNext = () => {
    if (answers[currentIndex] === null) {
      toast.error("Por favor, responde antes de continuar.");
      return;
    }

    // Validación específica de Edad (Pregunta 3, ID 3)
    if (currentQuestion.id === 3) {
      const age = answers[currentIndex] as number;
      if (age < 17) {
        toast.error("El sistema solo acepta alumnos de 17 años en adelante.");
        return;
      }
    }
    if (currentIndex < SURVEY_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      toast.error("Aún faltan preguntas por responder.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Excluimos la Edad (index 0) y el Género (index 1),
      // enviando solo las respuestas a partir del índice 2.
      const payload = (answers as number[]).slice(2);
      await surveyService.submit(payload);
      setIsFinished(true);
      toast.success("Cuestionario enviado correctamente.");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-white rounded-3xl border border-gray-100 shadow-xl max-w-2xl mx-auto animate-fade-in">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100">
          <FiCheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4 tracking-tight">¡Cuestionario Completado!</h2>
        <p className="text-[var(--text-secondary)] font-medium leading-relaxed mb-8">
          Tus respuestas han sido recibidas y serán procesadas por nuestro sistema de acompañamiento institucional.
          Apreciamos tu honestidad y tiempo.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-[var(--brand-primary)] text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  if (step === 'welcome') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl animate-fade-in">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 rotate-3 shadow-inner">
          <FiInfo size={40} />
        </div>
        <h1 className="text-4xl font-black text-[var(--text-primary)] mb-6 tracking-tight leading-tight">
          Cuestionario de Acompañamiento Estudiantil
        </h1>
        <p className="text-lg text-[var(--text-secondary)] font-medium mb-10 leading-relaxed">
          Este cuestionario nos ayuda a entender tu situación actual y brindarte el apoyo necesario para asegurar tu éxito académico.
          Tus respuestas son confidenciales y se procesarán únicamente con fines de acompañamiento.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 block">Duración</span>
            <span className="text-lg font-bold text-gray-700">~5 minutos</span>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 block">Preguntas</span>
            <span className="text-lg font-bold text-gray-700">50 ítems</span>
          </div>
        </div>
        <button
          onClick={() => setStep('consent')}
          className="w-full bg-[var(--brand-primary)] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          Comenzar Cuestionario
          <FiArrowRight size={20} />
        </button>
      </div>
    );
  }

  if (step === 'consent') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl animate-fade-in">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <FiInfo size={30} />
        </div>
        <h2 className="text-3xl font-black text-[var(--text-primary)] mb-6 tracking-tight">Consentimiento de Privacidad</h2>
        <div className="prose prose-sm text-[var(--text-secondary)] font-medium mb-10 h-64 overflow-y-auto p-6 bg-gray-50 rounded-2xl border border-gray-100 leading-relaxed">
          <p className="mb-4">
            Al participar en este cuestionario, aceptas que la <strong>Universidad Politécnica de Tlaxcala (UPTX)</strong> recolecte y procese tus datos con el fin de identificar posibles riesgos de deserción escolar.
          </p>
          <p className="mb-4">
            Los datos recolectados incluyen información socioeconómica, académica, psicoemocional y psicosocial. Esta información será tratada con estricta confidencialidad bajo los lineamientos de la Ley General de Protección de Datos Personales.
          </p>
          <p className="mb-4">
            Los resultados serán visibles únicamente para el personal autorizado (Administradores, Médicos y Psicólogos de la institución) según el rol asignado para tu seguimiento.
          </p>
          <p>
            Tu participación es voluntaria, pero fundamental para que podamos ofrecerte las herramientas y el apoyo que necesitas.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setStep('welcome')}
            className="flex-1 py-5 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all"
          >
            Regresar
          </button>
          <button
            onClick={() => setStep('questions')}
            className="flex-3 bg-emerald-600 text-white font-black py-5 px-10 rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            Acepto y deseo continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Progress Header */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 block">Progreso de la encuesta</span>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Pregunta {currentIndex + 1} de {SURVEY_QUESTIONS.length}
            </h3>
          </div>
          <span className="text-sm font-black text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                Factor {currentQuestion.category}
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] leading-tight mb-10 tracking-tight">
              {currentQuestion.text}
            </h2>

            {/* Answer Controls */}
            <div className="space-y-4">
              {/* Likert Type */}
              {currentQuestion.type === 'likert' && (
                <div className="grid grid-cols-1 gap-3">
                  {LIKERT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all font-bold text-sm ${answers[currentIndex] === opt.value
                          ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                          : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-600'
                        }`}
                    >
                      <span>{opt.label}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${answers[currentIndex] === opt.value ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                        }`}>
                        {answers[currentIndex] === opt.value && <FiCheckCircle className="text-white" size={14} />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Categorical / Binary Type */}
              {(currentQuestion.type === 'categorical' || currentQuestion.type === 'binary') && (
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options?.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all font-bold text-sm ${answers[currentIndex] === opt.value
                          ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                          : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-600'
                        }`}
                    >
                      <span>{opt.label}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${answers[currentIndex] === opt.value ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                        }`}>
                        {answers[currentIndex] === opt.value && <FiCheckCircle className="text-white" size={14} />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Numeric Type */}
              {currentQuestion.type === 'numeric' && (
                <div className="flex flex-col gap-4">
                  <input
                    type="number"
                    autoFocus
                    className="w-full h-16 px-6 text-2xl font-black rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300"
                    placeholder={currentQuestion.placeholder}
                    value={answers[currentIndex] ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : parseInt(e.target.value);
                      const newAnswers = [...answers];
                      newAnswers[currentIndex] = val;
                      setAnswers(newAnswers);
                    }}
                  />
                  <p className="text-[11px] text-gray-400 font-bold flex items-center gap-2 px-2">
                    <FiInfo /> Introduce un valor numérico para continuar
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center px-4">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0 || isSubmitting}
          className={`flex items-center gap-2 font-black text-sm transition-all ${currentIndex === 0 ? 'opacity-0' : 'text-gray-400 hover:text-gray-700'
            }`}
        >
          <FiArrowLeft /> Anterior
        </button>

        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="bg-[var(--text-primary)] text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-gray-200 flex items-center gap-3 hover:bg-black active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {currentIndex === SURVEY_QUESTIONS.length - 1 ? 'Finalizar Encuesta' : 'Siguiente Pregunta'}
              <FiArrowRight />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
