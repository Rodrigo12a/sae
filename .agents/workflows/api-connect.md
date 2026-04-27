---
description: Conectar un componente que tiene un mock a su endpoint real del backend.
---

# Workflow: /api-connect
> **Trigger**: `/api-connect [endpoint] [componente]`  
> **Propósito**: Conectar un componente que tiene un mock a su endpoint real del backend.  
> **Ejemplo**: `/api-connect GET /api/alerts/priority AlertCard`  
> **Cuándo usarlo**: Cuando el backend publica un nuevo endpoint que reemplaza un mock existente.

---

## Paso 1 — Verificar el Contrato del Endpoint

```
1. Consultar la documentación del backend:
   https://sae-backend-theta.vercel.app/api/docs

2. Comparar el contrato real con el mock existente:
   → ¿La respuesta tiene los mismos campos que la interface TypeScript?
   → ¿Hay campos nuevos? ¿Faltan campos esperados?
   → ¿La respuesta incluye datos que NO deberían llegar al rol actual?

3. Si hay campos sensibles en la respuesta que no deberían llegar al frontend:
   → Documentar como TENSIÓN ARQUITECTÓNICA
   → Notificar al equipo de backend antes de consumir el endpoint
   → No implementar el consumo hasta que el backend filtre por rol
```

## Paso 2 — Actualizar el Tipo TypeScript

```
En src/types/ o src/features/[epica]/types.ts:

Antes (mock):
interface AlertPriority {
  id: string;
  // ... campos del mock
}

Después (real):
interface AlertPriority {
  id: string;
  // ... ajustar campos al contrato real del backend
  // Si hay campos nuevos: agregarlos con tipo correcto
  // Si faltan campos esperados: marcar como optional (?)
  //   y documentar: // Pendiente: campo esperado del backend
}

REGLA DE PRIVACIDAD:
→ Si el endpoint devuelve diagnosticoClinico para el rol Tutor:
   DETENER — no consumir, documentar la tensión, escalar al equipo de backend
```

## Paso 3 — Actualizar el Service

```
En src/services/api/[modulo].ts:

Antes:
// TODO: conectar a GET /api/alerts/priority cuando esté disponible
export async function getPriorityAlerts(): Promise<PriorityAlert[]> {
  return MOCK_ALERTS; // mock data
}

Después:
export async function getPriorityAlerts(): Promise<PriorityAlert[]> {
  const response = await apiClient.get<PriorityAlert[]>('/alerts/priority');
  return response.data;
}

Mantener el mock como fallback comentado por 1 sprint:
// MOCK (desactivado - endpoint real activo desde [fecha])
// return MOCK_ALERTS;
```

## Paso 4 — Actualizar el Hook

```
En src/features/[epica]/hooks/use[Hook].ts:

Verificar que TanStack Query está configurado correctamente:
  → staleTime apropiado para la frecuencia de actualización del dato
  → Retry config según criticidad del endpoint
  → onError manejado: Circuit Breaker si es del Motor de IA

Actualizar @api en la cabecera JSDoc:
  → Cambiar: @api GET /api/alerts/priority (MOCK)
  → A:       @api GET /api/alerts/priority ✅ conectado [fecha]
```

## Paso 5 — Verificar el Comportamiento

```
Probar los 4 escenarios en el componente:

1. Respuesta exitosa:
   → ¿Los datos se renderizan correctamente?
   → ¿Los campos nuevos del backend están manejados?

2. Respuesta vacía ([]):
   → ¿El estado vacío se muestra correctamente?

3. Error de red (simular con DevTools → offline):
   → ¿El toast de error aparece?
   → ¿El botón reintentar funciona?

4. Latencia alta (simular con DevTools → Slow 3G):
   → ¿El skeleton aparece?
   → ¿No hay layout shift?
```

## Paso 6 — Actualizar design.md

```
En la sección del módulo correspondiente:

Cambiar:
| GET | /api/alerts/priority | HU003 | ... |
// TODO: conectar a GET /api/alerts/priority cuando esté disponible

A:
| GET | /api/alerts/priority | HU003 | ... | ✅ [fecha] |
```

---

## Output

- Service actualizado con llamada real (mock archivado como comentario)
- Tipo TypeScript ajustado al contrato real
- Hook actualizado con @api correcto
- design.md actualizado
- Comportamiento verificado en 4 escenarios
