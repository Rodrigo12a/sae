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
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-8 leading-tight">
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h2>

        <div className="space-y-3">
          {question.type === 'radio' && question.options?.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                ${isSelected(option.value) 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 bg-slate-50 dark:bg-slate-900/40'}`}
            >
              <span className={`font-medium ${isSelected(option.value) ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                {option.label}
              </span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${isSelected(option.value) ? 'border-blue-500 bg-blue-500' : 'border-slate-300 dark:border-slate-600'}`}>
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
              className="w-full p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 focus:border-blue-500 focus:ring-0 transition-all text-slate-800 dark:text-slate-200"
            />
          )}
        </div>

        <div className="flex justify-between mt-10">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isFirst 
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
          >
            Anterior
          </button>
          
          {(question.type !== 'radio' || isLast) && (
            <button
              onClick={onNext}
              disabled={question.required && (!value || value.length === 0)}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 dark:shadow-none transition-all transform active:scale-95"
            >
              {isLast ? 'Finalizar' : 'Siguiente'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
