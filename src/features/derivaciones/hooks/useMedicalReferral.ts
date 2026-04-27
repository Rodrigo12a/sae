/**
 * @module useMedicalReferral
 * @epic EPICA-5 Derivaciones y Atención Especializada
 * @hu HU013
 * @ux UXDR-02, UXDR-03
 * @qa QA-01
 * @api POST /api/referrals/medical
 * @privacy rol:tutor -> sin datos clínicos
 */
import { useMutation } from '@tanstack/react-query';
import { referralsService } from '@/src/services/api/referrals';
import { MedicalReferralRequest } from '../types';

export const useMedicalReferral = () => {
  const submitReferral = useMutation({
    mutationFn: (data: MedicalReferralRequest) => referralsService.createMedicalReferral(data),
  });

  return {
    submitReferral,
  };
};
