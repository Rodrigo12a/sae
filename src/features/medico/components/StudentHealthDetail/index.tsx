/**
 * @module StudentHealthDetail
 * @epic Épica 4 — Módulo Médico con Privacidad Diferencial
 * @hu HU010, HU011
 * @ux UXMM-05, UXMM-06, UXMM-07, UXMM-08
 * @api PUT /api/medical/students/:id/health · POST /api/medical/students/:id/prolonged-alert
 * @privacy ⚠️ VISTA EXCLUSIVA PARA PERSONAL MÉDICO.
 */

'use client';

import React, { useState } from 'react';
import { useStudentHealth } from '../../hooks/useStudentHealth';
import { HealthSemaphoreBadge } from '../HealthSemaphoreBadge';
import { HealthProfileMedico, MedicalSemaforoEstado } from '../../types';
import { Semaforo } from '@/src/components/ui/Semaforo';
import { ProlongedAlertForm } from '../ProlongedAlertForm';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';
import { toast } from 'sonner';

interface StudentHealthDetailProps {
  studentId: string;
}

export const StudentHealthDetail: React.FC<StudentHealthDetailProps> = ({ studentId }) => {
  const { healthData, loading, updateHealth, sendProlongedAlert } = useStudentHealth(studentId);
  const [isEditing, setIsEditing] = useState(false);
  const [isProlongedAlertOpen, setIsProlongedAlertOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estado local para edición
  const [editForm, setEditForm] = useState<{
    diagnostico: string;
    semaforo: MedicalSemaforoEstado;
  }>({
    diagnostico: '',
    semaforo: 'verde',
  });

  const handleStartEdit = () => {
    if (healthData && 'diagnosticoClinico' in healthData) {
      setEditForm({
        diagnostico: healthData.diagnosticoClinico,
        semaforo: healthData.semaforoEstado,
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await updateHealth({
      diagnosticoClinico: editForm.diagnostico,
      semaforoEstado: editForm.semaforo,
    });
    
    if (success) {
      setIsEditing(false);
    }
    setSaving(false);
  };

  if (loading) return <SkeletonCard className="h-48" />;
  if (!healthData) return <div className="p-8 text-center text-slate-400">Sin datos médicos registrados</div>;

  const isMedicalView = 'diagnosticoClinico' in healthData;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            🩺 Perfil Médico Confidencial
          </h3>
          
          {isMedicalView && !isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsProlongedAlertOpen(true)}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg transition-colors border border-amber-100"
              >
                📢 Alertar Inasistencia
              </button>
              <button
                onClick={handleStartEdit}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Editar Diagnóstico
              </button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <HealthSemaphoreBadge data={healthData} />
              
              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Recomendaciones para el Tutor
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {healthData.recomendacionOperativa}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Selector de Semáforo */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">
                  Estado de Riesgo (Semáforo)
                </label>
                <div className="flex gap-3">
                  {(['rojo', 'amarillo', 'verde', 'revisar'] as MedicalSemaforoEstado[]).map((est) => (
                    <button
                      key={est}
                      onClick={() => setEditForm(prev => ({ ...prev, semaforo: est }))}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all
                        ${editForm.semaforo === est 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:bg-slate-100'}
                      `}
                    >
                      <Semaforo estado={est} etiqueta={est} compact size="sm" />
                      <span className="text-xs font-medium capitalize">{est}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input de Diagnóstico */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                  Diagnóstico Clínico (Confidencial)
                </label>
                <textarea
                  value={editForm.diagnostico}
                  onChange={(e) => setEditForm(prev => ({ ...prev, diagnostico: e.target.value }))}
                  className="w-full h-24 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ingrese el diagnóstico detallado..."
                />
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProlongedAlertForm
        isOpen={isProlongedAlertOpen}
        onClose={() => setIsProlongedAlertOpen(false)}
        onSubmit={sendProlongedAlert}
      />
    </div>
  );
};
