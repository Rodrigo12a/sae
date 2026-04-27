'use client';

import React from 'react';
import { MedicalCondition } from '../../types';

/**
 * @module ConditionSelector
 * @epic EPICA-4
 * @hu HU009
 * @description Selector múltiple de diagnósticos clínicos.
 */

interface ConditionSelectorProps {
  conditions: MedicalCondition[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export function ConditionSelector({ conditions, selectedIds, onChange, disabled }: ConditionSelectorProps) {
  const toggleCondition = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(v => v !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  if (conditions.length === 0) {
    return <span className="text-sm text-gray-500 italic">No hay condiciones disponibles</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {conditions.map(condition => {
        const isSelected = selectedIds.includes(condition.id);
        
        return (
          <button
            key={condition.id}
            type="button"
            disabled={disabled}
            onClick={() => toggleCondition(condition.id)}
            aria-pressed={isSelected}
            className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[44px]
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${isSelected 
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-500' 
                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'}
            `}
          >
            {condition.name}
          </button>
        );
      })}
    </div>
  );
}
