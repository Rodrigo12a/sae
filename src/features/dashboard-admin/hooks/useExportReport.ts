import { useMutation } from '@tanstack/react-query';
import { exportAdminReport } from '@/src/services/api/admin';
import { ExportRequest, ExportResponse } from '../types';

/**
 * @module useExportReport
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU018
 * @ux UXPA-07, UXPA-08, UXPA-09
 * @api POST /api/admin/reports/export
 */
export const useExportReport = () => {
  return useMutation<ExportResponse, Error, ExportRequest>({
    mutationFn: (request: ExportRequest) => exportAdminReport(request),
  });
};
