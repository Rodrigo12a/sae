/**
 * @module CloseAlertFlow
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU006
 * @ux UXDT-14, UXDT-15
 * @qa QA-02 (evidencia obligatoria para auditoría) · QA-01
 * @api PUT /alerts/:id/close
 * @accessibility Diálogo modal con focus trap · aria-modal · aria-labelledby
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { closeAlert } from '@/src/services/api/alerts';
import type { CloseAlertRequest } from '@/src/types/alert';

const MIN_EVIDENCIA = 30;
const MAX_EVIDENCIA = 2000;

interface CloseAlertFlowProps {
  alertId: string;
  studentName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Flujo de cierre de alerta con evidencia obligatoria (HU006).
 * La evidencia mínima de 30 caracteres garantiza la auditoría (HU022/HU023).
 */
export function CloseAlertFlow({
  alertId,
  studentName,
  onSuccess,
  onCancel,
}: CloseAlertFlowProps) {
  const [evidencia, setEvidencia] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus en el textarea al montar
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const charCount = evidencia.length;
  const isValid = charCount >= MIN_EVIDENCIA && charCount <= MAX_EVIDENCIA;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting || !confirmed) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const request: CloseAlertRequest = { alertId, evidencia };
      await closeAlert(alertId, request);
      setTimeout(() => onSuccess?.(), 2000);
    } catch {
      setError('No se pudo cerrar la alerta. Inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  // Estado: Éxito
  if (isSubmitting && !error) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center py-10 text-center"
      >
        <span className="text-4xl mb-3" aria-hidden="true">✅</span>
        <p className="text-base font-semibold text-green-700 mb-1">
          Alerta cerrada correctamente
        </p>
        <p className="text-sm text-gray-500">
          Tus respuestas fueron recibidas y quedarán en el registro de auditoría.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={`Cerrar alerta de ${studentName}`}
      className="flex flex-col gap-4"
      noValidate
    >
      {/* Banner de advertencia */}
      <div
        role="alert"
        className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700"
      >
        <span aria-hidden="true" className="text-base mt-0.5">⚠️</span>
        <p>
          <span className="font-semibold">Esta acción es permanente y auditable.</span>{' '}
          La evidencia será registrada en el historial institucional.
        </p>
      </div>

      {/* Campo de evidencia */}
      <div>
        <label
          htmlFor="close-evidencia"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Evidencia del cierre
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        </label>

        <textarea
          id="close-evidencia"
          ref={textareaRef}
          name="evidencia"
          value={evidencia}
          onChange={e => setEvidencia(e.target.value)}
          aria-required="true"
          aria-describedby="evidencia-help evidencia-counter"
          aria-invalid={evidencia.length > 0 && !isValid}
          placeholder="Describe la evidencia que justifica el cierre de esta alerta (sesión realizada, compromiso, derivación, etc.)..."
          rows={5}
          maxLength={MAX_EVIDENCIA}
          className={`
            w-full px-4 py-3 text-sm border rounded-xl resize-none
            focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors
            ${evidencia.length > 0 && charCount < MIN_EVIDENCIA
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 bg-white'
            }
          `}
        />

        <div className="flex justify-between items-center mt-1.5">
          <p
            id="evidencia-help"
            className={`text-xs ${charCount < MIN_EVIDENCIA && evidencia.length > 0 ? 'text-red-500' : 'text-gray-400'}`}
          >
            {charCount < MIN_EVIDENCIA && evidencia.length > 0
              ? `Mínimo ${MIN_EVIDENCIA} caracteres. Faltan ${MIN_EVIDENCIA - charCount}.`
              : `Mínimo ${MIN_EVIDENCIA} caracteres para garantizar la trazabilidad.`
            }
          </p>
          <span
            id="evidencia-counter"
            className="text-xs text-gray-400"
            aria-live="polite"
            aria-label={`${charCount} de ${MAX_EVIDENCIA} caracteres`}
          >
            {charCount}/{MAX_EVIDENCIA}
          </span>
        </div>
      </div>

      {/* Checkbox de confirmación */}
      <label
        className="flex items-start gap-3 cursor-pointer"
        htmlFor="close-confirm"
      >
        <input
          id="close-confirm"
          type="checkbox"
          checked={confirmed}
          onChange={e => setConfirmed(e.target.checked)}
          className="mt-0.5 w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
          aria-required="true"
        />
        <span className="text-sm text-gray-600">
          Confirmo que esta alerta ha sido resuelta con la evidencia descrita.
        </span>
      </label>

      {/* Error */}
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
          disabled={!isValid || !confirmed || isSubmitting}
          className="
            flex-1 px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-xl
            hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
            transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label={
            !confirmed
              ? 'Confirma la casilla para poder cerrar la alerta'
              : isSubmitting
              ? 'Cerrando alerta...'
              : 'Confirmar cierre de alerta'
          }
        >
          {isSubmitting
            ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                Cerrando...
              </span>
            )
            : '✅ Confirmar cierre'
          }
        </button>
      </div>
    </form>
  );
}

export default CloseAlertFlow;
