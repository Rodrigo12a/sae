---
description: Analizar el estado actual del proyecto, qué HUs están pendientes, sus dependencias y el orden óptimo para el siguiente ciclo.
---

# Workflow: /scout-hu
> **Trigger**: `/scout-hu` o `/scout-hu [épica]`  
> **Propósito**: Analizar el estado actual del proyecto, qué HUs están pendientes, sus dependencias y el orden óptimo para el siguiente ciclo.  
> **Cuándo usarlo**: Al inicio de un nuevo sprint, o cuando no sabes por dónde continuar.

---

## Paso 1 — Leer el Estado Actual del Proyecto

```
1. Leer design.md sección "11. Módulos por Desarrollar — Roadmap Frontend"
   → Identificar qué HUs están ⬜ Pendiente vs ✅ Completado

2. Listar archivos en src/features/ y src/app/
   → Verificar qué rutas y componentes ya existen

3. Buscar mocks activos:
   grep -r "// TODO: conectar" src/services/
   → Listar los endpoints pendientes de conexión real
```

## Paso 2 — Analizar Dependencias entre HUs

```
Mapa de dependencias del SIAE:

HU001 (Auth)
  └── BLOQUEANTE para todo lo demás

HU003 (Widget alertas)
  └── Depende de: HU001 (auth), Motor de IA (puede mockear)
  └── Desbloquea: HU004, HU005, HU006

HU004 (Perfil de riesgo)
  └── Depende de: HU003 (para navegar), HU001
  └── Desbloquea: HU005, HU006, HU012, HU013

HU007 (Encuesta estudiantil)
  └── Depende de: Solo el token de enlace (puede desarrollarse independiente)
  └── Desbloquea: HU008, datos para Motor de IA

HU009 (Carga masiva médico)
  └── Depende de: HU001
  └── Desbloquea: HU010, HU011

HU010 (Semáforo de salud)
  └── Depende de: HU009 (datos médicos), HU004 (perfil del tutor)

HU012-HU013 (Derivaciones desde tutor)
  └── Depende de: HU004 (perfil)
  └── Desbloquea: HU014

HU014-HU015 (Gestión psicólogo)
  └── Depende de: HU012-HU013

HU016-HU018 (Dashboard admin)
  └── Depende de: HU001, datos agregados del backend

HU022-HU023 (Auditoría)
  └── Depende de: HU006 (cierre de alertas), HU016

Identificar qué HUs están desbloqueadas y listas para desarrollar.
```

## Paso 3 — Generar Reporte de Estado

```markdown
# Scout Report — SIAE Frontend
Fecha: [fecha]

## Estado por Épica

### Épica 1 — Autenticación
- HU001: [estado]
- HU002: [estado]

### Épica 2 — Dashboard Tutor
- HU003: [estado]
- HU004: [estado]
- HU005: [estado]
- HU006: [estado]

[... continuar para todas las épicas]

## HUs Desbloqueadas y Listas
(pueden iniciarse ahora según dependencias)
1. [HU-ID] — [título] — Razón: [por qué está desbloqueada]
2. [HU-ID] — [título]
...

## HUs Bloqueadas
1. [HU-ID] — Bloqueada por: [HU-ID dependiente]
...

## Mocks Activos Pendientes de Conexión
1. [METHOD] /api/[endpoint] — Usado en: [componente]
...

## Recomendación para Próximo Ciclo
Prioridad sugerida basada en impacto y desbloqueabilidad:
1. [HU-ID] — impacto: [alto/medio] — esfuerzo estimado: [S/M/L]
2. [HU-ID]
...
```

## Paso 4 — Sugerir Punto de Entrada

```
Usar esta lógica de priorización:

1. ¿Hay HUs críticas (Alta prioridad) sin implementar con dependencias satisfechas?
   → Sugerir esa primero

2. ¿Hay mocks que ya tienen endpoint real disponible en el backend?
   → Sugerir /api-connect para conectarlos (sin nueva HU)

3. ¿El módulo de mayor impacto de QA está incompleto?
   → Módulo de encuesta estudiantil (QA-07/08) si no está hecho
   → Widget de alertas (QA-05) si no está hecho

4. ¿Hay una HU de prioridad Media que desbloquea varias otras?
   → Considerar subirla de prioridad
```

---

## Output

- Reporte de estado completo del proyecto
- Lista de HUs desbloqueadas y listas
- Lista de mocks pendientes de conexión
- Recomendación de próxima HU a atacar con justificación
