# Implementation Plan: HU011 — Alertar área académica por impacto de salud prolongado

Fecha: 2026-04-22
Actor: Médico
Épica: Épica 4 — Módulo Médico con Privacidad Diferencial

## Resumen
Implementar la funcionalidad que permite al personal médico notificar al tutor asignado cuando un estudiante presenta una condición de salud que impactará su asistencia de manera prolongada. La notificación debe ser puramente operativa, sin exponer datos clínicos, cumpliendo con la privacidad diferencial.

## Componentes a Crear
- [ ] `src/features/medico/components/ProlongedAlertForm/index.tsx`
  - Formulario con campos: Fecha de inicio (date), Duración estimada (number/days), Comentario operativo (textarea).
  - Validaciones: Duración > 0, Fecha no sea pasada (opcional, según criterio médico).
  - Estética: Acorde al sistema de diseño médico (verde suave, acentos de salud).

## Componentes a Modificar
- [ ] `src/features/medico/components/StudentHealthDetail/index.tsx`
  - Añadir botón "Generar Alerta de Inasistencia" visible solo para médicos.
  - Manejar el estado para mostrar el formulario (modal o sección expandible).
- [ ] `src/features/medico/hooks/useStudentHealth.ts`
  - Añadir hook para la mutación `POST /medical/students/:id/prolonged-alert`.

## Endpoints Necesarios
- `POST /medical/students/:id/prolonged-alert` → Generar alerta al tutor → Estado: **Mock** (con contrato tipado).

## Tipos TypeScript Requeridos
- `ProlongedAlertRequest`: 
  ```typescript
  interface ProlongedAlertRequest {
    startDate: string;
    estimatedDurationDays: number;
    observation: string; // "Reposo médico sugerido", etc.
  }
  ```

## Estados de UI a Implementar
- [ ] Loading: Estado de envío de la alerta.
- [ ] Success: Toast de confirmación "Alerta enviada al tutor".
- [ ] Error: Manejo de fallos de red o permisos.

## Criterios de Aceptación a Cubrir
- [ ] **Escenario 1**: Médico completa el formulario y envía. El sistema confirma el envío.
- [ ] **Escenario 2 (Privacidad)**: La observación enviada no permite campos libres que sugieran diagnósticos (o se advierte al médico).
- [ ] **Edge case**: Actualización de una alerta ya enviada (backend debería consolidar).

## Checklist de Privacidad
- [ ] ¿El componente de envío es exclusivo del rol Médico? (Sí, dentro de StudentHealthDetail)
- [ ] ¿La "observación" es filtrada o validada para evitar datos clínicos? (Sí, etiqueta operativa sugerida).
- [ ] ¿El tutor recibe solo la notificación operativa? (Sí, garantizado por el endpoint).

---
## Notas de Diseño
- Usar un `Dialog` (modal) para el formulario de alerta prolongada para no recargar la vista de detalle.
- Integrar con `sonner` para los feedbacks visuales.
