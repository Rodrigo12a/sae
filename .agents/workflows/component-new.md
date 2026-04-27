---
description: Crear un componente nuevo con trazabilidad completa, estructura correcta y todos los estados de UI. 
---

# Workflow: /component-new
> **Trigger**: `/component-new [NombreComponente] [HU-ID]`  
> **Propósito**: Crear un componente nuevo con trazabilidad completa, estructura correcta y todos los estados de UI.  
> **Ejemplo**: `/component-new AlertCard HU003`

---

## Paso 1 — Clasificar el Componente

```
¿Es un componente presentacional puro (sin lógica de datos)?
  → Pertenece a: src/components/ui/[NombreComponente]/

¿Tiene lógica de negocio o consume datos de la API?
  → Pertenece a: src/features/[epica]/components/[NombreComponente]/

¿Es una sección de una página?
  → Pertenece a: src/features/[epica]/components/[NombreComponente]/

REGLA CRÍTICA: Los componentes en components/ui/ NUNCA importan de services/api/
```

## Paso 2 — Verificar si Ya Existe

```
Buscar en components/ui/ y features/[epica]/components/:
  → Si existe con nombre similar: evaluar si reutilizar o extender
  → Si es fundamentalmente diferente: crear nuevo

Componentes que SIEMPRE deben reutilizarse (nunca duplicar):
  → <Semaforo /> → src/components/ui/Semaforo/
  → <LockIcon /> → src/components/ui/LockIcon/
  → <SkeletonCard /> → src/components/ui/SkeletonCard/
  → <ProgressBar /> → src/components/ui/ProgressBar/
  → <Toast /> → src/components/ui/Toast/
```

## Paso 3 — Generar el Componente

Estructura de archivos a crear:

```
src/[ruta]/[NombreComponente]/
├── index.tsx          ← Componente principal
├── [NombreComponente].types.ts   ← Props e interfaces
└── [NombreComponente].test.tsx   ← Tests básicos (opcional en MVP)
```

Template base del componente:

```tsx
/**
 * @module [NombreComponente]
 * @epic EPICA-[N] [Nombre Épica]
 * @hu [HU-ID]
 * @ux [UXXX-XX, UXXX-XX]
 * @qa [QA-XX si aplica]
 * @api [METHOD /api/endpoint — o "N/A (presentacional)"]
 * @privacy [descripción de restricción de rol — o "N/A"]
 */

'use client'; // Solo si tiene interactividad del cliente

import { /* dependencias */ } from '...';

interface [NombreComponente]Props {
  // Props tipadas
}

export function [NombreComponente]({ ... }: [NombreComponente]Props) {

  // Estados de UI (implementar TODOS los que apliquen):
  // loading → <SkeletonCard />
  // error   → <ErrorState onRetry={...} />
  // empty   → <EmptyState message="..." icon={...} />
  // success → render principal

  return (
    // JSX
  );
}
```

## Paso 4 — Implementar Estados de UI

```
Para componentes que cargan datos remotos, implementar los 5 estados:

if (isLoading) return <SkeletonCard rows={3} />;

if (isError) return (
  <div role="alert">
    <p>No pudimos cargar la información.</p>
    <button onClick={refetch}>Reintentar</button>
  </div>
);

if (!data || data.length === 0) return (
  <EmptyState
    icon="check-circle"
    message="Todos tus tutorados están en seguimiento normal"
  />
);

// Estado degradado del Motor de IA (cuando aplique):
if (aiEngineStatus === 'degraded') {
  // Mostrar timestamp de última actualización
  // Continuar mostrando datos pre-computados
}

return ( /* render principal */ );
```

## Paso 5 — Aplicar Accesibilidad

```
Checklist por componente:
□ role="" en elementos semánticos (alert, status, navigation, etc.)
□ aria-label en botones con solo ícono
□ aria-describedby en campos con error
□ aria-live="polite" para actualizaciones dinámicas
□ aria-hidden="true" en íconos decorativos
□ Tamaño mínimo de toque: className="min-h-[44px] min-w-[44px]"
□ Focus ring: className="focus-visible:ring-2 focus-visible:ring-primary"
```

## Paso 6 — Aplicar Tokens del Sistema de Diseño

```
Usar SIEMPRE variables CSS del sistema de diseño:
  → color-primary: var(--color-primary) o text-[#1F4E79]
  → Semáforo: usar el componente <Semaforo /> existente, no recrearlo
  → Fondos: bg-white, bg-panel (#F4F6F8), bg-section (#EBF3FA)
  → Tipografía: text-base (16px), text-sm (14px), text-xs (12px)

Módulo médico: aplicar tonos verdes diferenciados (var(--medico-bg))
Módulo psicología notas privadas: fondo diferenciado (var(--psico-private-bg))
```

---

## Output

- Componente creado en la ruta correcta
- Todos los estados de UI implementados
- Cabecera de trazabilidad completa
- Accesibilidad básica aplicada
- Tokens del sistema de diseño usados
