---
description: Ejecutar la implementación completa de una HU siguiendo el plan aprobado en `/hu-start`.  
---

# Workflow: /hu-implement
> **Trigger**: `/hu-implement [HU-ID]`  
> **Propósito**: Ejecutar la implementación completa de una HU siguiendo el plan aprobado en `/hu-start`.  
> **Prerrequisito**: El archivo `.agent/implementations/[HU-ID]-plan.md` debe existir y estar aprobado.

---

## Input Requerido

- `[HU-ID]`: ID de la historia ya planificada

---

## Pasos del Workflow

### Paso 1 — Verificar Prerrequisitos

```
1. Confirmar que existe .agent/implementations/[HU-ID]-plan.md
   → Si no existe: ejecutar /hu-start [HU-ID] primero

2. Leer el plan completo

3. Verificar el stack disponible en design.md sección 1
   → Confirmar que las dependencias están instaladas
   → Si no: run_command → npm install [dependencia]
```

### Paso 2 — Construir Capa de Datos (API + Types)

```
Orden obligatorio: tipos primero, implementación después.

2a. Crear/actualizar tipos en src/types/
    Por cada entidad nueva:
    - Crear interface con campo "role guard" si aplica
    - Si el rol es "tutor": el tipo NO puede contener diagnosticoClinico
    - Documentar con JSDoc + @privacy si hay restricción de rol

2b. Crear/actualizar service en src/services/api/[modulo].ts
    - Si el endpoint existe: implementar llamada real con Axios/fetch
    - Si no existe: mock con TODO comment y datos de prueba realistas
    - Siempre exportar el contrato TypeScript aunque sea mock

2c. Crear custom hook en src/features/[epica]/hooks/
    Cabecera obligatoria:
    /**
     * @module use[NombreHook]
     * @epic EPICA-[N] [Nombre]
     * @hu [HU-ID]
     * @ux [UXXX-XX, UXXX-XX]
     * @qa [QA-XX] descripción
     * @api [METHOD] /api/[endpoint]
     * @privacy [descripción si aplica]
     */
```

### Paso 3 — Construir Componentes UI

```
Orden por complejidad: de atómico a compuesto.

3a. Verificar si el componente existe en components/ui/
    → Si existe: reutilizar, NO duplicar

3b. Crear componente con cabecera de trazabilidad:
    /**
     * @module [NombreComponente]
     * @epic EPICA-[N]
     * @hu [HU-ID]
     * @ux [UXXX-XX]
     * @api [endpoint]
     * @privacy [restricción si aplica]
     */

3c. Implementar los 5 estados de UI para cada componente con datos remotos:
    - Loading    → <SkeletonCard /> (nunca spinner bloqueante)
    - Success    → render normal
    - Empty      → mensaje contextual + ícono (NUNCA pantalla en blanco)
    - Error      → toast + botón reintentar
    - Degraded   → banner con timestamp (si consume Motor de IA)

3d. Para módulos del Tutor con datos de salud:
    ⚠️ VERIFICAR: ¿el campo diagnosticoClinico está ausente del JSX y del tipo?
    ⚠️ VERIFICAR: ¿el candado visual está presente donde corresponde?

3e. Para módulo de encuesta estudiantil:
    - Una pregunta por pantalla en móvil
    - Implementar offline handler con IndexedDB
    - Banner no intrusivo para estado sin conexión
```

### Paso 4 — Construir Página / Ruta

```
4a. Crear/actualizar la página en src/app/(rol)/[ruta]/page.tsx
    - Aplicar RoleLayout con RBAC correspondiente
    - Server Component donde sea posible (menos JS al cliente)
    - Client Component solo donde hay interactividad

4b. Verificar middleware de protección de ruta
    - El rol correcto debe estar en ROLE_ROUTES de middleware.ts
```

### Paso 5 — Accesibilidad y Mobile

```
Checklist por componente:
- [ ] Todos los íconos funcionales tienen aria-label
- [ ] Íconos decorativos tienen aria-hidden="true"
- [ ] Elementos interactivos ≥ 44×44 px en móvil (recomendado 48×48 px)
- [ ] Focus ring visible en todos los elementos enfocables
- [ ] Semáforo: ícono + texto semántico junto al color (nunca solo color)
- [ ] Mensajes de error vinculados con aria-describedby
- [ ] Formularios con errores anunciados al lector de pantalla
- [ ] Contraste: verificar con herramienta (mínimo 4.5:1 texto normal)
```

### Paso 6 — Verificación de Criterios Gherkin

```
Por cada escenario definido en spec.md para la HU:

Escenario happy path:
  → ¿El componente renderiza el estado esperado?
  → ¿La acción del usuario produce el cambio de estado correcto?

Escenario de validación:
  → ¿El formulario bloquea correctamente con texto insuficiente?
  → ¿El contador de caracteres es visible en tiempo real?

Edge cases:
  → ¿El estado "Ojo/Revisar" reemplaza (no coexiste con) el semáforo?
  → ¿El estado vacío tiene mensaje contextual?
  → ¿El estado degradado del Motor de IA está implementado?
```

### Paso 7 — Snapshot Visual (si hay Browser Sub-Agent disponible)

```
Si Antigravity tiene Browser Sub-Agent activo:
  → Capturar screenshot del componente en estado: success, empty, loading
  → Capturar en viewport mobile (375px) y desktop (1280px)
  → Guardar como artifact en .agent/screenshots/[HU-ID]/
```

---

## Output

- Componentes creados/modificados con trazabilidad documentada
- Hook de datos con contrato TypeScript
- Service layer actualizado (real o mock)
- Página/ruta protegida por RBAC
- Todos los estados de UI implementados
- Checklist de accesibilidad completado

---

## Anti-patrones que este workflow previene

| ❌ Sin workflow | ✅ Con workflow |
|---|---|
| Componente llama a API directamente | Hook → Service → API |
| Estado vacío = pantalla en blanco | Siempre mensaje + ícono |
| Diagnóstico en DOM del Tutor | Tipos TypeScript lo previenen |
| Score numérico visible | Solo etiqueta operativa |
| Sin aria-labels | Checklist obligatorio en Paso 5 |
