import { create } from 'zustand';
import { AIEngineStatus } from '../types/alert';

interface UIState {
  aiEngineStatus: AIEngineStatus;
  lastEngineUpdate: string | null;
  isSidebarCollapsed: boolean;
  isSidebarOpen: boolean;
  setAIEngineStatus: (status: AIEngineStatus, timestamp?: string) => void;
  toggleSidebarCollapse: () => void;
  toggleSidebarMobile: () => void;
  closeSidebarMobile: () => void;
}

/**
 * Global UI Store for cross-cutting concerns like AI Engine status and Sidebar state.
 */
export const useUIStore = create<UIState>((set) => ({
  aiEngineStatus: 'ok',
  lastEngineUpdate: null,
  isSidebarCollapsed: false,
  isSidebarOpen: false,
  setAIEngineStatus: (status, timestamp) => set({ 
    aiEngineStatus: status, 
    lastEngineUpdate: timestamp || new Date().toISOString() 
  }),
  toggleSidebarCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleSidebarMobile: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebarMobile: () => set({ isSidebarOpen: false }),
}));
