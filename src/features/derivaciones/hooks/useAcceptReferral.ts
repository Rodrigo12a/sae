import { useMutation, useQueryClient } from '@tanstack/react-query';
import { referralsService } from '@/src/services/api/referrals';
import { AcceptReferralRequest } from '../types';

/**
 * @module useAcceptReferral
 * @epic EPICA-5 Derivaciones
 * @hu HU014
 * @api PUT /api/referrals/:id/accept
 */
export const useAcceptReferral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AcceptReferralRequest) => referralsService.acceptReferral(data),
    onSuccess: () => {
      // Invalidate queries to refresh the pending list
      queryClient.invalidateQueries({ queryKey: ['pendingReferrals'] });
    },
  });
};
