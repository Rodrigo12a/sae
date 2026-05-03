'use client';

import React, { useState } from 'react';
import { BulkHealthEntry, MedicalCondition } from '../../types';
import { ConditionSelector } from '../ConditionSelector';
import { FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { ExistingRecordModal } from '../ExistingRecordModal';
import { PendingReferral } from '@/src/features/derivaciones/types';

/**
 * @module StudentChecklistRow
 * @epic EPICA-4
 * @hu HU009
 * @description Fila individual del checklist para asignar condiciones a un estudiante.
 */

interface StudentChecklistRowProps {
  entry: BulkHealthEntry;
  conditions: MedicalCondition[];
  onChange: (studentId: string, conditionIds: string[]) => void;
  onShowContext?: (referral: PendingReferral) => void;
  referral?: PendingReferral;
  disabled?: boolean;
}

export function StudentChecklistRow({ entry, conditions, onChange, onShowContext, referral, disabled }: StudentChecklistRowProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<string[] | null>(null);
  const [activeCategory, setActiveCategory] = useState<MedicalCondition['category'] | 'todas'>('todas');

  const filteredConditions = activeCategory === 'todas' 
    ? conditions 
    : conditions.filter(c => c.category === activeCategory);

  const handleConditionChange = (newSelection: string[]) => {
    if (entry.existingRecord && newSelection.length > entry.selectedConditions.length) {
      setPendingSelection(newSelection);
      setShowConfirmModal(true);
    } else {
      onChange(entry.studentId, newSelection);
    }
  };

  const handleConfirmOverwrite = () => {
    if (pendingSelection) {
      onChange(entry.studentId, pendingSelection);
      setPendingSelection(null);
    }
    setShowConfirmModal(false);
  };

  const handleCancelOverwrite = () => {
    setPendingSelection(null);
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-6 border-b border-gray-100 items-start hover:bg-slate-50/50 transition-colors">
        <div className="flex justify-between items-start w-full">
          <div className="flex-shrink-0">
            <div className="font-bold text-slate-900 text-lg">{entry.studentName}</div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-tighter">Matrícula: {entry.matricula}</div>
            {entry.existingRecord && (
              <div className="inline-flex items-center gap-1 mt-2 text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <FiAlertCircle className="w-3 h-3" />
                EXPEDIENTE PREVIO
              </div>
            )}
            {referral && (
              <button 
                type="button"
                onClick={() => onShowContext?.(referral)}
                className="inline-flex items-center gap-1.5 mt-2 ml-2 text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <FiArrowRight className="w-3 h-3" />
                CASO DERIVADO
              </button>
            )}

          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { id: 'ayuno', label: 'Ayuno' },
              { id: 'id', label: 'ID' },
              { id: 'consent', label: 'Consentimiento' },
            ].map(req => (
              <label key={req.id} className="flex items-center gap-2 cursor-pointer group bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all shadow-sm">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-black text-slate-500 group-hover:text-slate-700 select-none uppercase">
                  {req.label}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="w-full space-y-4">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Filtrar por:</span>
            {(['todas', 'física', 'visual', 'auditiva', 'psicológica', 'otra'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all whitespace-nowrap
                  ${activeCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <ConditionSelector 
            conditions={filteredConditions}
            selectedIds={entry.selectedConditions}
            onChange={handleConditionChange}
            disabled={disabled}
          />

          {filteredConditions.length === 0 && activeCategory !== 'todas' && (
            <p className="text-xs text-slate-400 italic">No hay condiciones en la categoría "{activeCategory}" para este perfil.</p>
          )}
        </div>
      </div>

      <ExistingRecordModal 
        isOpen={showConfirmModal}
        studentName={entry.studentName}
        onConfirm={handleConfirmOverwrite}
        onCancel={handleCancelOverwrite}
      />
    </>
  );
}
