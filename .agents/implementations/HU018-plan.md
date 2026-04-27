# Implementation Plan: HU018 — Exportar reportes en múltiples formatos
Fecha: 22 de Abril de 2026
Actor: Administrador / Director Académico
Épica: Épica 6 — Panel Ejecutivo y Reportes

## Análisis Inicial y Dependencias
- **Dependencias**: Se integrará en `AdminDashboardPage` (HU016).
- **Componentes reutilizables**: Botonería del dashboard, `toast` de `sonner`. Se construirá un `ExportModal`.
- **Privacidad**: El reporte en formato Excel no debe incluir bajo ninguna circunstancia datos clínicos. Esto se garantiza a nivel backend, y a nivel frontend no se definirán tipos que admitan `diagnosticoClinico` para los datos de reporte.

## Componentes a Crear
- [ ] `src/features/dashboard-admin/components/ExportModal/index.tsx`: Modal para seleccionar el formato de reporte (PDF o Excel) e informar sobre el envío asíncrono si el dataset es muy grande.
- [ ] `src/features/dashboard-admin/hooks/useExportReport.ts`: Hook basado en TanStack Query (`useMutation`) para manejar la petición de exportación y gestionar estados de carga/éxito/error.

## Componentes a Modificar
- [ ] `src/app/admin/dashboard/page.tsx`: Añadir un botón global "Exportar Reporte" en la cabecera del dashboard y conectar el `ExportModal`.
- [ ] Opcionalmente, conectar el botón local de "Exportar reporte detallado" del panel de Inconsistencias para abrir el mismo modal pero con filtros pre-cargados.

## Endpoints Necesarios
- `POST /api/admin/reports/export` → Inicia la generación del reporte.
  - **Payload**: `{ format: 'pdf' | 'excel', filters: KPIFilters }`
  - **Respuesta (Mock)**: `{ status: 'ready', downloadUrl: '...' }` o `{ status: 'processing', message: 'Se enviará por correo' }` (para >10k registros).
  - Estado: mock.

## Tipos TypeScript Requeridos
- `ExportFormat`: `'pdf' | 'excel'`
- `ExportRequest`: `{ format: ExportFormat; filters: KPIFilters }`
- `ExportResponse`: `{ status: 'ready' | 'processing'; downloadUrl?: string; message?: string; }`

## Estados de UI a Implementar
- [ ] **Idle**: Modal para elegir formato y previsualizar opciones.
- [ ] **Loading**: Spinner/estado de carga bloqueante del modal mientras se solicita la exportación.
- [ ] **Success**: Toast de confirmación de descarga (o aviso de envío por correo si asíncrono).
- [ ] **Error**: Toast notificando que hubo un problema.

## Criterios de Aceptación a Cubrir
- [ ] Escenario 1: Exportar PDF rápido (< 30s) → UI muestra spinner, luego inicia descarga automática.
- [ ] Escenario 2: Exportar Excel masivo → UI notifica que el proceso se ejecuta en segundo plano y se enviará por correo.
- [ ] Edge case: Falla de red al solicitar exportación.

## Checklist de Privacidad
- [ ] ¿El componente se renderiza para el Administrador?
      Sí.
- [ ] ¿El campo diagnosticoClinico está ausente?
      Sí, garantizado por las reglas operativas y documentado en los tipos.
- [ ] ¿Los tipos TypeScript reflejan la restricción por rol?
      Sí, no habrá tipado que refleje datos clínicos en los reportes.
