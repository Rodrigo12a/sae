import { useQuery } from '@tanstack/react-query';
import { referralsService } from '@/src/services/api/referrals';
import { PendingReferral } from '../types';

/**
 * @module usePendingReferrals
 * @epic EPICA-5 Derivaciones
 * @hu HU014
 * @api GET /api/referrals/pending
 * @privacy Solo se retornan los datos del expediente permitidos para el psicólogo.
 */
export const usePendingReferrals = () => {
  return useQuery<PendingReferral[], Error>({
    queryKey: ['pendingReferrals'],
    queryFn: referralsService.getPendingReferrals,
  });
};
