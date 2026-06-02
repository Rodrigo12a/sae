/**
 * @page MisEvaluacionesPage
 * @epic EPICA-1 Módulo Estudiantil
 * @hu HU007 Historial de autoevaluaciones del estudiante
 * @description Vista del historial de cuestionarios y diagnósticos del estudiante autenticado.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { surveyService } from '@/src/features/student-survey/services/survey.service';
import { EvaluationItem } from '@/src/types/questionnaire';
import { toast } from 'sonner';
import { 
  FiClock, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiCalendar, 
  FiInfo, 
  FiArrowLeft,
  FiActivity
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function MisEvaluacionesPage() {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        const data = await surveyService.getMisEvaluaciones();
        // Ordenar por fecha descendente
        setEvaluations(data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;
        toast.error(err.message || "No se pudo cargar el historial de evaluaciones.");
      } finally {
        setIsLoading(false);
      }
    };
    loadEvaluations();
  }, []);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return (
          <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-black uppercase tracking-wider border border-amber-100 flex items-center gap-1.5 w-fit">
            <FiClock className="animate-spin" /> Pendiente ML
          </span>
        );
      case 'error_ml':
        return (
          <span className="px-3 py-1 bg-slate-50 text-slate-700 rounded-lg text-xs font-black uppercase tracking-wider border border-slate-100 flex items-center gap-1.5 w-fit">
            <FiAlertTriangle /> Procesado (Sin score)
          </span>
        );
      case 'procesado':
      default:
        return (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-black uppercase tracking-wider border border-emerald-100 flex items-center gap-1.5 w-fit">
            <FiCheckCircle /> Completado
          </span>
        );
    }
  };

  const getSemaforoTag = (semaforo?: string) => {
    switch (semaforo) {
      case 'rojo':
        return (
          <span className="px-3.5 py-1.5 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-500/20">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            Rojo — Apoyo Urgente
          </span>
        );
      case 'amarillo':
        return (
          <span className="px-3.5 py-1.5 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-white" />
            Seguimiento Activo
          </span>
        );
      case 'revisar':
        return (
          <span className="px-3.5 py-1.5 bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-white" />
            Monitoreo
          </span>
        );
      case 'verde':
      default:
        return (
          <span className="px-3.5 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-white" />
            Estable
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-slate-700 transition-all uppercase tracking-widest mb-3"
          >
            <FiArrowLeft /> Volver al Inicio
          </button>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Historial de Evaluaciones</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Consulta tus diagnósticos previos de acompañamiento.</p>
        </div>
        {evaluations.length === 0 && (
          <button 
            onClick={() => router.push('/estudiante/encuesta')}
            className="px-6 py-3.5 bg-[var(--brand-primary)] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
          >
            Nueva Evaluación <FiActivity />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 h-40 animate-pulse" />
          ))}
        </div>
      ) : evaluations.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-12 text-center max-w-xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
            <FiInfo size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-950">Sin evaluaciones</h3>
          <p className="text-slate-500 font-medium text-sm mt-2 mb-8">
            Aún no has completado tu cuestionario socioeconómico y de salud escolar para este periodo.
          </p>
          <button 
            onClick={() => router.push('/estudiante/encuesta')}
            className="px-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-black active:scale-95 transition-all shadow-md"
          >
            Responder Encuesta Ahora
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {evaluations.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 font-black uppercase tracking-wider bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg">
                      <FiCalendar /> {formatDate(item.fecha)}
                    </span>
                    {getStatusBadge(item.estado)}
                  </div>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight truncate">
                    Evaluación UPTX — Folio: {item.id.slice(0, 10).toUpperCase()}
                  </h3>
                  <p className="text-slate-400 font-bold text-xs">
                    Preguntas respondidas: {item.totalPreguntas} / 52
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-end lg:items-center gap-4 shrink-0 bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                  <div className="space-y-1 text-left md:text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                      Información de Diagnóstico
                    </span>
                    <span className="px-3.5 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                      🔒 Bajo Resguardo Confidencial
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
