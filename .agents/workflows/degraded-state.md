---
description: Implementar el estado degradado del Motor de IA en un componente que consume sus outputs.
---

# Workflow: /degraded-state
> **Trigger**: `/degraded-state [NombreComponente]`  
> **Propósito**: Implementar el estado degradado del Motor de IA en un componente que consume sus outputs.  
> **Cuándo usarlo**: En cualquier componente que muestre scores o etiquetas del Motor de IA (HU003, HU004, HU016, HU019, HU020).

---

## Contexto

El Motor de IA es una caja negra externa con Circuit Breaker. Cuando no responde, el frontend NUNCA debe mostrar un error de UI al usuario. En su lugar, muestra los datos pre-computados más recientes con un indicador de frescura.

```
Motor de IA status:
  "ok"          → datos frescos, render normal
  "degraded"    → datos pre-computados + banner de timestamp
  "unavailable" → datos pre-computados + banner de timestamp
```

---

## Paso 1 — Conectar al Estado Global del Motor de IA

```tsx
// En el componente, leer el estado del Motor de IA del store:
import { useUIStore } from '@/store/uiStore';

const aiEngineStatus = useUIStore(state => state.aiEngineStatus);
```

## Paso 2 — Implementar el Banner de Modo Degradado

```tsx
// Para el widget de alertas del Tutor (UXDT-04):
{(aiEngineStatus === 'degraded' || aiEngineStatus === 'unavailable') && (
  <div
    role="status"
    aria-live="polite"
    className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800"
  >
    <ClockIcon className="w-4 h-4" aria-hidden="true" />
    <span>
      Datos actualizados al {formatTime(lastUpdatedAt)}.
      Motor de análisis temporalmente no disponible.
    </span>
  </div>
)}
```

```tsx
// Para el dashboard ejecutivo (UXPA-02):
// Badge de frescura → cambia a color de advertencia si > 5 min
const isStale = Date.now() - new Date(dataFreshness).getTime() > 5 * 60 * 1000;

<span className={`badge ${isStale ? 'badge-warning' : 'badge-ok'}`}>
  {isStale ? '⚠️' : '✓'} Actualizado hace {minutesAgo} min
</span>
```

## Paso 3 — Diseñar el Componente con Ambos Estados

```
REGLA: Cada componente que consume el Motor de IA tiene DOS diseños válidos.
No son un estado de error — son estados de operación normal.

Estado "con scores" (ai_engine = ok):
  → Semáforo con etiqueta operativa
  → Tarjeta con información completa

Estado "sin scores" (ai_engine = degraded/unavailable):
  → Misma tarjeta, misma estructura
  → Banner de timestamp en la parte superior del widget
  → Los datos siguen siendo los pre-computados más recientes
  → El usuario puede seguir operando normalmente

⚠️ NUNCA mostrar un spinner eterno o pantalla de error cuando el Motor de IA no responde
⚠️ NUNCA bloquear la UI mientras se espera al Motor de IA
```

## Paso 4 — Configurar el Circuit Breaker en TanStack Query

```typescript
// En src/lib/queryClient.ts:
// Detectar errores del Motor de IA y actualizar el store global

import { useUIStore } from '@/store/uiStore';

function isAIEngineEndpoint(url: string): boolean {
  return url.includes('/alerts/priority') ||
         url.includes('/risk-profile') ||
         url.includes('/kpis');
}

// En el queryClient config:
onError: (error: unknown, query) => {
  if (isAIEngineEndpoint(query.queryKey[0] as string)) {
    useUIStore.getState().setAIEngineStatus('degraded');
  }
}

// Cuando el endpoint vuelve a responder:
onSuccess: (_, query) => {
  if (isAIEngineEndpoint(query.queryKey[0] as string)) {
    useUIStore.getState().setAIEngineStatus('ok');
  }
}
```

## Paso 5 — Verificar el Ícono "Ojo/Revisar"

```
El estado "Ojo/Revisar" (color #8E44AD) es DIFERENTE al estado degradado:

"Ojo/Revisar" → datos del estudiante son inconsistentes (HU019)
               → reemplaza al semáforo estándar
               → NO coexiste con el semáforo

"Degradado"   → el Motor de IA no respondió
               → banner en el widget
               → los datos siguen siendo los últimos conocidos
               → NO cambia el semáforo de los estudiantes individuales

Verificar en el componente que estos dos estados son mutuamente excluyentes:
  → if (dataIsUnreliable) → <SemaforoOjo />  (no semáforo estándar)
  → if (aiDegraded) → banner de timestamp  (semáforo de estudiantes sin cambio)
```

---

## Output

- Banner de modo degradado implementado con timestamp
- Circuit Breaker conectado al store global
- Ambos estados del componente (con/sin scores) diseñados
- Estado "Ojo/Revisar" diferenciado del estado degradado
