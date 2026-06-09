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

/**
 * Generar reporte de administración
 * @api POST /api/admin/reports/generate
 */
export const exportAdminReport = async (request: ExportRequest): Promise<ExportResponse> => {
  const response = await apiClient.post<ExportResponse>('/admin/reports/generate', {
    format: request.format,
    filters: {
      career: request.filters.careerId,
      semester: request.filters.semester
    }
  });
  return response.data;
};

/**
 * Gestión de Carreras
 * @api GET /api/carreras
 */
export const getAdminCarreras = async (): Promise<Carrera[]> => {
  try {
    const response = await apiClient.get<Carrera[]>('/carreras');
    return response.data;
  } catch (error: any) {
    console.warn('getAdminCarreras failed:', error?.message || error);
    return [];
  }
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

/**
 * Obtener detalles de una carrera específica
 * @api GET /carreras/{id}
 */
export const getCarreraById = async (id: string): Promise<Carrera> => {
  const response = await apiClient.get<Carrera>(`/carreras/${id}`);
  return response.data;
};

/**
 * Obtener la lista de alumnos asociados a una carrera
 * @api GET /carreras/{id}/alumnos
 */
export const getCarreraAlumnos = async (id: string): Promise<any[]> => {
  try {
    const response = await apiClient.get<any[]>(`/carreras/${id}/alumnos`);
    return response.data;
  } catch (error: any) {
    console.warn(`getCarreraAlumnos failed for career ${id}:`, error?.message || error);
    return [];
  }
};

/**
 * Obtener la lista de docentes asociados a una carrera
 * @api GET /carreras/{id}/docentes
 */
export const getCarreraDocentes = async (id: string): Promise<any[]> => {
  const response = await apiClient.get<any[]>(`/carreras/${id}/docentes`);
  return response.data;
};

/**
 * Asignar un docente a una carrera
 * @api PATCH /carreras/asignar/docente/{docenteId}
 */
export const asignarDocenteACarrera = async (docenteId: string, carreraId: string): Promise<any> => {
  const response = await apiClient.patch<any>(`/carreras/asignar/docente/${docenteId}`, {
    carreraId
  });
  return response.data;
};

/**
 * Asignar un alumno a una carrera y tutor
 * @api PATCH /carreras/asignar/alumno/{alumnoId}
 */
export const asignarAlumnoACarrera = async (alumnoId: string, data: { carreraId: string; tutorId: string }): Promise<any> => {
  const response = await apiClient.patch<any>(`/carreras/asignar/alumno/${alumnoId}`, data);
  return response.data;
};
