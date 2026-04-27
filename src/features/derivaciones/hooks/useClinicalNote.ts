/**
 * @module useClinicalNote
 * @epic EPICA-5 Derivaciones y Atención Especializada
 * @hu HU015
 * @ux UXDR-07, UXDR-08
 * @qa QA-05 (Retry and Circuit Breaker behavior)
 * @api POST /api/referrals/:id/notes
 * @privacy Solo el rol psicólogo puede invocar este hook; las notas se cifran en backend si esPrivada=true
 */

import { useMutation } from '@tanstack/react-query';
import { referralsService } from '@/src/services/api/referrals';
import { ClinicalNoteRequest } from '../types';

export const useClinicalNote = () => {
  const saveNoteMutation = useMutation({
    mutationFn: (data: ClinicalNoteRequest) => referralsService.addClinicalNote(data),
    retry: 2, // Circuit breaker policy
  });

  return {
    saveNote: saveNoteMutation.mutateAsync,
    isSaving: saveNoteMutation.isPending,
    isError: saveNoteMutation.isError,
    error: saveNoteMutation.error,
  };
};
