'use client';

import React, { useState } from 'react';
import { BulkHealthEntry, MedicalCondition } from '../../types';
import { ConditionSelector } from '../ConditionSelector';
import { FiAlertCircle } from 'react-icons/fi';
import { ExistingRecordModal } from '../ExistingRecordModal';

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
  disabled?: boolean;
}

export function StudentChecklistRow({ entry, conditions, onChange, disabled }: StudentChecklistRowProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<string[] | null>(null);

  const handleConditionChange = (newSelection: string[]) => {
    if (entry.existingRecord && newSelection.length > entry.selectedConditions.length) {
      // Intentan agregar condiciones a alguien que ya tenía expediente
      // y no han sido confirmados. Interceptamos:
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
      <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-100 items-start sm:items-center hover:bg-gray-50 transition-colors">
        <div className="flex-shrink-0 w-full sm:w-1/3">
          <div className="font-medium text-gray-900">{entry.studentName}</div>
          <div className="text-sm text-gray-500">Matrícula: {entry.matricula}</div>
          {entry.existingRecord && (
            <div className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <FiAlertCircle className="w-3 h-3" />
              Expediente previo
            </div>
          )}
        </div>
        
        <div className="flex-1 w-full">
          <ConditionSelector 
            conditions={conditions}
            selectedIds={entry.selectedConditions}
            onChange={handleConditionChange}
            disabled={disabled}
          />
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
