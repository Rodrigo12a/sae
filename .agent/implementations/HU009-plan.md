# Implementation Plan: HU009 — Carga masiva de datos de campaña de salud
Fecha: 22 Abril 2026
Actor: Médico
Épica: Épica 4 (Módulo Médico con Privacidad Diferencial)

## Resumen y Contexto
Esta historia de usuario permite a los médicos capturar masivamente los resultados de las jornadas de salud para un grupo específico de estudiantes. En lugar de hacerlo uno por uno, el médico dispondrá de un _checklist_ rápido. Se deben manejar colisiones si un estudiante ya tiene un expediente existente (requiere confirmación) y manejar casos donde una condición médica documentada no tenga una etiqueta de traducción asignada para el tutor.

## Componentes a Crear / Implementar
- [ ] `src/features/medico/components/BulkJornadaView/index.tsx` (Contenedor principal con filtros de grupo y tabla)
- [ ] `src/features/medico/components/StudentChecklistRow/index.tsx` (Fila interactiva por estudiante para asignar condiciones)
- [ ] `src/features/medico/components/ConditionSelector/index.tsx` (Selector múltiple de diagnósticos clínicos)
- [ ] `src/features/medico/components/ExistingRecordModal/index.tsx` (Modal de confirmación si hay duplicados de expediente)
- [ ] `src/features/medico/hooks/useGroupStudents.ts` (Fetch de lista de estudiantes por grupo)
- [ ] `src/features/medico/hooks/useMedicalConditions.ts` (Fetch de catálogo de diagnósticos)
- [ ] `src/features/medico/hooks/useBulkMedicalRegister.ts` (Mutación para guardar masivamente)

## Componentes a Modificar
- Ninguno. La estructura base ya existe pero los componentes son _placeholders_ y deben ser implementados completamente.

## Endpoints Necesarios
- [GET] `/api/medical/conditions` → Obtener catálogo de condiciones y traducciones → Estado: **Mock**
- [GET] `/api/medical/students?group=:id` → Obtener nómina de un grupo → Estado: **Mock**
- [POST] `/api/medical/bulk-register` → Guardar array de expedientes → Estado: **Mock**

## Tipos TypeScript Requeridos
- `MedicalCondition`: id, nombre, requiereTraduccion, etiquetaOperativa.
- `BulkHealthRegisterRequest`: payload con `groupId` y arreglo de `entries` (studentId, condiciones).
- `StudentChecklistItem`: representación de la fila en UI, con estado de `hasExistingRecord`.

## Estados de UI a Implementar
- [ ] **Loading** (Skeleton para la carga de catálogo y nómina de estudiantes)
- [ ] **Success** (Notificación inline/toast al procesar masivamente sin errores)
- [ ] **Empty state** (Mensaje amigable si el grupo seleccionado no tiene estudiantes)
- [ ] **Error** (Fallback state o toast de retry)

## Criterios de Aceptación a Cubrir
- [ ] Escenario 1: Captura exitosa fluida para grupo completo.
- [ ] Escenario 2: Notificar si una condición no tiene traducción y permitir guardado continuo (alerta pasiva al admin).
- [ ] Edge case: Mostrar advertencia y pedir confirmación si un estudiante ya tiene expediente previo antes de sobreescribir.

## Checklist de Privacidad Diferencial
- [ ] ¿El componente se renderiza para el Tutor? → **NO** (La ruta está protegida estrictamente para `medico`).
- [ ] ¿Los tipos TypeScript reflejan la restricción por rol? → **SÍ**. Los datos clínicos completos solo circulan en este módulo médico.
- [ ] ¿El candado visual está implementado donde aplica? → **SÍ**, en la cabecera de la vista para enfatizar que son datos sensibles (aunque todo el entorno sea médico).
