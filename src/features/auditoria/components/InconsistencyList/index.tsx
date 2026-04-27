/**
 * @module InconsistencyList
 * @epic EPICA-8 Auditoría y Control de Calidad
 * @hu HU023 — Alertar por inconsistencia de servicio
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheck, FiArrowRight, FiUser, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import { ServiceInconsistency } from '../../types';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';

interface InconsistencyListProps {
  items: ServiceInconsistency[];
  isLoading: boolean;
  onAction: (id: string, action: 'resolve' | 'escalate') => void;
}

export const InconsistencyList: React.FC<InconsistencyListProps> = ({ items, isLoading, onAction }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <SkeletonCard key={i} height={180} />)}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheck className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Todo en orden</h3>
        <p className="text-slate-500 max-w-xs mx-auto">No hay inconsistencias detectadas en el ciclo actual de tutorías.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-6 bg-white dark:bg-slate-900 rounded-2xl border-l-4 shadow-sm ${
              item.severity === 'critical' 
                ? 'border-l-red-500 border-slate-200 dark:border-slate-800' 
                : 'border-l-amber-500 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                {/* Header: Estudiante y Tutor */}
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-900" title="Estudiante">
                      <FiUser className="text-slate-600" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center border-2 border-white dark:border-slate-900" title="Tutor">
                      <FiUser className="text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {item.studentName} <span className="text-slate-400 font-normal">vs</span> {item.tutorName}
                    </h4>
                    <div className="flex items-center text-xs text-slate-500 space-x-3">
                      <span className="flex items-center"><FiCalendar className="mr-1" /> {new Date(item.detectedAt).toLocaleDateString()}</span>
                      <span className={`flex items-center font-semibold ${item.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`}>
                        <FiAlertCircle className="mr-1" /> {item.severity === 'critical' ? 'CRÍTICA' : 'ESTÁNDAR'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comparativa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Reporte del Tutor</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{item.tutorReported}"</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
                    <p className="text-[10px] uppercase font-bold text-red-400 mb-1">Respuesta del Estudiante</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">"{item.studentReported}"</p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-row md:flex-col justify-end gap-2 md:w-48">
                <button 
                  onClick={() => onAction(item.id, 'resolve')}
                  className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition-colors"
                >
                  Descartar
                </button>
                <button 
                  onClick={() => onAction(item.id, 'escalate')}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-200 dark:shadow-none flex items-center justify-center space-x-2"
                >
                  <FiAlertTriangle />
                  <span>Escalar</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
