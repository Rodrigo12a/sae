# Implementation Plan: HU-ADMIN-CARRERAS — Gestión de Carreras Funcional
Fecha: 2026-04-29
Actor: Administrador
Épica: Épica 6 - Panel Ejecutivo y Reportes (Módulo de Catálogo)

## Resumen
Convertir las funciones mock de gestión de carreras en `src/services/api/admin.ts` en llamadas reales al backend utilizando la documentación de Swagger. Asegurar que el frontend en `src/app/admin/dashboard/catalogo/page.tsx` maneje correctamente los datos reales y los estados de carga/error.

## Archivos a Modificar
- [ ] `src/services/api/admin.ts`: Refactorizar `getAdminCarreras`, `createCarrera`, `updateCarrera` y `deleteCarrera`.
- [ ] `src/app/admin/dashboard/catalogo/page.tsx`: Asegurar integración con los nuevos tipos y manejo de errores.

## Endpoints Necesarios
- `GET` `/carreras` → Obtener lista de carreras → Estado: Disponible
- `POST` `/carreras` → Crear una nueva carrera → Estado: Disponible
- `PATCH` `/carreras/{id}` → Actualizar carrera existente → Estado: Disponible
- `DELETE` `/carreras/{id}` → Soft delete de carrera → Estado: Disponible

## Tipos TypeScript Requeridos
- `Carrera`: `{ id: string; nombre: string; campusId: string; activo: boolean; createdAt: string; updatedAt: string; deletedAt?: string | null; }`
- `CreateCarreraDto`: `{ nombre: string; campusId: string; activo: boolean; }`
- `UpdateCarreraDto`: `Partial<CreateCarreraDto>`

## Estados de UI a Implementar
- [x] Loading (ya existe en `page.tsx` con `isLoading`)
- [x] Success (renderizado de tabla)
- [x] Empty state (ya manejado)
- [x] Error (usar `toast` para errores de API)

## Criterios de Aceptación a Cubrir
- [ ] **Escenario 1: Listado de carreras** -> Al cargar la página, se deben mostrar las carreras reales del campus del administrador.
- [ ] **Escenario 2: Creación exitosa** -> Al crear una carrera, se debe persistir en el backend y actualizar la lista.
- [ ] **Escenario 3: Actualización exitosa** -> Al editar una carrera (nombre o estado activo), se debe reflejar en el backend.
- [ ] **Escenario 4: Eliminación suave** -> Al eliminar una carrera, se debe realizar un soft delete y desaparecer de la lista activa.
- [ ] **Edge case: Error de validación** -> Si el backend devuelve 400 (ej. nombre duplicado), mostrar toast descriptivo.

## Checklist de Privacidad
- [x] ¿El componente se renderiza para el Tutor? **NO**, es solo para Admin.
- [x] ¿Los tipos TypeScript reflejan la restricción por rol? Sí, `admin.ts` está marcado para Admin.
- [x] ¿El candado visual está implementado donde aplica? N/A para este módulo.

## Riesgos y Notas
- **Campus ID**: Es necesario obtener el `campusId` del administrador actual para las peticiones. Si no está disponible en la sesión, se debe manejar o permitir seleccionar campus si el admin tiene permisos globales.
- **Formato de Respuesta**: Verificar si el backend devuelve el objeto creado o solo un mensaje de éxito.
