import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  visible: boolean;
}

interface DashboardState {
  widgets: DashboardWidget[];
  toggleWidget: (id: string) => void;
  resetWidgets: () => void;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { 
    id: 'kpi-summary', 
    title: 'Tarjetas de KPI', 
    description: 'Resumen de riesgo global, alertas y encuestas pendientes.',
    visible: true 
  },
  { 
    id: 'career-chart', 
    title: 'Comparativa por Carrera', 
    description: 'Gráfico de barras con el nivel de riesgo por programa académico.',
    visible: true 
  },
  { 
    id: 'inconsistencies', 
    title: 'Inconsistencias de Servicio', 
    description: 'Listado de tutores con anomalías en el seguimiento de casos.',
    visible: true 
  },
  { 
    id: 'audit-notice', 
    title: 'Aviso de Auditoría', 
    description: 'Nota informativa sobre la integridad del sistema y privacidad.',
    visible: true 
  },
  { 
    id: 'active-careers-list', 
    title: 'Carreras y Materias Activas', 
    description: 'Vista detallada de los programas académicos vigentes y sus materias.',
    visible: true 
  },
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: DEFAULT_WIDGETS,
      toggleWidget: (id) => set((state) => ({
        widgets: state.widgets.map((w) => 
          w.id === id ? { ...w, visible: !w.visible } : w
        )
      })),
      resetWidgets: () => set({ widgets: DEFAULT_WIDGETS }),
    }),
    {
      name: 'sae-dashboard-config',
    }
  )
);
