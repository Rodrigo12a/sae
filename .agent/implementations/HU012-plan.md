# Implementation Plan: HU012 — Derivar caso a psicología
Fecha: 2026-04-22
Actor: Tutor
Épica: Épica 5 — Derivaciones y Atención Especializada

## Resumen del Requerimiento
Permitir que el tutor derive a un estudiante al departamento de psicología cuando existe una alerta activa. El proceso debe incluir la validación de capacidad del departamento y asegurar que no se incluyan términos clínicos en la descripción observable.

## Componentes a Crear
- [ ] `src/features/derivaciones/components/PsychologyReferralModal/index.tsx`: Formulario modal para la derivación.
- [ ] `src/features/derivaciones/hooks/usePsychologyReferral.ts`: Hook para gestionar la capacidad del departamento y el envío de la derivación.
- [ ] `src/features/derivaciones/types.ts`: Definición de tipos y contratos para derivaciones.

## Componentes a Modificar
- [ ] `src/services/api/referrals.ts`: Nuevo servicio para endpoints de derivaciones.
- [ ] `src/app/tutor/estudiante/[id]/page.tsx`: Integración del botón y modal de derivación.
- [ ] `src/features/dashboard-tutor/components/RiskProfilePanel/index.tsx`: Exponer callback para derivación.

## Endpoints Necesarios
- `GET /api/referrals/capacity/psychology` → Obtener saturación del departamento → Estado: Mock (Simulado)
- `POST /api/referrals/psychology` → Crear derivación → Estado: Mock (Simulado)

## Tipos TypeScript Requeridos
- `PsychologyReferralRequest`: studentId, alertId, motivoId, descripcionObservable.
- `DepartmentCapacity`: isSaturated, currentLoad, maxCapacity.

## Estados de UI a Implementar
- [ ] **Loading**: Mientras se verifica la capacidad del departamento.
- [ ] **Warning**: Si el departamento está saturado (UX: advertencia + escalado).
- [ ] **Success**: Toast de confirmación y cierre de modal.
- [ ] **Error**: Manejo de fallos en el envío.

## Criterios de Aceptación (Gherkin)
- [ ] **Escenario 1 (Happy Path)**: Tutor selecciona motivo, escribe observación y envía exitosamente.
- [ ] **Escenario 2 (Saturación)**: Si el API retorna `isSaturated: true`, mostrar banner de advertencia informando que el tiempo de espera será mayor.
- [ ] **Edge Case (Sin Alerta)**: El botón debe estar deshabilitado si no hay una alerta activa para el estudiante.

## Checklist de Privacidad
- [ ] **Validación de Texto**: ¿La descripción observable evita términos clínicos? (Validación simple por regex o lista de palabras prohibidas en frontend).
- [ ] **Privacidad Diferencial**: El tutor NO debe poder ver derivaciones previas con notas clínicas (HU015).
