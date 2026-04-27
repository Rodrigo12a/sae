/**
 * @module ProlongedAlertForm
 * @epic Épica 4 — Módulo Médico con Privacidad Diferencial
 * @hu HU011
 * @ux UXMM-07, UXMM-08
 * @api POST /api/medical/students/:id/prolonged-alert
 * @privacy ⚠️ ENVÍO DE INFORMACIÓN OPERATIVA SIN DIAGNÓSTICO.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProlongedAlertRequest } from '../../types';

interface ProlongedAlertFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProlongedAlertRequest) => Promise<boolean>;
}

export const ProlongedAlertForm: React.FC<ProlongedAlertFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [form, setForm] = useState<ProlongedAlertRequest>({
    startDate: new Date().toISOString().split('T')[0],
    estimatedDurationDays: 1,
    observation: 'Se sugiere flexibilidad académica por motivos de salud.',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onSubmit(form);
    if (success) {
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700"
          >
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-6">
              📢
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Alertar Impacto Prolongado
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Esta alerta notificará al tutor que el estudiante tendrá dificultades de asistencia. No se incluirán datos clínicos.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Fecha de inicio de impacto
                </label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Duración estimada (días)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.estimatedDurationDays}
                  onChange={(e) => setForm(prev => ({ ...prev, estimatedDurationDays: parseInt(e.target.value) }))}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Observación operativa (para el tutor)
                </label>
                <textarea
                  required
                  value={form.observation}
                  onChange={(e) => setForm(prev => ({ ...prev, observation: e.target.value }))}
                  className="w-full h-24 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Ej: El estudiante requiere reposo absoluto..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Alerta'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
