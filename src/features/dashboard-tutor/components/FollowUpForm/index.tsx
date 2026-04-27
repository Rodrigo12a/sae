/**
 * @module FollowUpForm
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU005
 * @ux UXDT-11, UXDT-12, UXDT-13
 * @qa QA-01 (sin datos clínicos en la nota)
 * @api POST /alerts/:id/followup
 * @accessibility Contador de caracteres + aria-describedby en el textarea
 */

'use client';

import React, { useState } from 'react';
import { registerFollowUp } from '@/src/services/api/alerts';
import type { FollowUpRequest } from '@/src/types/alert';

const MIN_CHARS = 30;
const MAX_CHARS = 1000;

interface FollowUpFormProps {
  alertId: string;
  studentName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Formulario de bitácora ágil de seguimiento (HU005).
 * Requiere mínimo 30 caracteres y máximo 1000.
 * Validación en cliente antes de enviar al servicio.
 */
export function FollowUpForm({
  alertId,
  studentName,
  onSuccess,
  onCancel,
}: FollowUpFormProps) {
  const [contenido, setContenido] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const charCount = contenido.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const request: FollowUpRequest = { alertId, contenido };
      await registerFollowUp(alertId, request);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch {
      setError('No se pudo guardar el seguimiento. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estado: Éxito
  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center py-10 text-center"
      >
        <span className="text-4xl mb-3" aria-hidden="true">✅</span>
        <p className="text-base font-semibold text-green-700 mb-1">
          Seguimiento registrado
        </p>
        <p className="text-sm text-gray-500">
          Tus respuestas fueron recibidas.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={`Registrar seguimiento para ${studentName}`}
      className="flex flex-col gap-4"
      noValidate
    >
      <div>
        <label
          htmlFor="followup-contenido"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Nota de seguimiento
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        </label>

        <textarea
          id="followup-contenido"
          name="contenido"
          value={contenido}
          onChange={e => setContenido(e.target.value)}
          aria-required="true"
          aria-describedby="followup-help followup-counter"
          aria-invalid={contenido.length > 0 && !isValid}
          placeholder="Describe la acción tomada o el acuerdo con el estudiante..."
          rows={5}
          maxLength={MAX_CHARS}
          className={`
            w-full px-4 py-3 text-sm border rounded-xl resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
            ${contenido.length > 0 && charCount < MIN_CHARS
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 bg-white'
            }
          `}
        />

        <div className="flex justify-between items-center mt-1.5 gap-4">
          <p
            id="followup-help"
            className={`text-xs ${charCount < MIN_CHARS && contenido.length > 0 ? 'text-red-500' : 'text-gray-400'}`}
          >
            {charCount < MIN_CHARS && contenido.length > 0
              ? `Mínimo ${MIN_CHARS} caracteres. Faltan ${MIN_CHARS - charCount}.`
              : `Mínimo ${MIN_CHARS} caracteres.`
            }
          </p>
          <span
            id="followup-counter"
            className={`text-xs shrink-0 ${charCount > MAX_CHARS * 0.9 ? 'text-amber-600' : 'text-gray-400'}`}
            aria-live="polite"
            aria-label={`${charCount} de ${MAX_CHARS} caracteres usados`}
          >
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Error global */}
      {error && (
        <div role="alert" className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="
              flex-1 px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400
              transition-colors min-h-[44px] disabled:opacity-50
            "
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="
            flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label={isSubmitting ? 'Guardando seguimiento...' : 'Guardar nota de seguimiento'}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              Guardando...
            </span>
          ) : (
            '✏️ Guardar seguimiento'
          )}
        </button>
      </div>
    </form>
  );
}

export default FollowUpForm;
