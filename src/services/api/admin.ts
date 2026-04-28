import { AdminKPIs, KPIFilters } from '@/src/features/dashboard-admin/types';
import { api as apiClient } from '@/src/lib/api';

/**
 * Servicio de API para endpoints del Administrador
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU016
 * @privacy Devuelve únicamente datos agregados.
 */

// TODO: conectar a GET /api/admin/kpis cuando esté disponible
export const getAdminKPIs = async (filters?: KPIFilters): Promise<AdminKPIs> => {
  // Simulando llamada real
  // const response = await apiClient.get<AdminKPIs>('/admin/kpis', { params: filters });
  // return response.data;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        riesgoGlobal: Math.floor(Math.random() * 20) + 40, // 40-60
        alertasAtendidas: Math.floor(Math.random() * 50) + 100, // 100-150
        alertasIgnoradas: Math.floor(Math.random() * 20) + 10, // 10-30
        comparativaPorCarrera: [
          { careerId: 'ing-sistemas', careerName: 'Ing. en Sistemas', riskIndex: Math.floor(Math.random() * 20) + 50 },
          { careerId: 'ing-industrial', careerName: 'Ing. Industrial', riskIndex: Math.floor(Math.random() * 20) + 40 },
          { careerId: 'lic-administracion', careerName: 'Lic. en Administración', riskIndex: Math.floor(Math.random() * 20) + 30 },
          { careerId: 'lic-derecho', careerName: 'Lic. en Derecho', riskIndex: Math.floor(Math.random() * 20) + 35 },
        ],
        dataFreshness: new Date().toISOString(),
        latencyMs: Math.floor(Math.random() * 100) + 50, // 50-150ms latency (falsa)
      });
    }, 800);
  });
};

// TODO: conectar a GET /api/admin/groups/:id/drill-down cuando esté disponible
export const getAdminDrillDown = async (request: import('@/src/features/dashboard-admin/types').DrillDownRequest): Promise<import('@/src/features/dashboard-admin/types').DrillDownResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        careerId: request.careerId,
        careerName: request.careerId === 'ing-sistemas' ? 'Ing. en Sistemas' : 
                    request.careerId === 'ing-industrial' ? 'Ing. Industrial' : 
                    request.careerId === 'lic-administracion' ? 'Lic. en Administración' : 'Lic. en Derecho',
        totalStudentsAtRisk: 3,
        students: [
          {
            id: 'S1001',
            name: 'María González Pérez',
            semester: request.semester || 4,
            etiquetaOperativa: 'Apoyo Académico Urgente',
            semaforoEstado: 'rojo',
            predominantVariables: ['Bajo rendimiento en ciencias básicas', 'Ausentismo recurrente (>30%)'],
          },
          {
            id: 'S1002',
            name: 'Carlos Mendoza Ruiz',
            semester: request.semester || 4,
            etiquetaOperativa: 'Seguimiento Socioeconómico',
            semaforoEstado: 'amarillo',
            predominantVariables: ['Riesgo de pago de colegiatura', 'Baja participación en plataforma'],
          },
          {
            id: 'S1003',
            name: 'Ana Beltrán Silva',
            semester: request.semester || 4,
            etiquetaOperativa: 'Revisión por Coordinación',
            semaforoEstado: 'revisar',
            predominantVariables: ['Alertas múltiples de tutores', 'Datos demográficos atípicos'],
          }
        ]
      });
    }, 600);
  });
};

// TODO: conectar a POST /api/admin/reports/export cuando esté disponible
export const exportAdminReport = async (request: import('@/src/features/dashboard-admin/types').ExportRequest): Promise<import('@/src/features/dashboard-admin/types').ExportResponse> => {
  return new Promise((resolve) => {
    // Simular tiempo de procesamiento
    setTimeout(() => {
      // Simular que algunos reportes son masivos (>10k registros)
      // Para este mock, el PDF será "rápido" y el Excel será "procesamiento en fondo"
      if (request.format === 'excel') {
        resolve({
          status: 'processing',
          message: 'El conjunto de datos es mayor a 10,000 registros. Se generará en segundo plano y se enviará un enlace de descarga a tu correo.',
        });
      } else {
        resolve({
          status: 'ready',
          downloadUrl: 'https://ejemplo.com/download/reporte_sae.pdf',
        });
      }
    }, 2000); // 2 segundos de carga para efecto UI
  });
};

/**
 * Gestión de Carreras
 */
export const getAdminCarreras = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', nombre: 'Ingeniería en Sistemas Computacionales', codigo: 'ISC', activa: true },
        { id: '2', nombre: 'Ingeniería Industrial', codigo: 'IIND', activa: true },
        { id: '3', nombre: 'Licenciatura en Administración', codigo: 'LADM', activa: true },
        { id: '4', nombre: 'Licenciatura en Derecho', codigo: 'LDER', activa: true },
      ]);
    }, 500);
  });
};

export const updateCarrera = async (id: string, data: any): Promise<void> => {
  console.log('API: Updating carrera', id, data);
  return new Promise((resolve) => {
    setTimeout(resolve, 800);
  });
};

export const deleteCarrera = async (id: string): Promise<void> => {
  console.log('API: Deleting carrera', id);
  return new Promise((resolve) => {
    setTimeout(resolve, 800);
  });
};

export const createCarrera = async (data: any): Promise<void> => {
  console.log('API: Creating carrera', data);
  return new Promise((resolve) => {
    setTimeout(resolve, 800);
  });
};

/**
 * Gestión de Catálogo de Alertas
 */
export const updateAlertTag = async (id: string, data: any): Promise<void> => {
  console.log('API: Updating alert tag', id, data);
  return new Promise((resolve) => {
    setTimeout(resolve, 800);
  });
};

export const createAlertTag = async (data: any): Promise<void> => {
  console.log('API: Creating alert tag', data);
  return new Promise((resolve) => {
    setTimeout(resolve, 800);
  });
};

export const deleteAlertTag = async (id: string): Promise<void> => {
  console.log('API: Deleting alert tag', id);
  return new Promise((resolve) => {
    setTimeout(resolve, 800);
  });
};

/**
 * Gestión de Catálogo de Alertas
 */
export const getAlertCatalog = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'A1', etiqueta: 'Apoyo Académico Urgente', nivel: 'rojo', descripcion: 'Estudiantes con riesgo académico crítico.' },
        { id: 'A2', etiqueta: 'Seguimiento Socioeconómico', nivel: 'amarillo', descripcion: 'Estudiantes con problemas financieros detectados.' },
        { id: 'A3', etiqueta: 'Apoyo Psicológico', nivel: 'revisar', descripcion: 'Derivación para atención mental.' },
      ]);
    }, 500);
  });
};
