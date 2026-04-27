import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAcceptReferral } from '../../hooks/useAcceptReferral';
import { toast } from 'sonner';

interface AcceptReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralId: string;
  studentName: string;
}

const acceptSchema = z.object({
  motivoAceptacion: z.string().min(10, 'El motivo de aceptación debe tener al menos 10 caracteres para documentar el caso.'),
});

type AcceptFormValues = z.infer<typeof acceptSchema>;

/**
 * @module AcceptReferralModal
 * @epic EPICA-5
 * @hu HU014
 * @api PUT /api/referrals/:id/accept
 * @privacy Psicólogo confirmando aceptación de derivación
 */
export const AcceptReferralModal: React.FC<AcceptReferralModalProps> = ({
  isOpen,
  onClose,
  referralId,
  studentName,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const acceptReferral = useAcceptReferral();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<AcceptFormValues>({
    resolver: zodResolver(acceptSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: AcceptFormValues) => {
    setIsSubmitting(true);
    try {
      await acceptReferral.mutateAsync({
        referralId,
        motivoAceptacion: data.motivoAceptacion,
      });
      toast.success('El caso ha sido recibido por Psicología', {
        description: 'Se ha notificado al tutor de origen.',
      });
      reset();
      onClose();
    } catch (error) {
      toast.error('Error al aceptar el caso', {
        description: 'Intenta nuevamente más tarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
        role="dialog"
        aria-labelledby="accept-modal-title"
        aria-modal="true"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[var(--psico-private-bg)] text-[var(--psico-accent)]">
          <h2 id="accept-modal-title" className="text-xl font-semibold">
            Aceptar Caso: {studentName}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 w-11 h-11 flex items-center justify-center rounded-full bg-white/50"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
          <p className="text-sm text-gray-600 mb-2">
            Para proceder con la aceptación del caso, por favor documenta el motivo o plan de acción inicial. Sin este motivo, no podrás aceptar el caso.
          </p>

          <div className="flex flex-col gap-2">
            <label htmlFor="motivoAceptacion" className="text-sm font-medium text-[var(--text-primary)]">
              Motivo de Aceptación / Observaciones
            </label>
            <textarea
              id="motivoAceptacion"
              {...register('motivoAceptacion')}
              className={`w-full p-3 border rounded-md text-sm min-h-[120px] resize-y ${
                errors.motivoAceptacion ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[var(--psico-accent)]'
              } focus:outline-none focus:ring-2`}
              placeholder="Ej. Se iniciará protocolo de valoración diagnóstica a partir de la próxima semana..."
              aria-invalid={!!errors.motivoAceptacion}
              aria-describedby={errors.motivoAceptacion ? "motivo-error" : undefined}
            />
            {errors.motivoAceptacion && (
              <p id="motivo-error" className="text-xs text-red-500 font-medium">
                {errors.motivoAceptacion.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 min-h-[44px] text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`px-4 py-2 min-h-[44px] text-sm font-medium text-white rounded-md transition-colors flex items-center justify-center gap-2 ${
                isValid && !isSubmitting
                  ? 'bg-[var(--psico-accent)] hover:bg-purple-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                  Procesando...
                </>
              ) : (
                'Aceptar Caso'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
