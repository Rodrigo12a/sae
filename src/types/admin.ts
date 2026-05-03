/**
 * @module AdminTypes
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @description Tipos para la gestión administrativa del catálogo y configuraciones.
 */

export interface Carrera {
  id: string;
  nombre: string;
  activo: boolean;
  materias?: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateCarreraDto {
  nombre: string;
  activo: boolean;
  materias?: string[];
}

export interface UpdateCarreraDto extends Partial<CreateCarreraDto> {}

export interface AlertCatalogItem {
  id: string;
  etiqueta: string;
  nivel: 'rojo' | 'amarillo' | 'verde' | 'revisar' | 'gris';
  descripcion: string;
  activo: boolean;
}

export interface CreateAlertCatalogDto {
  etiqueta: string;
  nivel: 'rojo' | 'amarillo' | 'verde' | 'revisar' | 'gris';
  descripcion: string;
  activo: boolean;
}

export interface UpdateAlertCatalogDto extends Partial<CreateAlertCatalogDto> {}
