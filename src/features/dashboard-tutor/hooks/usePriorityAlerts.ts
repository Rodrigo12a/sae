/**
 * @module usePriorityAlerts
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU003
 * @ux UXDT-01, UXDT-02, UXDT-03, UXDT-04, UXDT-05
 * @qa QA-05 (latencia p95 < 1.5s — datos pre-computados, no on-demand)
 * @api GET /alerts/priority
 * @privacy Datos del tipo PriorityAlert — sin score ni diagnosticoClinico
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPriorityAlerts } from '@/src/services/api/alerts';
import { useUIStore } from '@/src/store/uiStore';
import type { PriorityAlert, AIEngineStatus } from '@/src/types/alert';

interface UsePriorityAlertsReturn {
  alerts: PriorityAlert[];
  aiEngineStatus: AIEngineStatus;
  lastUpdatedAt: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook para obtener y gestionar las alertas prioritarias del Tutor.
 * Implementa el modo degradado del Motor de IA (QA-05).
 */
export function usePriorityAlerts(): UsePriorityAlertsReturn {
  const setGlobalStatus = useUIStore(state => state.setAIEngineStatus);
  const [alerts, setAlerts] = useState<PriorityAlert[]>([]);
  const [aiEngineStatus, setAiEngineStatus] = useState<AIEngineStatus>('ok');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPriorityAlerts();
      setAlerts(response.alerts);
      setAiEngineStatus(response.aiEngineStatus);
      setLastUpdatedAt(response.lastUpdatedAt);
      setGlobalStatus(response.aiEngineStatus, response.lastUpdatedAt);
    } catch {
      setError('No se pudieron cargar las alertas. Verifica tu conexión.');
      // Si hay error de red, asumir modo degradado
      setAiEngineStatus('unavailable');
      setGlobalStatus('unavailable');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return {
    alerts,
    aiEngineStatus,
    lastUpdatedAt,
    isLoading,
    error,
    refetch: fetchAlerts,
  };
}
