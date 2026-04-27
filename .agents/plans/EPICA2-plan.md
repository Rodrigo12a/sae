# Implementation Plan: ÉPICA 2 — Dashboard y Gestión de Alertas (Tutor)
Fecha: 2026-04-22
Actor: Tutor Académico
Épica: Épica 2 — Dashboard y Gestión de Alertas (Tutor)
HUs cubiertas: HU003, HU004, HU005, HU006, **HU007 (nueva)**

---

## Resumen Ejecutivo

Esta épica construye el núcleo de trabajo diario del Tutor. Son 5 HUs de prioridad **Alta** que conforman dos flujos principales:

**Flujo principal de seguimiento:**
```
[Dashboard] → (clic en alerta) → [Perfil de riesgo] → (registrar) → [Bitácora] → (cerrar) → [Cierre con evidencia]
```

**Flujo de gestión de cuentas de tutorados (nuevo):**
```
[Dashboard] → (sección Tutorados) → [Lista de tutorados] → (registrar / editar) → [Form matrícula + contraseña]
```

Todas las pantallas se renderizan bajo el rol `tutor` y aplican privacidad diferencial máxima.

---

## Estado Actual del Proyecto

### ✅ Ya existe (reutilizable)
| Componente / Módulo | Path | Relevancia para Épica 2 |
|---|---|---|
| `LockIcon` | `src/components/ui/LockIcon/index.tsx` | Campo de salud con candado en HU004 |
| `RoleGuard` | `src/components/ui/RoleGuard/index.tsx` | Guards RBAC en páginas del Tutor |
| `useRBAC` | `src/hooks/useRBAC.ts` | Verificar permisos del Tutor |
| `privacyGuard.ts` | `src/lib/privacyGuard.ts` | `filterHealthByRole()` para HU004 |
| `rbac.config.ts` | `src/lib/rbac.config.ts` | Matriz de permisos |
| `api.ts` | `src/lib/api.ts` | Cliente HTTP base |
| `Navbar` | `src/components/layout/Navbar/` | Layout del Tutor |
| `Sidebar` | `src/components/layout/Sidebar/` | Navegación lateral del Tutor |

### ❌ No existe aún (a crear en esta épica)
- Feature `src/features/dashboard-tutor/` (completa)
- Feature `src/features/gestion-tutorados/` (nueva — HU007)
- Componentes UI: `Semaforo`, `SkeletonCard`, `RiskBadge`
- Rutas App Router: `(tutor)/dashboard/`, `(tutor)/estudiante/[id]/`, `(tutor)/tutorados/`
- Servicios: `src/services/api/alerts.ts`, `src/services/api/students.ts`, `src/services/api/tutorados.ts` (nuevo)
- Tipos globales: `src/types/alert.ts`, `src/types/student.ts`, `src/types/tutorado.ts` (nuevo)

---

## Análisis de Dependencias

### ¿Esta épica depende de otra HU no implementada?
- **HU001 (Login)**: ✅ Implementada — NextAuth + JWT funcional
- **HU002 (RBAC)**: ✅ Implementada — `middleware.ts`, `rbac.config.ts`, `RoleGuard`
- **No hay bloqueos**. La Épica 2 puede iniciarse inmediatamente.

### ¿Hay restricciones de privacidad diferencial?
- **MÁXIMA** — Actor principal es el Tutor.
- El campo `diagnosticoClinico` debe estar ausente del DOM en todos los componentes de esta épica.
- La dimensión `salud` en HU004 solo muestra `etiquetaOperativa` + semáforo.
- El backend filtra por JWT; el frontend aplica segunda capa con `filterHealthByRole()`.
- En HU007: las contraseñas deben manejarse con `type="password"`, nunca almacenarse en estado global, y nunca logearse en consola.

### ¿Qué endpoints del backend existen?
URL base de la API: `https://sae-backend-beige.vercel.app`  
Documentación: `https://sae-backend-beige.vercel.app/api/docs`

| Método | Endpoint | HU | Estado |
|---|---|---|---|
| `GET` | `/alerts/priority` | HU003 | 🔲 Verificar en Swagger |
| `GET` | `/students/:id/risk-profile` | HU004 | 🔲 Verificar en Swagger |
| `GET` | `/students/:id/academic-history` | HU004 | 🔲 Verificar en Swagger |
| `POST` | `/alerts/:id/followup` | HU005 | 🔲 Verificar en Swagger |
| `PUT` | `/alerts/:id/close` | HU006 | 🔲 Verificar en Swagger |
| `GET` | `/tutor/tutorados` | HU007 | 🔲 Verificar en Swagger |
| `POST` | `/tutor/tutorados` | HU007 | ✅ Confirmado — body: `{ matricula, password }` |
| `PUT` | `/tutor/tutorados/:matricula` | HU007 | ✅ Confirmado — body: `{ matricula, password }` |
| `DELETE` | `/tutor/tutorados/:matricula` | HU007 | 🔲 Verificar en Swagger |

> **Estrategia**: Iniciar con mocks tipados + `// TODO: conectar`. Conectar a endpoints reales una vez validados en Swagger.

---

## Componentes a Crear (28 archivos en 6 fases)

### Fase 1 — Fundamentos (sin UI visible aún)
- [ ] `src/types/alert.ts`
- [ ] `src/types/student.ts`
- [ ] `src/types/tutorado.ts` ← **nuevo**
- [ ] `src/services/api/alerts.ts` (mock tipado)
- [ ] `src/services/api/students.ts` (mock tipado)
- [ ] `src/services/api/tutorados.ts` (mock tipado) ← **nuevo**

### Fase 2 — Componentes UI transversales
- [ ] `src/components/ui/Semaforo/index.tsx` ← **PRIORIDAD MÁXIMA** (transversal a toda la plataforma)
- [ ] `src/components/ui/SkeletonCard/index.tsx`
- [ ] `src/components/ui/RiskBadge/index.tsx`

### Fase 3 — HU003: Dashboard con widget de alertas
- [ ] `src/features/dashboard-tutor/hooks/usePriorityAlerts.ts`
- [ ] `src/features/dashboard-tutor/components/AlertCard/index.tsx`
- [ ] `src/features/dashboard-tutor/components/PriorityAlertWidget/index.tsx`
- [ ] `src/app/(tutor)/layout.tsx`
- [ ] `src/app/(tutor)/dashboard/page.tsx`

### Fase 4 — HU004: Perfil de riesgo
- [ ] `src/features/dashboard-tutor/hooks/useStudentRiskProfile.ts`
- [ ] `src/features/dashboard-tutor/components/RiskProfilePanel/SaludTutorView.tsx`
- [ ] `src/features/dashboard-tutor/components/AlertHistoryTimeline/index.tsx`
- [ ] `src/features/dashboard-tutor/components/RiskProfilePanel/index.tsx`

### Fase 5 — HU005 + HU006: Bitácora y Cierre
- [ ] `src/features/dashboard-tutor/hooks/useFollowUp.ts`
- [ ] `src/features/dashboard-tutor/components/FollowUpForm/index.tsx`
- [ ] `src/features/dashboard-tutor/hooks/useCloseAlert.ts`
- [ ] `src/features/dashboard-tutor/components/CloseAlertFlow/index.tsx`
- [ ] `src/app/(tutor)/estudiante/[id]/page.tsx`

### Fase 6 — HU007: Gestión de cuentas de tutorados ← **nueva**
- [ ] `src/features/gestion-tutorados/hooks/useTutorados.ts`
- [ ] `src/features/gestion-tutorados/hooks/useCreateTutorado.ts`
- [ ] `src/features/gestion-tutorados/hooks/useUpdateTutorado.ts`
- [ ] `src/features/gestion-tutorados/components/TutoradosList/index.tsx`
- [ ] `src/features/gestion-tutorados/components/TutoradoForm/index.tsx`
- [ ] `src/features/gestion-tutorados/types.ts`
- [ ] `src/app/(tutor)/tutorados/page.tsx`

### Tipos de la Feature (dashboard)
- [ ] `src/features/dashboard-tutor/types.ts`

---

## Contratos TypeScript Detallados

```typescript
// src/types/alert.ts
export type SemaforoEstado = 'rojo' | 'amarillo' | 'verde' | 'revisar' | 'sin-datos';
export type AIEngineStatus = 'ok' | 'degraded' | 'unavailable';
export type AlertStatus = 'nueva' | 'en-seguimiento' | 'derivada-psicologia' | 'derivada-medicina' | 'resuelta';

export interface PriorityAlert {
  id: string;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  semaforoEstado: SemaforoEstado;
  etiquetaOperativa: string;   // Del catálogo — NUNCA score crudo
  status: AlertStatus;
  isRead: boolean;
  updatedAt: string;
  aiEngineStatus: AIEngineStatus;
}

export interface AlertHistoryItem {
  id: string;
  status: AlertStatus;
  etiquetaOperativa: string;
  registeredAt: string;
  registeredBy: string;
  notes?: string;
}

export interface FollowUpRequest {
  alertId: string;
  contenido: string;  // Mínimo 30 caracteres
}

export interface CloseAlertRequest {
  alertId: string;
  evidencia: string;  // Obligatorio
}
```

```typescript
// src/types/student.ts

// ⚠️ TIPO EXCLUSIVO PARA TUTOR — diagnosticoClinico ausente por diseño
export interface DimensionSaludTutor {
  semaforoEstado: SemaforoEstado;
  recomendacionOperativa: string;
  // diagnosticoClinico: CAMPO PROHIBIDO EN ESTE TIPO
}

export interface DimensionRiesgo {
  semaforoEstado: SemaforoEstado;
  etiquetaOperativa: string;
}

export interface StudentRiskProfile {
  id: string;
  name: string;
  photo?: string;
  matricula: string;
  carrera: string;
  semestre: number;
  academico: DimensionRiesgo;
  socioeconomico: DimensionRiesgo;
  salud: DimensionSaludTutor;
  alertHistory: AlertHistoryItem[];
  encuestaCompletada: boolean;
}

export interface AcademicHistory {
  studentId: string;
  asistencia: { mes: string; porcentaje: number }[];
  calificaciones: { materia: string; promedio: number }[];
}
```

```typescript
// src/types/tutorado.ts  ← NUEVO

/**
 * Payload para crear o actualizar la cuenta de un tutorado.
 * Coincide con el body esperado por el backend:
 *   POST /tutor/tutorados        → CreateTutoradoRequest
 *   PUT  /tutor/tutorados/:matricula → UpdateTutoradoRequest
 */
export interface CreateTutoradoRequest {
  matricula: string;   // Ej. "20230001"
  password: string;    // ⚠️ NUNCA persistir en estado global ni loggear
}

export interface UpdateTutoradoRequest {
  matricula?: string;  // Opcional si solo se actualiza la contraseña
  password: string;    // Obligatorio — razón principal de la edición
}

/** Representación del tutorado en el listado del tutor */
export interface TutoradoItem {
  matricula: string;
  nombre?: string;     // Puede no estar disponible según backend
  carrera?: string;
  semestre?: number;
  cuentaActiva: boolean;
  creadoAt: string;
}

export type TutoradoFormMode = 'create' | 'edit';
```

```typescript
// src/features/gestion-tutorados/types.ts  ← NUEVO

export interface TutoradoFormState {
  matricula: string;
  password: string;
  confirmPassword: string;  // Solo en modo 'create'; validación cliente
}

export interface TutoradoFormErrors {
  matricula?: string;
  password?: string;
  confirmPassword?: string;
}
```

---

## Estados de UI por HU

### HU003 — Widget de alertas prioritarias
- [ ] **Loading**: `SkeletonCard` × 5 (p95 < 1.5s — QA-05)
- [ ] **Success**: Hasta 5 AlertCards ordenadas por urgencia
- [ ] **Empty**: "Todos tus tutorados están en seguimiento normal" + ícono ✓ verde
- [ ] **Error**: Toast de error + botón "Reintentar"
- [ ] **Degraded**: Banner "Datos del [fecha] — Motor de IA no disponible"

### HU004 — Perfil de riesgo
- [ ] **Loading**: Skeletons para gráficas y semáforos
- [ ] **Success**: Perfil completo con Recharts
- [ ] **Sin encuesta**: Indicador "Variables personales: pendientes" + botón "Reenviar encuesta"
- [ ] **Error**: Mensaje con botón volver al dashboard
- [ ] **Degraded**: Banner en sección de IA con timestamp

### HU005 — Bitácora
- [ ] **Idle**: Form inline con contador "0/30"
- [ ] **Validación**: Mensaje "Mínimo 30 caracteres" bloqueando submit
- [ ] **Loading**: Spinner inline en botón "Guardar"
- [ ] **Success**: Entrada añadida con timestamp + autor
- [ ] **Error**: Toast "Error al guardar. Reintentar."

### HU006 — Cierre de alerta
- [ ] **Flujo guiado**: Step 1 (evidencia) → Step 2 (confirmación)
- [ ] **Sin evidencia**: Botón "Confirmar cierre" deshabilitado
- [ ] **Success**: Estado "Resuelta" + info de micro-encuesta al estudiante en 24h
- [ ] **Error**: Toast + retry

### HU007 — Gestión de cuentas de tutorados ← **nueva**
- [ ] **Lista (loading)**: `SkeletonCard` × N mientras carga el listado
- [ ] **Lista (success)**: Tabla/lista con matrícula, estado de cuenta y acciones (Editar / ···)
- [ ] **Lista (empty)**: "Aún no tienes tutorados registrados" + botón "Registrar primer tutorado"
- [ ] **Registrar (idle)**: Form con campos `Matrícula` + `Contraseña` + `Confirmar contraseña`
- [ ] **Registrar (validación)**: Errores inline — matrícula requerida, contraseñas no coinciden
- [ ] **Registrar (loading)**: Botón "Registrar" con spinner, campos deshabilitados
- [ ] **Registrar (success)**: Toast "Tutorado registrado correctamente" + regresa a lista
- [ ] **Registrar (error 409)**: Mensaje "Esta matrícula ya tiene una cuenta registrada"
- [ ] **Editar (idle)**: Form prellenado con matrícula (read-only) + campos de nueva contraseña
- [ ] **Editar (success)**: Toast "Contraseña actualizada correctamente"
- [ ] **Editar (error)**: Toast "Error al actualizar. Reintentar."

---

## Especificación de `TutoradoForm` (HU007)

### Modo `create`
| Campo | Tipo | Validación |
|---|---|---|
| `Matrícula` | `text` | Requerido, no editable en modo `edit` |
| `Contraseña` | `password` | Requerido, mínimo 6 caracteres |
| `Confirmar contraseña` | `password` | Debe coincidir con `Contraseña` |

### Modo `edit`
| Campo | Tipo | Comportamiento |
|---|---|---|
| `Matrícula` | `text` (disabled) | Solo lectura — se pasa como parámetro de ruta |
| `Nueva contraseña` | `password` | Requerido |
| `Confirmar nueva contraseña` | `password` | Debe coincidir |

### Reglas de seguridad del formulario
- Campos `password` siempre con `type="password"` — nunca `type="text"`
- `autoComplete="new-password"` en campos de contraseña nueva
- El valor de la contraseña se limpia del estado local al desmontar el componente (`useEffect` cleanup)
- ❌ Nunca loggear el objeto `TutoradoFormState` completo con `console.log`
- La confirmación de contraseña **no se envía al backend** — es validación solo del lado cliente

### Llamadas al servicio (en `src/services/api/tutorados.ts`)
```typescript
// Registrar nuevo tutorado
export async function createTutorado(data: CreateTutoradoRequest): Promise<void> {
  // POST /tutor/tutorados
  // body: { matricula, password }
  // TODO: conectar al endpoint real
}

// Actualizar contraseña de tutorado existente
export async function updateTutorado(
  matricula: string,
  data: UpdateTutoradoRequest
): Promise<void> {
  // PUT /tutor/tutorados/:matricula
  // body: { password }
  // TODO: conectar al endpoint real
}

// Listar tutorados del tutor autenticado
export async function getTutorados(): Promise<TutoradoItem[]> {
  // GET /tutor/tutorados
  // TODO: conectar al endpoint real
}
```

---

## Checklist de Privacidad

- [ ] `AlertCard` renderiza para Tutor: `diagnosticoClinico` ausente (tipo `PriorityAlert` no lo incluye)
- [ ] `RiskProfilePanel` usa `DimensionSaludTutor` (sin diagnóstico, con `recomendacionOperativa`)
- [ ] `SaludTutorView` muestra `LockIcon` 🔒 obligatoriamente en la sección de salud
- [ ] Tipos en `student.ts` tienen comentario explícito `// CAMPO PROHIBIDO`
- [ ] `useStudentRiskProfile` aplica `filterHealthByRole()` como segunda capa defensiva
- [ ] Widget de alertas: ❌ sin score numérico — solo `etiquetaOperativa`
- [ ] ❌ Sin texto "alto riesgo de abandono" en ningún componente
- [ ] `TutoradoForm`: campos `password` siempre con `type="password"` — nunca expuestos en texto plano
- [ ] `TutoradoFormState` no se loggea en consola bajo ninguna circunstancia
- [ ] La contraseña se limpia del estado al desmontar el formulario

---

## Riesgos Identificados

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Backend no expone `/alerts/priority` aún | Alta | Iniciar con mock tipado + `// TODO: conectar` |
| Recharts puede no tener datos reales en demo | Media | Mock `AcademicHistory` con datos de prueba realistas |
| `aiEngineStatus: 'degraded'` en todos los mocks | Baja | Diseñar degraded state desde el inicio |
| Confusión `AlertCard` en `features/` vs `components/ui/` | Media | El de `features/` tiene lógica; `components/ui/` es puramente presentacional |
| Endpoint `GET /tutor/tutorados` pendiente de verificar | Media | Mock con array `TutoradoItem[]` hasta confirmar en Swagger |
| Fuga de contraseña en estado global o logs | Alta | Reglas de seguridad del form en checklist de privacidad |
| Matrícula duplicada al registrar (409) | Media | Capturar error HTTP 409 y mostrar mensaje específico en UI |

---

## Preguntas de "Vibes" para Aprobación

1. **Layout del dashboard**: ¿El widget de alertas ocupa toda la pantalla o comparte espacio con otros widgets (estadísticas rápidas, calendario de tutorías)?

2. **Gráficas en HU004**: ¿Prefieres líneas (asistencia) + barras (calificaciones), o visualización tipo radar por dimensiones de riesgo?

3. **Navegación al perfil**: Al hacer clic en `AlertCard`, ¿se navega a página completa `/tutor/estudiante/[id]` o se abre en panel lateral (drawer)?

4. **Avatar del estudiante**: `studentPhoto?` es opcional — ¿hay sistema de fotos o usamos iniciales como fallback?

5. **Gestión de tutorados (HU007)**: ¿El formulario de registro vive en una ruta dedicada `/tutor/tutorados/nuevo` o se abre en un modal/dialog sobre el listado?

6. **Eliminación de tutorado**: ¿El tutor puede eliminar la cuenta de un tutorado desde esta pantalla, o solo registrar y editar?

---

*Plan actualizado · ÉPICA 2 v2 · Abril 2026 · SAE · Monkora*
