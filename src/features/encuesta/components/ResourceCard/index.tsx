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
      className="bg-[var(--card-bg)] p-5 rounded-2xl border border-[var(--border-subtle)] shadow-sm flex items-start gap-4 text-left"
    >
      <div className="text-3xl bg-[var(--bg-secondary)] p-3 rounded-xl shadow-inner">
        {resource.icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-[var(--text-primary)] text-base mb-1">
          {resource.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-3 leading-tight">
          {resource.description}
        </p>
        
        <div className="flex flex-wrap gap-3">
          {resource.location && (
            <span className="text-[11px] font-medium px-2.5 py-1 bg-[var(--color-info-light)] text-[var(--color-info)] rounded-lg border border-[var(--color-info-light)] flex items-center gap-1.5">
              📍 {resource.location}
            </span>
          )}
          {resource.phone && (
            <span className="text-[11px] font-medium px-2.5 py-1 bg-[var(--semaforo-verde-light)] text-[var(--semaforo-verde)] rounded-lg border border-[var(--semaforo-verde-light)] flex items-center gap-1.5">
              📞 {resource.phone}
            </span>
          )}
          {resource.link && (
            <a 
              href={resource.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] font-bold px-2.5 py-1 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg flex items-center gap-1.5 hover:opacity-90"
            >
              🔗 Ver sitio web
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
