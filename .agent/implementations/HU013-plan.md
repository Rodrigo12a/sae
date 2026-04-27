# Implementation Plan: HU013 — Derivar caso a servicios médicos
Fecha: 2026-04-22
Actor: Tutor
Épica: Épica 5 — Derivaciones y Atención Especializada

## Resumen del Requerimiento
Permitir que el tutor derive a un estudiante a servicios médicos cuando sus síntomas físicos superen la tutoría. La principal restricción de privacidad es que el texto ingresado por el tutor debe ser una descripción observable, por lo que el sistema debe validar y advertir si detecta terminología clínica.

## Componentes a Crear
- [ ] `src/features/derivaciones/components/MedicalReferralModal/index.tsx`
- [ ] `src/features/derivaciones/hooks/useMedicalReferral.ts`

## Componentes a Modificar
- [ ] `src/features/derivaciones/types.ts`: Añadir `MedicalReferralRequest`.
- [ ] `src/services/api/referrals.ts`: Implementar endpoint mock de derivación médica.
- [ ] `src/app/tutor/estudiante/[id]/page.tsx`: Integrar el botón/menú para acceder a la derivación médica en el perfil del estudiante.
- [ ] `src/features/dashboard-tutor/components/RiskProfilePanel/index.tsx`: Incluir opción de derivación médica junto a la psicológica si hay alertas.

## Endpoints Necesarios
- `POST /api/referrals/medical` → Crear derivación a servicios médicos → Estado: Mock (simulado en el frontend temporalmente o mediante delay local).

## Tipos TypeScript Requeridos
- `MedicalReferralRequest`: studentId, alertId (opcional), descripcionObservable.

## Estados de UI a Implementar
- [ ] Loading (skeleton/spinner en el botón del modal)
- [ ] Success (Toast indicando éxito + cerrado del modal)
- [ ] Error (Si falla la petición de derivación)
- [ ] Validation Error (Advertencia inline en el textarea si se detectan palabras clínicas como "depresión", "enfermedad", "diagnóstico")

## Criterios de Aceptación a Cubrir
- [ ] Escenario 1: Tutor llena la derivación con síntomas observables y se envía con éxito (estado de alerta cambia a "Derivada - Medicina").
- [ ] Escenario 2: El tutor ingresa texto clínico, se le muestra una advertencia inline y no se le permite enviar hasta corregirlo.
- [ ] Edge case: La opción debe estar disponible en el panel del estudiante (RiskProfilePanel o page).

## Checklist de Privacidad
- [ ] ¿El componente se renderiza para el Tutor?
      Si sí: ¿el campo diagnosticoClinico está ausente? Sí, la derivación se basa en `descripcionObservable`.
- [ ] ¿Los tipos TypeScript reflejan la restricción por rol? Sí, `MedicalReferralRequest` no recibe ni permite información que clasifique como clínica validada.
- [ ] ¿El candado visual está implementado donde aplica? Sí, si aplica a información restrictiva compartida, pero para este form principal es evitar la captura clínica.
