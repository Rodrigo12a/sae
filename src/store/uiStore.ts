import { create } from 'zustand';
import { AIEngineStatus } from '../types/alert';

interface UIState {
  aiEngineStatus: AIEngineStatus;
  lastEngineUpdate: string | null;
  setAIEngineStatus: (status: AIEngineStatus, timestamp?: string) => void;
}

/**
 * Global UI Store for cross-cutting concerns like AI Engine status.
 */
export const useUIStore = create<UIState>((set) => ({
  aiEngineStatus: 'ok',
  lastEngineUpdate: null,
  setAIEngineStatus: (status, timestamp) => set({ 
    aiEngineStatus: status, 
    lastEngineUpdate: timestamp || new Date().toISOString() 
  }),
}));
