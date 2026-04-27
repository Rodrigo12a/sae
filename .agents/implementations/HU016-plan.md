# Implementation Plan: HU016 — Dashboard ejecutivo con KPIs en tiempo real
Fecha: 22 Abril 2026
Actor: Administrador / Director académico
Épica: Épica 6 — Panel Ejecutivo y Reportes

## Componentes a Crear
- [ ] `src/app/(admin)/layout.tsx`: Layout base para el rol de administrador (si no existe).
- [ ] `src/app/(admin)/dashboard/page.tsx`: Pantalla principal del dashboard ejecutivo.
- [ ] `src/features/dashboard-admin/components/KPIWidget/index.tsx`: Tarjeta reutilizable para mostrar un KPI (Índice global, Alertas atendidas, etc.).
- [ ] `src/features/dashboard-admin/components/CareerRiskChart/index.tsx`: Gráfica comparativa de riesgo por carrera (usando Recharts).
- [ ] `src/features/dashboard-admin/components/FilterPanel/index.tsx`: Panel para seleccionar carrera y semestre.
- [ ] `src/features/dashboard-admin/hooks/useAdminKPIs.ts`: Hook para obtener y refrescar datos (cada 5 min).

## Componentes a Modificar
- [ ] N/A. (Se creará la estructura base para el rol de administrador).

## Endpoints Necesarios
- GET `/api/admin/kpis` → Obtener los KPIs globales y comparativa por carrera → Estado: **Mock** (Se creará en `src/services/api/admin.ts`).

## Tipos TypeScript Requeridos
- `AdminKPIs`: Interface principal para los datos del dashboard.
- `CareerRiskComparison`: Interface para la comparativa por carrera.
- `KPIFilters`: Interface para los filtros de carrera y semestre.

## Estados de UI a Implementar
- [ ] Loading (skeleton cards para las gráficas y KPIs)
- [ ] Success (renderización de métricas en tiempo real con latencia < 3s)
- [ ] Empty state (si no hay datos para el filtro seleccionado)
- [ ] Error (toast si falla la carga)
- [ ] Degraded (badge de frescura advirtiendo si los datos tienen más de 5 minutos de antigüedad)

## Criterios de Aceptación a Cubrir
- [ ] Escenario 1: Dashboard carga y muestra índice global, alertas atendidas/ignoradas y gráfica comparativa.
- [ ] Escenario 2: Cambio de filtro actualiza las gráficas (en tiempo real simulado).
- [ ] Edge case: Latencia mayor a 5 minutos muestra badge de "datos desactualizados/frescura".
- [ ] Edge case: Si los filtros aplicados no retornan datos, mostrar estado vacío claro.

## Checklist de Privacidad
- [ ] ¿El componente se renderiza para el Administrador?
      Si sí: ¿el dashboard está completamente agregado y el campo diagnosticoClinico o datos individuales están ausentes? **Sí, totalmente ausente**.
- [ ] ¿Los tipos TypeScript reflejan la restricción por rol?
- [ ] ¿El candado visual está implementado donde aplica? (En este caso son datos agregados, por lo que no aplican diagnósticos, pero sí protección estricta de rutas).
