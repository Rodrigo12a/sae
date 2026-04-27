/**
 * @component ResourceList
 * @epic Épica 3 — Encuesta de Contexto (Estudiante)
 * @hu HU008
 * @description Lista de recursos con estados de carga y animaciones.
 */

import React from 'react';
import { InstitutionalResource } from '@/src/features/encuesta/types';
import { ResourceCard } from '../ResourceCard';
import { motion } from 'framer-motion';

interface ResourceListProps {
  resources: InstitutionalResource[];
  loading?: boolean;
}

export const ResourceList: React.FC<ResourceListProps> = ({ resources, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse flex gap-4">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
              <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/4 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 border border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          No hay recursos específicos asignados en este momento, pero puedes acercarte a las oficinas administrativas para orientación general.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15
          }
        }
      }}
      className="space-y-4"
    >
      {resources.map((resource) => (
        <motion.div 
          key={resource.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <ResourceCard resource={resource} />
        </motion.div>
      ))}
    </motion.div>
  );
};
