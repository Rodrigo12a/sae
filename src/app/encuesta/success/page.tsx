/**
 * @page SurveySuccessPage
 * @epic Épica 3 — Encuesta de Contexto (Estudiante)
 * @hu HU008
 * @description Pantalla de éxito con recursos institucionales dinámicos.
 */

"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { InstitutionalResource } from '@/src/features/encuesta/types';
import { surveyService } from '@/src/services/api/surveys';
import { ResourceList } from '@/src/features/encuesta/components/ResourceList';
import { motion } from 'framer-motion';

function SurveySuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Estudiante';
  const surveyId = searchParams.get('surveyId');
  
  const [resources, setResources] = useState<InstitutionalResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      if (surveyId) {
        try {
          const data = await surveyService.getResources(surveyId);
          setResources(data);
        } catch (error) {
          console.error("Error loading resources", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [surveyId]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full bg-[var(--card-bg)] rounded-[2.5rem] p-8 shadow-2xl border border-[var(--border-subtle)] text-center"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-7xl mb-6 select-none"
      >
        🎉
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-black text-[var(--text-primary)] mb-3 tracking-tight"
      >
        ¡Gracias, {name}!
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-[var(--text-secondary)] mb-10 leading-relaxed text-sm px-4"
      >
        Tus respuestas fueron recibidas correctamente. Esta información nos permite acompañarte mejor en tu camino académico.
      </motion.p>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-left mb-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-black text-[var(--text-secondary)] opacity-60 uppercase tracking-[0.2em]">
            Apoyos recomendados
          </h2>
          <div className="h-px flex-1 bg-[var(--border-subtle)] ml-4" />
        </div>
        
        <ResourceList resources={resources} loading={isLoading} />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link 
          href="/"
          className="group relative block w-full py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-2xl font-bold transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Finalizar sesión
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] opacity-0 group-hover:opacity-10 transition-opacity" />
        </Link>
        
        <p className="mt-6 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-medium">
          SAE · Sistema de Acompañamiento Estudiantil
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function SurveySuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="max-w-md w-full bg-[var(--card-bg)] rounded-[2.5rem] p-8 shadow-2xl h-[500px] animate-pulse"></div>
      }>
        <SurveySuccessContent />
      </Suspense>
    </div>
  );
}
