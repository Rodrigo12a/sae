# Implementation Plan: HU008 — Recibir confirmación y recursos al finalizar encuesta
Fecha: 2026-04-22
Actor: Estudiante
Épica: Épica 3 — Encuesta de Contexto (Estudiante)

## Componentes a Crear
- [ ] `src/features/encuesta/components/ResourceList/index.tsx`: Lista animada de recursos institucionales.
- [ ] `src/features/encuesta/components/ResourceCard/index.tsx`: Tarjeta individual para cada recurso con ícono y descripción.

## Componentes a Modificar
- [ ] `src/features/encuesta/types.ts`: Agregar interfaces `InstitutionalResource` y `ResourceResponse`.
- [ ] `src/services/api/surveys.ts`: Implementar `getResources(surveyId)`.
- [ ] `src/app/encuesta/success/page.tsx`: Transformar en componente dinámico que consume los recursos.

## Endpoints Necesarios
- `GET /api/surveys/:id/resources` → Obtener recursos contextuales → Estado: **Mock**

## Tipos TypeScript Requeridos
- `InstitutionalResource`: `{ id: string; title: string; description: string; icon: string; link?: string; }`

## Estados de UI a Implementar
- [ ] Loading (Skeleton para la lista de recursos)
- [ ] Success (Pantalla final con recursos)
- [ ] Empty state (Mensaje genérico si no hay recursos específicos)
- [ ] Error (Fallback a recursos básicos institucionales)

## Criterios de Aceptación a Cubrir
- [ ] Escenario 1 (Pantalla de éxito): Mostrar nombre personalizado del estudiante (vía query params).
- [ ] Escenario 2 (Recursos dinámicos): Cargar y mostrar al menos un recurso relevante.
- [ ] UX: Mensaje "Tus respuestas fueron recibidas" cumpliendo la restricción de tono.

## Checklist de Privacidad
- [ ] N/A para este componente (público para estudiantes).
