/**
 * @module MedicalReferralModal
 * @epic EPICA-5 Derivaciones y Atención Especializada
 * @hu HU013
 * @ux UXDR-02, UXDR-03
 * @api POST /api/referrals/medical
 * @privacy rol:tutor -> Evita términos clínicos en el campo de texto observable
 */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMedicalReferral } from '../../hooks/useMedicalReferral';

interface MedicalReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  alertId?: string;
  studentName: string;
}

// Lista básica de términos clínicos para validación inline
const CLINICAL_TERMS_REGEX = /(depresión|ansiedad|trastorno|enfermedad|diagnóstico|síndrome|patología|medicación|tratamiento|clínico|psiquiátrico|TDAH|TEA)/i;

const medicalReferralSchema = z.object({
  descripcionObservable: z
    .string()
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(500, 'La descripción no puede exceder los 500 caracteres')
    .refine((val) => !CLINICAL_TERMS_REGEX.test(val), {
      message: 'Evita usar términos clínicos (ej. diagnóstico, trastorno, depresión). Describe solo lo que observas (ej. "el estudiante se ausenta recurrentemente y menciona molestias físicas").',
    }),
});

type MedicalReferralForm = z.infer<typeof medicalReferralSchema>;

export const MedicalReferralModal: React.FC<MedicalReferralModalProps> = ({
  isOpen,
  onClose,
  studentId,
  alertId,
  studentName,
}) => {
  const { submitReferral } = useMedicalReferral();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<MedicalReferralForm>({
    resolver: zodResolver(medicalReferralSchema),
  });

  const descriptionValue = watch('descripcionObservable') || '';
  const hasClinicalTermWarning = CLINICAL_TERMS_REGEX.test(descriptionValue);

  const onSubmit = async (data: MedicalReferralForm) => {
    try {
      await submitReferral.mutateAsync({
        studentId,
        alertId,
        descripcionObservable: data.descripcionObservable,
      });
      setToastMessage('Caso derivado a servicios médicos exitosamente');
      setTimeout(() => {
        setToastMessage(null);
        reset();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting referral:', error);
      // En producción usar un toast store global
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Opcional: Toast de éxito. Lo ideal es usar el store global de notificaciones. */}
      {toastMessage && (
        <div className="absolute top-4 right-4 bg-green-100 text-green-800 p-4 rounded-md shadow-md border border-green-200">
          <p className="flex items-center gap-2">
            <span aria-hidden="true">✓</span> {toastMessage}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span aria-hidden="true" className="text-blue-600">⚕️</span> 
            Derivar a Servicios Médicos
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label="Cerrar modal"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto">
          <p className="text-sm text-slate-600 mb-6">
            Estás a punto de derivar a <strong className="text-slate-800">{studentName}</strong> a servicios médicos.
            Por favor, describe únicamente los síntomas o comportamientos que has observado.
          </p>

          <form id="medical-referral-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700">
                  Descripción observable <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <span className="text-xs text-slate-400">
                  {descriptionValue.length}/500
                </span>
              </div>
              
              <textarea
                id="descripcion"
                {...register('descripcionObservable')}
                rows={5}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors resize-none ${
                  errors.descripcionObservable || hasClinicalTermWarning
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-slate-300 focus:ring-blue-500'
                }`}
                placeholder="Ej. El estudiante reporta dolores de cabeza frecuentes y cansancio extremo durante las últimas 3 sesiones..."
                aria-invalid={errors.descripcionObservable ? 'true' : 'false'}
                aria-describedby={errors.descripcionObservable ? "descripcion-error" : undefined}
                disabled={isSubmitting}
              />
              
              {/* Advertencia en vivo (inline warning) si el usuario teclea un término clínico */}
              {hasClinicalTermWarning && !errors.descripcionObservable && (
                <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <span aria-hidden="true">⚠️</span>
                  <p>
                    <strong>Aviso de Privacidad:</strong> Parece que estás usando terminología clínica. Recuerda que como tutor solo debes documentar síntomas observables.
                  </p>
                </div>
              )}

              {/* Error de validación al hacer submit o si viola la regla restrictiva del zod */}
              {errors.descripcionObservable && (
                <p id="descripcion-error" className="text-sm text-red-600 flex items-start gap-1 mt-1">
                  <span aria-hidden="true">❕</span>
                  {errors.descripcionObservable.message}
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="medical-referral-form"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent text-white rounded-full" aria-hidden="true"></span>
                Procesando...
              </span>
            ) : (
              'Derivar Caso'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
