# Implementation Plan: HU009 — Carga masiva de datos de campaña de salud
Fecha: 2026-04-22
Actor: Médico
Épica: Épica 4 — Módulo Médico con Privacidad Diferencial

## Componentes a Crear
- [ ] `src/features/medico/components/BulkJornadaView/index.tsx`: Orquestador principal de la vista de captura masiva.
- [ ] `src/features/medico/components/StudentChecklistRow/index.tsx`: Fila individual para captura de datos por estudiante.
- [ ] `src/features/medico/components/ConditionSelector/index.tsx`: Selector de condiciones clínicas (multiselect).
- [ ] `src/features/medico/components/ExistingRecordModal/index.tsx`: Modal de advertencia para expedientes existentes.
- [ ] `src/features/medico/hooks/useMedicalBulkAction.ts`: Lógica para gestionar el estado de la carga masiva y validaciones.

## Componentes a Modificar
- [ ] `src/app/(medico)/layout.tsx`: Layout con guardia RBAC para el rol Médico.
- [ ] `src/app/(medico)/jornada/page.tsx`: Página de entrada al módulo.

## Endpoints Necesarios
- `GET /api/medical/students?group=:id` → Lista de estudiantes por grupo para checklist → Estado: Mock
- `GET /api/medical/conditions` → Catálogo de condiciones clínicas → Estado: Mock
- `POST /api/medical/bulk-register` → Registro masivo de condiciones de salud → Estado: Mock

## Tipos TypeScript Requeridos
- `MedicalCondition`: id, nombre, categoria, etiquetaOperativaSugerida, semaforoEstadoSugerido.
- `BulkHealthEntry`: studentId, studentName, matricula, condicionesIds, fechaInicio, duracion.
- `HealthRegisterPayload`: groupId, entries[].

## Estados de UI a Implementar
- [ ] Loading (skeleton de tabla)
- [ ] Success (toast de confirmación masiva)
- [ ] Empty state (selección de grupo requerida)
- [ ] Error (validación de campos, error de red)

## Criterios de Aceptación a Cubrir
- [ ] Escenario 1: Captura exitosa (Happy Path). El médico selecciona grupo, marca condiciones y guarda.
- [ ] Escenario 2: Estudiante duplicado. Se muestra modal de confirmación antes de sobreescribir datos previos.
- [ ] Escenario 3: Condición sin traducción. Notificación inline si una condición no tiene etiqueta operativa asignada.

## Checklist de Privacidad
- [ ] ¿El componente se renderiza para el Tutor? 
      **No**, esta vista es exclusiva para el rol Médico.
- [ ] ¿Los tipos TypeScript reflejan la restricción por rol?
      Sí, el tipo `HealthProfileMedico` incluye `diagnosticoClinico`, el cual no existe en el perfil del Tutor.
- [ ] ¿Se asegura que el médico asigne etiquetas operativas correctas?
      Sí, la interfaz sugerirá la etiqueta operativa basada en la condición clínica.
