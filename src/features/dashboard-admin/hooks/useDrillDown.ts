import { useQuery } from '@tanstack/react-query';
import { getAdminDrillDown } from '@/src/services/api/admin';
import { DrillDownRequest } from '../types';

/**
 * @module useDrillDown
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU017
 * @ux UXDT-07
 * @qa QA-05 (latencia p95 < 1.5 s)
 * @api GET /api/admin/groups/:id/drill-down
 * @privacy admin → sin acceso al detalle clínico, únicamente operacionales
 */
export const useDrillDown = (request: DrillDownRequest | null) => {
  return useQuery({
    queryKey: ['admin-drill-down', request?.careerId, request?.semester],
    queryFn: () => {
      if (!request) throw new Error('Request data missing');
      return getAdminDrillDown(request);
    },
    enabled: !!request,
    staleTime: 60 * 1000, // 1 minuto de cache
    retry: 1,
  });
};
