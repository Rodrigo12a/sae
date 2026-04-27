/**
 * @module useAudit
 * @epic EPICA-8 Auditoría y Control de Calidad
 * @hu HU023 — Alertar por inconsistencia de servicio
 * @ux UXAU-11, UXAU-12, UXAU-13
 * @qa QA-01, QA-03
 * @api GET /api/audit/inconsistencies
 * @privacy Solo accesible para rol:admin. Los tutores no ven sus inconsistencias.
 */

import { useState, useEffect } from 'react';
import { getInconsistencies, resolveInconsistency } from '@/src/services/api/audit';
import { ServiceInconsistency } from '../types';
import { toast } from 'sonner';

export function useAudit() {
  const [inconsistencies, setInconsistencies] = useState<ServiceInconsistency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInconsistencies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getInconsistencies();
      setInconsistencies(data);
    } catch (err) {
      setError('No se pudieron cargar las inconsistencias de auditoría.');
      toast.error('Error de red al cargar auditoría');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'resolve' | 'escalate') => {
    try {
      const { success } = await resolveInconsistency(id, action);
      if (success) {
        setInconsistencies(prev => prev.filter(item => item.id !== id));
        toast.success(action === 'resolve' ? 'Inconsistencia resuelta' : 'Caso escalado a dirección');
      }
    } catch (err) {
      toast.error('No se pudo procesar la acción.');
    }
  };

  useEffect(() => {
    fetchInconsistencies();
  }, []);

  return {
    inconsistencies,
    isLoading,
    error,
    retry: fetchInconsistencies,
    handleAction
  };
}
