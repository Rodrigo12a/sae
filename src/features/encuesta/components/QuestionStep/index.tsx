/**
 * @component QuestionStep
 * @epic Épica 3 — Encuesta de Contexto (Estudiante)
 * @hu HU007
 * @ux UXEN-07, UXEN-08
 */

import React from 'react';
import { SurveyQuestion } from '../../types';
import { motion } from 'framer-motion';

interface QuestionStepProps {
  question: SurveyQuestion;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const isSelected = (val: string) => {
    if (Array.isArray(value)) {
      return value.includes(val);
    }
    return value === val;
  };

  const handleOptionClick = (optionValue: string) => {
    if (question.type === 'radio') {
      onChange(optionValue);
      // Pequeño delay para que el usuario vea la selección antes de pasar a la siguiente
      setTimeout(onNext, 400);
    } else if (question.type === 'checkbox') {
      const currentValues = Array.isArray(value) ? [...value] : [];
      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter(v => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-sm border border-[var(--border-subtle)]">
        <h2 className="text-xl font-medium text-[var(--text-primary)] mb-8 leading-tight">
          {question.text}
          {question.required && <span className="text-[var(--semaforo-rojo)] ml-1">*</span>}
        </h2>

        <div className="space-y-3">
          {question.type === 'radio' && question.options?.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                ${isSelected(option.value) 
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' 
                  : 'border-[var(--border-subtle)] hover:border-[var(--color-primary)] bg-[var(--bg-primary)]/40'}`}
            >
              <span className={`font-medium ${isSelected(option.value) ? 'text-[var(--color-primary)]' : 'text-[var(--text-primary)]'}`}>
                {option.label}
              </span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${isSelected(option.value) ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-[var(--border-subtle)]'}`}>
                {isSelected(option.value) && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>
          ))}

          {question.type === 'textarea' && (
            <textarea
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.placeholder}
              rows={5}
              className="w-full p-4 rounded-xl border-2 border-[var(--border-subtle)] bg-[var(--bg-primary)]/40 focus:border-[var(--color-primary)] focus:ring-0 transition-all text-[var(--text-primary)]"
            />
          )}
        </div>

        <div className="flex justify-between mt-10">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isFirst 
                ? 'text-[var(--text-secondary)] opacity-50 cursor-not-allowed' 
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
            }`}
          >
            Anterior
          </button>
          
          {(question.type !== 'radio' || isLast) && (
            <button
              onClick={onNext}
              disabled={question.required && (!value || value.length === 0)}
              className="px-8 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-[var(--border-subtle)] text-white rounded-xl font-semibold shadow-lg shadow-[var(--color-primary)]/20 transition-all transform active:scale-95"
            >
              {isLast ? 'Finalizar' : 'Siguiente'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
