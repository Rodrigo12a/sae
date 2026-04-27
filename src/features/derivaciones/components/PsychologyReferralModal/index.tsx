/**
 * @module PsychologyReferralModal
 * @epic EPICA-5 Derivaciones y Atención Especializada
 * @hu HU012 Derivar caso a psicología
 * @ux UXDT-08 (Confirmación de derivación), UXDT-09 (Alerta de saturación)
 * @api POST /api/referrals/psychology
 * @privacy ⚠️ DESCRIPCIÓN OBSERVABLE - SIN DATOS CLÍNICOS.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePsychologyReferral } from '../../hooks/usePsychologyReferral';
import { 
  HiExclamationTriangle, 
  HiInformationCircle, 
  HiCheckCircle, 
  HiClock,
  HiOutlineChatBubbleLeftEllipsis
} from 'react-icons/hi2';

interface PsychologyReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName?: string;
  activeAlertId?: string;
}

export const PsychologyReferralModal: React.FC<PsychologyReferralModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
  activeAlertId
}) => {
  const { 
    loading, 
    capacity, 
    reasons, 
    submitting, 
    submitReferral 
  } = usePsychologyReferral(studentId);

  const [formData, setFormData] = useState({
    motivoId: '',
    descripcionObservable: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitReferral({
      ...formData,
      alertId: activeAlertId
    });
    if (success) onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center text-3xl">
              <HiOutlineChatBubbleLeftEllipsis size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                Derivar a Psicología
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Estudiante: <span className="font-semibold text-purple-600">{studentName || 'Estudiante'}</span>
              </p>
            </div>
          </div>

          {/* Saturated Department Warning */}
          {capacity?.isSaturated && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex gap-3"
            >
              <HiExclamationTriangle className="text-amber-600 flex-shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">
                  Departamento Saturado
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed">
                  El tiempo de espera estimado es de <strong>{capacity.estimatedWaitDays} días hábiles</strong>. La derivación se procesará según prioridad.
                </p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Reason Selector */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">
                Motivo de Derivación
              </label>
              <select
                required
                value={formData.motivoId}
                onChange={(e) => setFormData(prev => ({ ...prev, motivoId: e.target.value }))}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-purple-500 outline-none appearance-none transition-all"
              >
                <option value="">Selecciona un motivo...</option>
                {reasons.map(reason => (
                  <option key={reason.id} value={reason.id}>{reason.label}</option>
                ))}
              </select>
            </div>

            {/* Description Area */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Descripción Observable
                </label>
                <div className="group relative">
                  <HiInformationCircle size={14} className="text-slate-400 cursor-help" />
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl z-50">
                    ⚠️ <strong>Regla de Privacidad:</strong> Describa solo lo que ha observado (ej: "no participa en clase", "llanto frecuente"). NO incluya diagnósticos clínicos.
                  </div>
                </div>
              </div>
              <textarea
                required
                minLength={20}
                value={formData.descripcionObservable}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcionObservable: e.target.value }))}
                placeholder="Ej: El estudiante se muestra retraído durante las clases de matemáticas y ha bajado su participación..."
                className="w-full h-32 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                <HiCheckCircle size={10} /> Esta información será visible solo para el personal de psicología.
              </p>
            </div>

            {/* Capacity Stats (Visual only) */}
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center gap-3">
                <HiClock size={16} className="text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Espera</p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {loading ? '...' : `${capacity?.estimatedWaitDays || 0} días`}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex items-center gap-3">
                <HiCheckCircle size={16} className="text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Carga</p>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {loading ? '...' : `${capacity?.currentLoad}/${capacity?.maxCapacity}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-[1.5] py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 shadow-xl shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={submitting || loading || !formData.motivoId}
              >
                {submitting ? 'Enviando...' : (
                  <>
                    <HiOutlineChatBubbleLeftEllipsis size={18} />
                    Enviar Derivación
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
