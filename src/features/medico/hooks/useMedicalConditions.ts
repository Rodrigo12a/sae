import { useQuery } from '@tanstack/react-query';
import { medicalService } from '@/src/services/api/medical';
import { MedicalCondition } from '../types';

/**
 * @module useMedicalConditions
 * @epic EPICA-4 Módulo Médico
 * @hu HU009
 * @ux UXMM-01
 * @qa QA-05 Fetch desde catálogo mock, cacheado para performance
 * @api GET /api/medical/conditions
 * @privacy Solo accesible por rol Médico
 */
export const useMedicalConditions = () => {
  return useQuery<MedicalCondition[]>({
    queryKey: ['medical', 'conditions'],
    queryFn: () => medicalService.getConditions(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
