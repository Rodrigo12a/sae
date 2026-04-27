import { useQuery } from '@tanstack/react-query';
import { medicalService } from '@/src/services/api/medical';
import { BulkHealthEntry } from '../types';

/**
 * @module useGroupStudents
 * @epic EPICA-4 Módulo Médico
 * @hu HU009
 * @ux UXMM-02
 * @api GET /api/medical/students?group=:id
 */
export const useGroupStudents = (groupId: string | undefined) => {
  return useQuery<BulkHealthEntry[]>({
    queryKey: ['medical', 'students', groupId],
    queryFn: () => medicalService.getStudentsByGroup(groupId!),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};
