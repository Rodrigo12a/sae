import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';
import { AIEngineStatus } from '../types/alert';

/**
 * @module useAIEngineStatus
 * @epic EPICA-7 Motor de IA (Validación y Predicción)
 * @hu HU019, HU020
 * @description Hook para sincronizar y acceder al estado global del motor de IA.
 */
export function useAIEngineStatus() {
  const { aiEngineStatus, lastEngineUpdate, setAIEngineStatus } = useUIStore();

  const isDegraded = aiEngineStatus === 'degraded';
  const isUnavailable = aiEngineStatus === 'unavailable';
  const isOk = aiEngineStatus === 'ok';

  return {
    status: aiEngineStatus,
    lastUpdate: lastEngineUpdate,
    isDegraded,
    isUnavailable,
    isOk,
    updateStatus: setAIEngineStatus,
  };
}
