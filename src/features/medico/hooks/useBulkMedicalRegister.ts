import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicalService } from '@/src/services/api/medical';
import { BulkHealthRegisterRequest } from '../types';
import { toast } from 'sonner';

/**
 * @module useBulkMedicalRegister
 * @epic EPICA-4 Módulo Médico
 * @hu HU009
 * @ux UXMM-04
 * @api POST /api/medical/bulk-register
 */
export const useBulkMedicalRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkHealthRegisterRequest) => medicalService.bulkRegister(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['medical', 'students', variables.groupId] });
      toast.success(`Se registraron ${data.count} expedientes exitosamente.`);
    },
    onError: () => {
      toast.error('Ocurrió un error al guardar los expedientes. Por favor intente nuevamente.');
    }
  });
};
