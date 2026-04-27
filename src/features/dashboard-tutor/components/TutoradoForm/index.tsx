/**
 * @module TutoradoForm
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU007
 * @ux UXDT-16, UXDT-17
 * @qa QA-01 (contraseñas: type="password" · limpiar al desmontar)
 * @privacy ⚠️ REGLAS DE SEGURIDAD:
 *          1. Los campos de contraseña tienen type="password" — nunca type="text".
 *          2. El estado local se limpia en el cleanup de useEffect al desmontar.
 *          3. NUNCA loggear el estado completo (contiene contraseña).
 *          4. confirmPassword no se envía al backend.
 */

'use client';

import React, { useState, useEffect } from 'react';
import type {
  TutoradoFormState,
  TutoradoFormErrors,
  TutoradoFormMode,
  CreateTutoradoRequest,
  UpdateTutoradoRequest,
} from '@/src/types/tutorado';

// ─────────────────────────────────────────────────────────────────────────────
// Validaciones
// ─────────────────────────────────────────────────────────────────────────────

function validateForm(
  state: TutoradoFormState,
  mode: TutoradoFormMode,
): TutoradoFormErrors {
  const errors: TutoradoFormErrors = {};

  if (mode === 'create') {
    if (!state.matricula.trim()) {
      errors.matricula = 'La matrícula es obligatoria.';
    } else if (!/^\d{8,10}$/.test(state.matricula.trim())) {
      errors.matricula = 'La matrícula debe tener entre 8 y 10 dígitos numéricos.';
    }
  }

  if (!state.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (state.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  }

  if (!state.confirmPassword) {
    errors.confirmPassword = 'Confirma la contraseña.';
  } else if (state.password !== state.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────────────────────

interface TutoradoFormProps {
  mode: TutoradoFormMode;
  /** En modo 'edit', la matrícula ya viene fijada */
  matriculaFija?: string;
  isSubmitting?: boolean;
  submitError?: string | null;
  onSubmit: (data: CreateTutoradoRequest | UpdateTutoradoRequest) => Promise<void>;
  onCancel?: () => void;
}

const EMPTY_STATE: TutoradoFormState = {
  matricula: '',
  password: '',
  confirmPassword: '',
};

/**
 * Formulario de creación/edición de cuenta de tutorado.
 * @privacy Contraseñas limpias en cleanup de useEffect.
 *          type="password" en ambos campos de contraseña.
 *          NUNCA loggear `formState` completo.
 */
export function TutoradoForm({
  mode,
  matriculaFija,
  isSubmitting = false,
  submitError = null,
  onSubmit,
  onCancel,
}: TutoradoFormProps) {
  const [formState, setFormState] = useState<TutoradoFormState>({
    ...EMPTY_STATE,
    matricula: matriculaFija ?? '',
  });
  const [errors, setErrors] = useState<TutoradoFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof TutoradoFormState, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  // ⚠️ SEGURIDAD: Limpiar contraseñas del estado local al desmontar
  useEffect(() => {
    return () => {
      setFormState(EMPTY_STATE);
      // NO loggear aquí — el formState podría contener contraseñas
    };
  }, []);

  const handleChange = (field: keyof TutoradoFormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newState = { ...formState, [field]: e.target.value };
    setFormState(newState);
    if (touched[field]) {
      setErrors(validateForm(newState, mode));
    }
  };

  const handleBlur = (field: keyof TutoradoFormState) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validateForm(formState, mode));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Marcar todos como tocados
    setTouched({ matricula: true, password: true, confirmPassword: true });
    const validationErrors = validateForm(formState, mode);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const data: CreateTutoradoRequest | UpdateTutoradoRequest =
      mode === 'create'
        ? { matricula: formState.matricula.trim(), password: formState.password }
        : { password: formState.password };

    await onSubmit(data);
    setSubmitted(true);
  };

  if (submitted && !submitError) {
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-10 text-center">
        <span className="text-4xl mb-3" aria-hidden="true">✅</span>
        <p className="text-base font-semibold text-green-700 mb-1">
          {mode === 'create' ? 'Cuenta creada correctamente' : 'Contraseña actualizada'}
        </p>
        <p className="text-sm text-gray-500">Tus respuestas fueron recibidas.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={mode === 'create' ? 'Registrar nueva cuenta de tutorado' : 'Actualizar contraseña de tutorado'}
      className="flex flex-col gap-4"
      noValidate
    >
      {/* Campo: Matrícula (solo en modo create) */}
      {mode === 'create' && (
        <div>
          <label htmlFor="tutorado-matricula" className="block text-sm font-medium text-gray-700 mb-1.5">
            Matrícula
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <input
            id="tutorado-matricula"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            autoComplete="off"
            value={formState.matricula}
            onChange={handleChange('matricula')}
            onBlur={handleBlur('matricula')}
            aria-required="true"
            aria-describedby={errors.matricula ? 'matricula-error' : undefined}
            aria-invalid={!!errors.matricula}
            placeholder="Ej. 20230001"
            className={`
              w-full px-4 py-3 text-sm border rounded-xl
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
              ${errors.matricula ? 'border-red-300 bg-red-50' : 'border-gray-200'}
            `}
          />
          {errors.matricula && (
            <p id="matricula-error" role="alert" className="text-xs text-red-500 mt-1">
              {errors.matricula}
            </p>
          )}
        </div>
      )}

      {/* Matrícula fija en modo edición */}
      {mode === 'edit' && matriculaFija && (
        <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-400 mb-0.5">Matrícula</p>
          <p className="text-sm font-semibold text-gray-700">{matriculaFija}</p>
        </div>
      )}

      {/* Campo: Contraseña — ⚠️ type="password" obligatorio */}
      <div>
        <label htmlFor="tutorado-password" className="block text-sm font-medium text-gray-700 mb-1.5">
          {mode === 'create' ? 'Contraseña' : 'Nueva contraseña'}
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        </label>
        <input
          id="tutorado-password"
          type="password"  /* ⚠️ NUNCA cambiar a type="text" */
          autoComplete={mode === 'create' ? 'new-password' : 'new-password'}
          value={formState.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          aria-required="true"
          aria-describedby={errors.password ? 'password-error' : 'password-hint'}
          aria-invalid={!!errors.password}
          placeholder="Mínimo 8 caracteres"
          className={`
            w-full px-4 py-3 text-sm border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
            ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'}
          `}
        />
        {errors.password ? (
          <p id="password-error" role="alert" className="text-xs text-red-500 mt-1">{errors.password}</p>
        ) : (
          <p id="password-hint" className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres.</p>
        )}
      </div>

      {/* Campo: Confirmar contraseña — ⚠️ type="password" obligatorio */}
      <div>
        <label htmlFor="tutorado-confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Confirmar contraseña
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        </label>
        <input
          id="tutorado-confirm-password"
          type="password"  /* ⚠️ NUNCA cambiar a type="text" */
          autoComplete="new-password"
          value={formState.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          aria-required="true"
          aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
          aria-invalid={!!errors.confirmPassword}
          placeholder="Repite la contraseña"
          className={`
            w-full px-4 py-3 text-sm border rounded-xl
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
            ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'}
          `}
        />
        {errors.confirmPassword && (
          <p id="confirm-error" role="alert" className="text-xs text-red-500 mt-1">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Error de submit */}
      {submitError && (
        <div role="alert" className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          {submitError}
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors min-h-[44px] disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              Guardando...
            </span>
          ) : mode === 'create' ? 'Crear cuenta' : 'Actualizar contraseña'}
        </button>
      </div>
    </form>
  );
}

export default TutoradoForm;
