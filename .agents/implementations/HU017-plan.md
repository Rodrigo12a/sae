# Implementation Plan: HU017 — Drill-down por grupo y semestre
Fecha: 22 Abril 2026
Actor: Director Académico (Admin)
Épica: Épica 6 - Panel Ejecutivo y Reportes

## Componentes a Crear
- [ ] `src/components/ui/Drawer/index.tsx`: Componente base de UI para el panel lateral (Slide-over) con animación (Framer Motion o CSS transitons).
- [ ] `src/features/dashboard-admin/components/DrillDownPanel/index.tsx`: Panel lateral específico que consume los datos de drill-down y lista los estudiantes en riesgo con variables predominantes.
- [ ] `src/features/dashboard-admin/hooks/useDrillDown.ts`: Hook de TanStack Query para cargar detalles al abrir el panel lateral.

## Componentes a Modificar
- [ ] `src/features/dashboard-admin/components/CareerRiskChart/index.tsx`: Añadir manejador de eventos `onClick` en las barras para abrir el panel de Drill-down, pasando el contexto (carrera/semestre).
- [ ] `src/app/admin/dashboard/page.tsx`: Integrar el estado local (ej. `selectedCareerForDrillDown`) y renderizar el `DrillDownPanel`.

## Endpoints Necesarios
- GET `/api/admin/groups/:id/drill-down` (o alternativamente query params `?careerId=X`) → Obtener la lista de estudiantes anómalos de la cohorte y sus causas predominantes → Estado: **Mock a crear en `src/services/api/admin.ts`**

## Tipos TypeScript Requeridos
- `DrillDownRequest`: Parámetros para la consulta (carrera, semestre).
- `DrillDownResponse`: Interfaz con lista de `DrillDownStudent` (estudiantes en riesgo) y variables predominantes.
- `DrillDownStudent`: Detalles operativos del estudiante (SIN datos clínicos).

## Estados de UI a Implementar
- [ ] **Loading** (skeleton): SkeletonPulse dentro del Drawer mientras carga el detalle de la carrera seleccionada.
- [ ] **Success**: Renderizado de la lista de estudiantes con su semáforo respectivo y link a su perfil individual.
- [ ] **Empty state**: Mensaje contextual si, por alguna razón, no hay estudiantes de alto riesgo detallados.
- [ ] **Error**: Manejo de error al fallar la consulta de drill-down (Toast o mensaje inline).

## Criterios de Aceptación a Cubrir
- [ ] Escenario 1: Clic en barra del gráfico → panel lateral con estudiantes en riesgo y variables predominantes.
- [ ] Escenario 2: Navegar al perfil individual desde el panel lateral con regreso conservando filtros (mantener state/URL query params en el dashboard).

## Checklist de Privacidad
- [ ] ¿El componente se renderiza para el Administrador?
      Sí. El administrador ve métricas y datos operativos.
- [ ] ¿El campo diagnosticoClinico está ausente?
      Sí, no se debe exponer en `DrillDownStudent`. Se usará únicamente la `etiquetaOperativa` del semáforo.
- [ ] ¿Los tipos TypeScript reflejan la restricción por rol?
      Sí, se crearán interfaces explícitas omitiendo el historial clínico privado.
