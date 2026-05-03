import { 
  AdminKPIs, 
  KPIFilters, 
  DrillDownRequest, 
  DrillDownResponse, 
  ExportRequest, 
  ExportResponse 
} from '@/src/features/dashboard-admin/types';
import { api as apiClient } from '@/src/lib/api';
import { 
  Carrera, 
  CreateCarreraDto, 
  UpdateCarreraDto,
  AlertCatalogItem,
  CreateAlertCatalogDto,
  UpdateAlertCatalogDto
} from '@/src/types/admin';

/**
 * Servicio de API para endpoints del Administrador
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU016
 * @privacy Devuelve únicamente datos agregados.
 */

// TODO: conectar a GET /api/admin/kpis cuando esté disponible
export const getAdminKPIs = async (filters?: KPIFilters): Promise<AdminKPIs> => {
  const response = await apiClient.get<AdminKPIs>('/admin/kpis', { params: filters });
  return response.data;
};

// TODO: conectar a GET /api/admin/groups/:id/drill-down cuando esté disponible
export const getAdminDrillDown = async (request: DrillDownRequest): Promise<DrillDownResponse> => {
  const response = await apiClient.get<DrillDownResponse>(`/admin/groups/${request.careerId}/drill-down`, {
    params: { semester: request.semester }
  });
  return response.data;
};

// TODO: conectar a POST /api/admin/reports/export cuando esté disponible
export const exportAdminReport = async (request: ExportRequest): Promise<ExportResponse> => {
  return new Promise((resolve) => {
    // Simular tiempo de procesamiento
    setTimeout(() => {
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
    }, 2000);
  });
};

/**
 * Gestión de Carreras
 * @api GET /api/carreras
 */
export const getAdminCarreras = async (): Promise<Carrera[]> => {
  const response = await apiClient.get<Carrera[]>('/carreras');
  return response.data;
};

/**
 * Crear nueva carrera
 * @api POST /api/carreras
 */
export const createCarrera = async (data: CreateCarreraDto): Promise<Carrera> => {
  const response = await apiClient.post<Carrera>('/carreras', data);
  return response.data;
};

/**
 * Actualizar carrera
 * @api PATCH /api/carreras/:id
 */
export const updateCarrera = async (id: string, data: UpdateCarreraDto): Promise<Carrera> => {
  const response = await apiClient.patch<Carrera>(`/carreras/${id}`, data);
  return response.data;
};

/**
 * Dar de baja carrera (soft delete)
 * @api DELETE /api/carreras/:id
 */
export const deleteCarrera = async (id: string): Promise<void> => {
  await apiClient.delete(`/carreras/${id}`);
};

/**
 * Gestión de Catálogo de Alertas
 * @api GET /api/alert-catalog
 */
export const getAlertCatalog = async (): Promise<AlertCatalogItem[]> => {
  const response = await apiClient.get<AlertCatalogItem[]>('/alert-catalog');
  return response.data;
};

/**
 * Crear nueva etiqueta de alerta
 * @api POST /api/alert-catalog
 */
export const createAlertTag = async (data: CreateAlertCatalogDto): Promise<AlertCatalogItem> => {
  const response = await apiClient.post<AlertCatalogItem>('/alert-catalog', data);
  return response.data;
};

/**
 * Actualizar etiqueta de alerta
 * @api PATCH /api/alert-catalog/:id
 */
export const updateAlertTag = async (id: string, data: UpdateAlertCatalogDto): Promise<AlertCatalogItem> => {
  const response = await apiClient.patch<AlertCatalogItem>(`/alert-catalog/${id}`, data);
  return response.data;
};

/**
 * Eliminar etiqueta de alerta
 * @api DELETE /api/alert-catalog/:id
 */
export const deleteAlertTag = async (id: string): Promise<void> => {
  await apiClient.delete(`/alert-catalog/${id}`);
};
