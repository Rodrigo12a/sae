/**
 * @component SurveyContainer
 * @epic EPICA-1 / HU007 Encuesta Estudiantil
 * @hu HU007, HU008
 * @description Contenedor principal de la encuesta de descerción UPTX V2.0. 
 * Implementa el envío estructurado, validaciones, resiliencia ML, visualización de resultados y carga de recursos.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SURVEY_QUESTIONS, LIKERT_OPTIONS } from '../types/questions';
import { surveyService } from '../services/survey.service';
import { SubmitResponseDto, SurveyResource } from '@/src/types/questionnaire';
import { toast } from 'sonner';
import { 
  FiArrowRight, 
  FiArrowLeft, 
  FiCheckCircle, 
  FiInfo, 
  FiAlertTriangle,
  FiBookOpen,
  FiHeart,
  FiAward,
  FiActivity,
  FiPhone,
  FiMapPin,
  FiLock
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const defaultResources: SurveyResource[] = [
  {
    id: 'tutoria',
    title: 'Tutoría Académica',
    description: 'Apoyo académico personalizado con tu tutor asignado para ayudarte a mejorar tu desempeño escolar y resolver dudas.',
    icon: 'school',
    location: 'Edificio A, Oficina 101',
    phone: 'Ext. 2501',
  },
  {
    id: 'psicologia',
    title: 'Servicio de Psicología',
    description: 'Atención y orientación psicológica gratuita y profesional para cuidar de tu bienestar emocional y personal.',
    icon: 'psychology',
    location: 'Centro de Bienestar Estudiantil',
    phone: 'Ext. 2310',
  },
  {
    id: 'becas',
    title: 'Coordinación de Becas',
    description: 'Información y acompañamiento para solicitar apoyos económicos y becas disponibles que faciliten tus estudios.',
    icon: 'attach_money',
    location: 'Edificio de Servicios Escolares',
    phone: 'Ext. 2200',
  }
];

export const SurveyContainer: React.FC = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(SURVEY_QUESTIONS.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [step, setStep] = useState<'welcome' | 'consent' | 'questions'>('welcome');
  
  // Single Attempt Validation States
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState<boolean>(false);
  const [checkingCompleted, setCheckingCompleted] = useState<boolean>(true);

  // V2.0 States and Resources
  const [surveyResult, setSurveyResult] = useState<SubmitResponseDto | null>(null);
  const [resources, setResources] = useState<SurveyResource[]>(defaultResources);
  const [isLoadingResources, setIsLoadingResources] = useState(false);

  const currentQuestion = SURVEY_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / SURVEY_QUESTIONS.length) * 100;

  // 1. Verificar si el alumno ya completó la encuesta
  useEffect(() => {
    const checkExistingSurvey = async () => {
      try {
        const evaluations = await surveyService.getMisEvaluaciones();
        if (evaluations && evaluations.length > 0) {
          setHasCompletedSurvey(true);
        }
      } catch (err) {
        console.error("Error al verificar encuesta previa:", err);
      } finally {
        setCheckingCompleted(false);
      }
    };
    checkExistingSurvey();
  }, []);

  // 2. Carga de recursos dinámicos pos-cuestionario (HU008)
  useEffect(() => {
    if (isFinished && surveyResult?.id) {
      const fetchResources = async () => {
        setIsLoadingResources(true);
        try {
          const data = await surveyService.getSurveyResources(surveyResult.id);
          if (data && data.length > 0) {
            setResources(data);
          } else {
            setResources(defaultResources);
          }
        } catch (err) {
          console.error("Error al cargar recursos:", err);
          setResources(defaultResources);
        } finally {
          setIsLoadingResources(false);
        }
      };
      fetchResources();
    }
  }, [isFinished, surveyResult]);

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

    // Validación específica V2.0 de Integrantes (Pregunta 10, backendPreguntaId 10)
    if (currentQuestion.backendPreguntaId === 10) {
      const value = answers[currentIndex] as number;
      if (value < 1 || value > 10) {
        toast.error("Por favor, introduce un número de integrantes válido (entre 1 y 10).");
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
      // V2.0 Payload: Mapear a objeto [{ preguntaId, valor }]
      const payload = SURVEY_QUESTIONS.map((q, idx) => ({
        preguntaId: q.backendPreguntaId,
        valor: answers[idx] as number
      }));

      const response = await surveyService.submit(payload);
      setSurveyResult(response);
      setIsFinished(true);
      toast.success("Cuestionario enviado correctamente.");
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper para mapear iconos dinámicos
  const renderResourceIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'school':
      case 'tutoria':
        return <FiBookOpen className="text-blue-500" size={24} />;
      case 'psychology':
      case 'psicologia':
        return <FiHeart className="text-purple-500" size={24} />;
      case 'scholarship':
      case 'beca':
      case 'becas':
        return <FiAward className="text-emerald-500" size={24} />;
      default:
        return <FiActivity className="text-amber-500" size={24} />;
    }
  };



  if (checkingCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-4 border-red-100 border-t-[var(--brand-primary)] rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
          Verificando tu historial...
        </p>
      </div>
    );
  }

  if (hasCompletedSurvey) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 p-8 sm:p-12 text-center animate-scale-in">
          {/* Decorative Top Glow */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--brand-primary)]" />
          
          <div className="w-20 h-20 bg-[var(--color-secondary-light)] text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
            <FiLock size={36} />
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            Ya has completado esta encuesta
          </h2>
          
          <p className="text-slate-600 font-medium leading-relaxed mb-8">
            Si no estás seguro de tus respuestas o necesitas cambiar algo, por favor acércate con tu tutor para recibir orientación.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              Ir al Inicio
            </button>
            <button
              onClick={() => router.push('/estudiante/mis-evaluaciones')}
              className="flex-1 py-4 px-6 bg-[var(--brand-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-100 active:scale-95"
            >
              Ver Evaluaciones
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-16">
        {/* Card de Agradecimiento */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="h-44 bg-gradient-to-br from-[var(--color-primary)] to-[var(--brand-primary)] p-8 flex items-center justify-between text-white relative">
            <div className="z-10">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                Encuesta Completada
              </span>
              <h2 className="text-3xl font-black mt-2 tracking-tight">
                ¡Muchas Gracias por tu Participación!
              </h2>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 scale-[4.5] hidden sm:block">
              <FiCheckCircle />
            </div>
          </div>

          <div className="p-8 sm:p-12 space-y-6">
            <div className="flex gap-5 p-6 bg-[var(--color-secondary-light)] border border-red-100 rounded-2xl">
              <div className="shrink-0 p-3 bg-white rounded-2xl shadow-sm h-fit text-[var(--color-primary)]">
                <FiCheckCircle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-lg text-[var(--color-primary-hover)]">Tus respuestas fueron recibidas</h3>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  Tus respuestas se han guardado con éxito de forma confidencial y segura en los servidores de la universidad.
                </p>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  Este cuestionario es una herramienta fundamental para conocer tu situación actual y apoyarte. Tu tutor y el equipo académico de bienestar analizarán la información con el fin de brindarte un acompañamiento oportuno y personalizado durante tu trayectoria académica.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-center">
              <button
                onClick={() => router.push('/')}
                className="bg-slate-900 text-white font-black py-4 px-10 rounded-2xl shadow-xl hover:bg-black active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>

        {/* Recursos de Apoyo (HU008) */}
        <section className="space-y-6">
          <div className="px-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Programas de Apoyo y Recursos Gratuitos</h3>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Como estudiante de la UPTX, tienes acceso gratuito a los siguientes servicios diseñados para tu éxito personal, académico y profesional:
            </p>
          </div>

          {isLoadingResources ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-36 animate-pulse" />
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-10 text-center text-slate-400 text-sm">
              No hay recursos específicos cargados actualmente. Acércate con tu tutor académico.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((res) => (
                <div 
                  key={res.id} 
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex gap-4"
                >
                  <div className="shrink-0 p-4 bg-slate-50 rounded-2xl shadow-inner h-fit self-start">
                    {renderResourceIcon(res.icon)}
                  </div>
                  <div className="space-y-2 flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-lg truncate">{res.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{res.description}</p>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] font-bold text-slate-400">
                      {res.location && (
                        <span className="flex items-center gap-1"><FiMapPin /> {res.location}</span>
                      )}
                      {res.phone && (
                        <span className="flex items-center gap-1"><FiPhone /> {res.phone}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  if (step === 'welcome') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl animate-fade-in">
        <div className="w-20 h-20 bg-[var(--color-secondary-light)] text-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-8 rotate-3 shadow-inner">
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
            <span className="text-lg font-bold text-gray-700">52 ítems</span>
          </div>
        </div>
        <button
          onClick={() => setStep('consent')}
          className="w-full bg-[var(--brand-primary)] text-white font-black py-5 rounded-2xl shadow-xl shadow-red-200 hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
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
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] mb-1 block">Progreso de la encuesta</span>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Pregunta {currentIndex + 1} de {SURVEY_QUESTIONS.length}
            </h3>
          </div>
          <span className="text-sm font-black text-[var(--color-primary)]">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--brand-primary)]"
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
              <span className="px-3 py-1 bg-[var(--color-secondary-light)] text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest rounded-lg">
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
                          ? 'border-[var(--color-primary)] bg-[var(--color-secondary-light)] text-[var(--color-primary-hover)] shadow-md'
                          : 'border-gray-100 hover:border-[var(--color-secondary-light)] hover:bg-gray-50 text-gray-600'
                        }`}
                    >
                      <span>{opt.label}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${answers[currentIndex] === opt.value ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-gray-300'
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
                          ? 'border-[var(--color-primary)] bg-[var(--color-secondary-light)] text-[var(--color-primary-hover)] shadow-md'
                          : 'border-gray-100 hover:border-[var(--color-secondary-light)] hover:bg-gray-50 text-gray-600'
                        }`}
                    >
                      <span>{opt.label}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${answers[currentIndex] === opt.value ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-gray-300'
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
                    className="w-full h-16 px-6 text-2xl font-black rounded-2xl border-2 border-gray-100 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-red-100 outline-none transition-all placeholder:text-gray-300"
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
