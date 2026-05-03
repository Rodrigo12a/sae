import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAdminKPIs } from '@/src/services/api/admin';
import { KPIFilters } from '../types';

/**
 * @module useAdminKPIs
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU016
 * @ux UXPA-01, UXPA-02, UXPA-03, UXPA-04
 * @qa QA-04 (p95 < 3 s · Latencia ≤ 5 min · Throughput ≥ 50 req/s)
 * @api GET /api/admin/kpis
 * @privacy Devuelve únicamente datos agregados, NUNCA datos clínicos individuales.
 */
export const useAdminKPIs = (filters?: KPIFilters) => {
  return useQuery({
    queryKey: ['admin-kpis', filters],
    queryFn: () => getAdminKPIs(filters),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutos de frescura
    refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
  });
};
