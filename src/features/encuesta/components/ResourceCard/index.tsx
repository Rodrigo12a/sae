/**
 * @component ResourceCard
 * @epic Épica 3 — Encuesta de Contexto (Estudiante)
 * @hu HU008
 * @description Tarjeta individual para mostrar recursos institucionales.
 */

import React from 'react';
import { InstitutionalResource } from '@/src/features/encuesta/types';
import { motion } from 'framer-motion';

interface ResourceCardProps {
  resource: InstitutionalResource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4 text-left"
    >
      <div className="text-3xl bg-slate-50 dark:bg-slate-800 p-3 rounded-xl shadow-inner">
        {resource.icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          {resource.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-tight">
          {resource.description}
        </p>
        
        <div className="flex flex-wrap gap-3">
          {resource.location && (
            <span className="text-[11px] font-medium px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-800/50 flex items-center gap-1.5">
              📍 {resource.location}
            </span>
          )}
          {resource.phone && (
            <span className="text-[11px] font-medium px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg border border-green-100 dark:border-green-800/50 flex items-center gap-1.5">
              📞 {resource.phone}
            </span>
          )}
          {resource.link && (
            <a 
              href={resource.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] font-bold px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center gap-1.5 hover:opacity-90"
            >
              🔗 Ver sitio web
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
