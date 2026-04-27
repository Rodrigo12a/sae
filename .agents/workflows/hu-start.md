---
description: Iniciar el ciclo de desarrollo de una Historia de Usuario con contexto completo antes de escribir una sola línea de código.
---

# Workflow: /hu-start
> **Trigger**: `/hu-start [HU-ID]` · Ej: `/hu-start HU003`  
> **Propósito**: Iniciar el ciclo de desarrollo de una Historia de Usuario con contexto completo antes de escribir una sola línea de código.  
> **Cuándo usarlo**: Al comienzo de cada sprint o ciclo de Vibe Engineering para una HU específica.

---

## Input Requerido

- `[HU-ID]`: ID de la historia de usuario (ej. `HU003`, `HU007`, `HU016`)

---

## Pasos del Workflow

### Paso 1 — Cargar Contexto Base (OBLIGATORIO)

```
1. Leer spec-fidelity.md → internalizar reglas de privacidad y QA
2. Buscar [HU-ID] en spec.md → extraer:
   - Actor que la usa
   - Historia completa (Como... quiero... para...)
   - Criterios de aceptación Gherkin (happy path + edge cases)
   - Requerimientos UX/UI vinculados (UXXX-XX)
   - Métricas de QA aplicables
3. Leer la sección correspondiente en design.md → identificar:
   - Componentes existentes reutilizables
   - Endpoint(s) del backend necesarios
   - Contratos TypeScript ya definidos
```

### Paso 2 — Análisis de Dependencias

```
Responder estas preguntas antes de planificar:

¿Esta HU depende de otra HU no implementada aún?
  → Si sí: identificar el bloqueo y notificarlo

¿Qué componentes de components/ui/ pueden reutilizarse?
  → Listar con sus paths exactos

¿Hay restricciones de privacidad diferencial?
  → Identificar qué roles consumen los componentes
  → Verificar qué campos del backend son accesibles por rol

¿El endpoint del backend existe?
  → Sí: documentar el contrato real
  → No: crear mock con TypeScript interface + TODO comment
```

### Paso 3 — Generar Implementation Plan

Crear el archivo `.agent/implementations/[HU-ID]-plan.md` con esta estructura:

```markdown
# Implementation Plan: [HU-ID] — [Título de la HU]
Fecha: [fecha]
Actor: [rol]
Épica: [nombre épica]

## Componentes a Crear
- [ ] src/features/[epica]/components/[NombreComponente]/index.tsx
- [ ] src/features/[epica]/hooks/use[NombreHook].ts

## Componentes a Modificar
- [ ] src/features/[epica]/... (describir cambio)

## Endpoints Necesarios
- [METHOD] /api/[endpoint] → [descripción] → Estado: [disponible/mock]

## Tipos TypeScript Requeridos
- [NombreTipo]: descripción

## Estados de UI a Implementar
- [ ] Loading (skeleton)
- [ ] Success
- [ ] Empty state
- [ ] Error
- [ ] Degraded (Motor de IA no disponible) — si aplica

## Criterios de Aceptación a Cubrir
- [ ] Escenario 1: [happy path]
- [ ] Escenario 2: [variante]
- [ ] Edge case: [caso borde]

## Checklist de Privacidad
- [ ] ¿El componente se renderiza para el Tutor?
      Si sí: ¿el campo diagnosticoClinico está ausente?
- [ ] ¿Los tipos TypeScript reflejan la restricción por rol?
- [ ] ¿El candado visual está implementado donde aplica?
```

### Paso 4 — Solicitar Aprobación del Plan

```
Presentar el plan al desarrollador con:
- Resumen de cambios propuestos
- Riesgos identificados (privacidad, performance, dependencias)
- Preguntas sobre "vibes" o preferencias de diseño

⛔ NO ESCRIBIR CÓDIGO hasta recibir aprobación o instrucción de proceder.
```

---

## Output

- Archivo `.agent/implementations/[HU-ID]-plan.md` creado
- Plan presentado al desarrollador para revisión
- Lista clara de archivos que se crearán/modificarán
- Identificación de mocks necesarios para endpoints pendientes

---

## Notas

- Si `/hu-start` se ejecuta para una HU ya implementada, ejecutar `/scout-hu` primero para detectar el estado actual.
- Este workflow es la única puerta de entrada al desarrollo. No se puede saltar.
