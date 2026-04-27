# Implementation Plan: HU023 — Alertar por inconsistencia de servicio
Fecha: 2026-04-22
Actor: Director Académico (Admin)
Épica: Épica 8 — Auditoría y Control de Calidad

## Resumen funcional
Este módulo permitirá al Director Académico identificar casos donde el acompañamiento reportado por el tutor no coincide con la realidad percibida por el estudiante. El sistema debe automatizar la reapertura de alertas y notificar proactivamente comportamientos atípicos de los tutores.

## Componentes a Crear
- [ ] `src/features/auditoria/components/InconsistencyList/index.tsx`: Tabla/Lista de casos con discrepancia.
- [ ] `src/features/auditoria/components/TutorPerformanceCard/index.tsx`: Resumen de desempeño del tutor con alerta crítica si aplica.
- [ ] `src/features/auditoria/components/InconsistencyDetail/index.tsx`: Comparativa visual reporte vs encuesta.

## Componentes a Modificar
- [ ] `src/services/api/audit.ts`: Implementar mocks para `getInconsistencies` y `getTutorAuditHistory`.
- [ ] `src/store/notificationStore.ts`: (Si es necesario) Tipos de notificación para auditoría.
- [ ] `src/app/(admin)/auditoria/page.tsx`: Punto de entrada para el panel de control de calidad.

## Endpoints Necesarios
- `GET /api/audit/inconsistencies` → Lista de discrepancias detectadas → Estado: **Mock**
- `GET /api/audit/tutors/:id/history` → Historial de auditoría de un tutor específico → Estado: **Mock**
- `PUT /api/audit/inconsistencies/:id/resolve` → Marcar como revisado o escalar → Estado: **Mock**

## Tipos TypeScript Requeridos
- `ServiceInconsistency`: { id, alertId, tutorId, studentId, severity, detectedAt, discrepancyType }
- `TutorAuditStats`: { tutorId, totalInterventions, inconsistenciesCount, criticalStatus }

## Estados de UI a Implementar
- [ ] **Loading**: Skeleton de tabla de inconsistencias.
- [ ] **Success**: Lista con badges de severidad (Standard / Critical).
- [ ] **Empty**: "No se han detectado inconsistencias en el ciclo actual".
- [ ] **Error**: Manejo de fallo en carga de auditoría.

## Criterios de Aceptación a Cubrir
- [ ] **Escenario 1**: Visualizar inconsistencia. El admin ve detalle: "Tutor reportó reunión, estudiante reportó ausencia".
- [ ] **Escenario 2**: Alerta Crítica. Si un tutor tiene 3+ inconsistencias, su tarjeta destaca en rojo con ícono de advertencia de desempeño.
- [ ] **Escenario 3**: Notificación Push. Al detectar inconsistencia, el admin recibe notificación en el `NotificationCenter`.

## Checklist de Privacidad
- [ ] ¿El componente es accesible por el Tutor? **NO**. Solo rol `admin`.
- [ ] ¿Se muestran diagnósticos clínicos? **NO**. Solo se audita la *existencia* y *calidad* del apoyo.
- [ ] ¿Los logs de auditoría son inmutables para el tutor? **SÍ**.

## Notas de Diseño
- Usar el color `--notif-auditoria` (#F59E0B) para elementos visuales de este módulo.
- Implementar un "Comparador de Versiones" simple para mostrar el choque de testimonios.
