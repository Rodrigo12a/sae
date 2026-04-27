# design.md
# SAE — Arquitectura Frontend y Sistema de Diseño
> Sistema Inteligente de Acompañamiento Estudiantil  
> Monkora · Rodrigo Osorio Rojas · Abril 2026  
> Versión 1.0 · Documento vivo — actualizar en cada ciclo de HU

---

## 1. Stack Tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR/SSG para performance · Server Components para RBAC |
| Lenguaje | **TypeScript** | Contratos de API tipados · Seguridad en capas de privacidad |
| Estado global | **Zustand** | Liviano · Sin boilerplate · Compatible con Server Components |
| Estado de servidor | **TanStack Query v5** | Cache automático · Modo degradado · Retry con Circuit Breaker |
| Estilos | **Tailwind CSS** + **CSS Variables** | Utilidades rápidas + tokens del sistema de diseño |
| Gráficas | **Recharts** | Accesibilidad built-in · Tooltips interactivos |
| Formularios | **React Hook Form** + **Zod** | Validación tipada · UX de error inline |
| PWA / Offline | **Workbox** (Service Worker) | Cache de encuesta estudiantil (QA-07) |
| Accesibilidad | **Radix UI** (primitivas) | ARIA completo out-of-the-box |
| Animaciones | **Framer Motion** | Transiciones de estado · Modo degradado |
| Tests | **Vitest** + **Testing Library** | Unit + Integration de componentes |

---

## 2. Estructura de Directorios

```
src/
├── app/                          # Next.js App Router (rutas y layouts)
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx          # HU001 — Pantalla de login SSO
│   ├── (tutor)/
│   │   ├── layout.tsx            # Layout con RBAC: solo rol tutor
│   │   ├── dashboard/
│   │   │   └── page.tsx          # HU003 — Dashboard con widget de alertas
│   │   └── estudiante/
│   │       └── [id]/
│   │           └── page.tsx      # HU004, HU005, HU006 — Perfil de riesgo
│   ├── (admin)/
│   │   ├── layout.tsx            # Layout con RBAC: solo rol admin
│   │   ├── dashboard/
│   │   │   └── page.tsx          # HU016 — Dashboard ejecutivo KPIs
│   │   ├── reportes/
│   │   │   └── page.tsx          # HU018 — Exportación de reportes
│   │   └── auditoria/
│   │       └── page.tsx          # HU022, HU023 — Panel de inconsistencias
│   ├── (psicologo)/
│   │   ├── layout.tsx            # Layout con RBAC: solo rol psicólogo
│   │   ├── bandeja/
│   │   │   └── page.tsx          # HU014 — Bandeja de casos derivados
│   │   └── caso/
│   │       └── [id]/
│   │           └── page.tsx      # HU015 — Bitácora confidencial
│   ├── (medico)/
│   │   ├── layout.tsx            # Layout con RBAC: solo rol médico
│   │   └── jornada/
│   │       └── page.tsx          # HU009, HU010, HU011 — Captura masiva
│   └── encuesta/
│       └── [token]/
│           └── page.tsx          # HU007, HU008 — Encuesta pública (sin auth)
│
├── features/                     # Lógica de negocio por épica
│   ├── auth/                     # Épica 1
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── dashboard-tutor/          # Épica 2
│   │   ├── components/
│   │   │   ├── AlertCard/
│   │   │   ├── RiskProfilePanel/
│   │   │   ├── FollowUpForm/
│   │   │   └── CloseAlertFlow/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── encuesta/                 # Épica 3
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── medico/                   # Épica 4
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── derivaciones/             # Épica 5
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── dashboard-admin/          # Épica 6
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   └── auditoria/                # Épica 8
│       ├── components/
│       ├── hooks/
│       └── types.ts
│
├── components/
│   ├── ui/                       # Componentes presentacionales puros
│   │   ├── Semaforo/             # Componente central del sistema visual
│   │   ├── AlertCard/
│   │   ├── RiskBadge/
│   │   ├── LockIcon/
│   │   ├── ProgressBar/
│   │   ├── Toast/
│   │   └── SkeletonCard/
│   └── layout/
│       ├── Navbar/
│       ├── NotificationCenter/
│       └── RoleLayout/
│
├── services/
│   └── api/                      # Capa de acceso a datos (única fuente de verdad HTTP)
│       ├── auth.ts
│       ├── alerts.ts
│       ├── students.ts
│       ├── surveys.ts
│       ├── medical.ts
│       ├── referrals.ts
│       ├── admin.ts
│       └── audit.ts
│
├── store/                        # Estado global Zustand
│   ├── authStore.ts
│   ├── notificationStore.ts
│   └── uiStore.ts
│
├── hooks/                        # Custom hooks reutilizables
│   ├── useRBAC.ts
│   ├── useOfflineForm.ts
│   ├── useAIEngineStatus.ts
│   └── useNotifications.ts
│
├── lib/
│   ├── queryClient.ts            # TanStack Query config + Circuit Breaker
│   ├── apiClient.ts              # Axios/fetch base con interceptores
│   ├── privacyGuard.ts           # Utilidades de filtrado de datos por rol
│   └── semaphoreConfig.ts        # Mapeo catálogo → etiquetas operativas
│
└── types/
    ├── roles.ts
    ├── student.ts
    ├── alert.ts
    └── api.ts
```

---

## 3. Arquitectura por Capas

```
┌────────────────────────────────────────────────────┐
│                  PRESENTACIÓN                       │
│  app/ (páginas Next.js) + components/ui/ (puros)   │
├────────────────────────────────────────────────────┤
│               LÓGICA DE NEGOCIO                     │
│         features/<épica>/hooks/ + store/            │
├────────────────────────────────────────────────────┤
│              ACCESO A DATOS                         │
│          services/api/ + lib/queryClient            │
├────────────────────────────────────────────────────┤
│                INFRAESTRUCTURA                      │
│       lib/apiClient + Service Worker (PWA)          │
└────────────────────────────────────────────────────┘
                        ↕
             Backend: sae-backend-theta.vercel.app
```

**Regla de dependencias**: Las capas superiores solo importan de capas inferiores. Nunca al revés.

---

## 4. Sistema de Diseño

### 4.1 Tokens de Color

```css
/* Sistema de diseño SAE — tokens globales */
:root {
  /* Colores institucionales */
  --color-primary: #1E3A5F;
  --color-primary-hover: #16324F;

  --color-secondary: #3A7BC8;   
  --color-secondary-light: #DCE9F8;

  --color-accent: #5AA9E6; 

  /* Fondos */
  --bg-main: #F9FAFB;
  --bg-panel: #FFFFFF;
  --bg-section: #F1F5F9;

  --border-subtle: #E2E8F0;
  --border-strong: #CBD5E1;

  /* Semáforo de riesgo */
  --semaforo-rojo: #D64545;
  --semaforo-amarillo: #F4B740;
  --semaforo-verde: #2FA36B;
  --semaforo-ojo: #7E57C2;
  --semaforo-gris: #94A3B8;

  /* Notificaciones */
  --notif-riesgo: #D64545;
  --notif-derivacion: #3A7BC8;
  --notif-auditoria: #F59E0B;
  --notif-info: #64748B;

  /* Módulo médico (diferenciado) */
  --medico-bg: #E6F4EA;
  --medico-accent: #2E7D32;

  /* Módulo psicología */
  --psico-private-bg: #F3E8FF;
  --psico-accent: #8B5CF6;

  /* Color de Tipografía */
  --text-primary: #1E293B;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
  --text-inverse: #FFFFFF;

  /* Estados UI */
  --state-hover: #F1F5F9;
  --state-active: #E2E8F0;
  --state-disabled: #CBD5E1;

  /* Tipografía */
  --font-base: 16px;
  --font-secondary: 14px;
  --font-caption: 12px;

  /* Espaciado mínimo táctil */
  --touch-min: 44px;
  --touch-recommended: 48px;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.08);
}
```

### 4.2 Componente Semáforo — Especificación

El semáforo es el componente más crítico. Nunca usa el color como único diferenciador.

```tsx
/**
 * @module Semaforo
 * @epic Transversal
 * @hu HU003, HU004, HU010
 * @ux UXDT-01, UXDT-03, UXDT-07, UXMM-05, UXMM-06
 * @qa QA-01 (nunca mostrar score al Tutor)
 * @accessibility WCAG AA — siempre color + ícono + texto
 */

type SemaforoEstado = 'rojo' | 'amarillo' | 'verde' | 'revisar' | 'sin-datos';

interface SemaforoProps {
  estado: SemaforoEstado;
  etiqueta: string;        // Etiqueta operativa del catálogo (nunca score crudo)
  dimension?: string;      // 'Académico' | 'Socioeconómico' | 'Salud'
  expandible?: boolean;
}

// Mapa de estados
const SEMAFORO_CONFIG = {
  rojo:      { color: '#C0392B', icono: '⚠️', ariaLabel: 'Atención urgente requerida' },
  amarillo:  { color: '#F39C12', icono: '❕', ariaLabel: 'Seguimiento recomendado' },
  verde:     { color: '#27AE60', icono: '✓',  ariaLabel: 'Sin acción requerida' },
  revisar:   { color: '#8E44AD', icono: '👁', ariaLabel: 'Datos pendientes de verificación' },
  'sin-datos': { color: '#95A5A6', icono: '🕐', ariaLabel: 'Encuesta no completada' },
};
```

### 4.3 Sistema de Notificaciones

```tsx
/**
 * @module NotificationCenter
 * @hu HU003-HU023 (transversal)
 * @ux UXCN-01, UXCN-02, UXCN-03
 * @api GET /api/notifications · PUT /api/notifications/:id/read
 */

type NotificationCategory = 'riesgo' | 'derivacion' | 'auditoria' | 'informativa';

interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  studentId?: string;   // Para navegación al perfil
  caseId?: string;      // Para navegación al caso
}
```

---

## 5. Mapeo de Endpoints del Backend

> API Base URL: `https://sae-backend-theta.vercel.app/api`  
> Documentación Swagger: `https://sae-backend-theta.vercel.app/api/docs`  
> Variable de entorno: `NEXT_PUBLIC_API_URL`

### 5.1 Autenticación (Épica 1)

| Método | Endpoint | HU | Descripción |
|---|---|---|---|
| `POST` | `/auth/login` | HU001 | Login SSO con matrícula/correo + contraseña |
| `POST` | `/auth/logout` | HU001 | Cierre de sesión |
| `GET` | `/auth/me` | HU001 | Obtener usuario autenticado + rol |
| `GET` | `/auth/permissions` | HU002 | Permisos del rol actual |

```typescript
// TODO: conectar a POST /auth/login cuando esté disponible
// Contrato esperado:
interface LoginRequest { matricula: string; password: string; }
interface LoginResponse {
  token: string;
  user: { id: string; name: string; role: UserRole; };
}
type UserRole = 'tutor' | 'estudiante' | 'admin' | 'psicologo' | 'medico';
```

---

### 5.2 Dashboard y Alertas — Tutor (Épica 2)

| Método | Endpoint | HU | Descripción |
|---|---|---|---|
| `GET` | `/alerts/priority` | HU003 | Widget de atención prioritaria (máx. 5 tarjetas) |
| `GET` | `/students/:id/risk-profile` | HU004 | Perfil de riesgo completo del estudiante |
| `GET` | `/students/:id/academic-history` | HU004 | Historial académico (calificaciones + asistencia) |
| `POST` | `/alerts/:id/followup` | HU005 | Registrar seguimiento en bitácora |
| `PUT` | `/alerts/:id/close` | HU006 | Cerrar alerta con evidencia |

```typescript
// GET /alerts/priority — Respuesta esperada (rol: tutor)
// ⚠️ PRIVACIDAD: el backend NO debe incluir campo "score" ni "diagnostico"
interface PriorityAlert {
  id: string;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  semaforoEstado: 'rojo' | 'amarillo' | 'verde' | 'revisar';
  etiquetaOperativa: string;   // Del catálogo configurable
  isRead: boolean;
  updatedAt: string;
  aiEngineStatus: 'ok' | 'degraded' | 'unavailable';
}

// GET /students/:id/risk-profile — Respuesta esperada (rol: tutor)
// ⚠️ PRIVACIDAD: el backend filtra por rol; nunca enviar "diagnosticoClinico"
interface StudentRiskProfile {
  id: string;
  name: string;
  academico: DimensionRiesgo;
  socioeconomico: DimensionRiesgo;
  salud: DimensionSaludTutor;  // Solo etiqueta operativa para tutor
  alertHistory: AlertHistoryItem[];
  encuestaCompletada: boolean;
}

interface DimensionSaludTutor {
  // ⚠️ Este tipo NUNCA incluye "diagnosticoClinico"
  semaforoEstado: 'rojo' | 'amarillo' | 'verde' | 'revisar' | 'sin-datos';
  recomendacionOperativa: string;
  // diagnosticoClinico: CAMPO PROHIBIDO EN ESTE TIPO
}
```

---

### 5.3 Encuesta de Contexto (Épica 3)

| Método | Endpoint | HU | Descripción |
|---|---|---|---|
| `GET` | `/surveys/token/:token` | HU007 | Validar token de encuesta (expiración 7 días) | ✅ |
| `POST` | `/surveys/:id/submit` | HU007 | Enviar respuestas de encuesta | ✅ |
| `GET` | `/surveys/:id/resources` | HU008 | Recursos institucionales personalizados post-envío | ✅ |

```typescript
// POST /surveys/:id/submit
// ⚠️ El backend marca como "pendiente-verificacion" si completado < 60s
// El frontend NO debe saber ni mostrar este estado al estudiante
interface SurveySubmitRequest {
  surveyId: string;
  responses: SurveyResponse[];
  completionTimeMs: number;   // El backend decide si es confiable
  offlineCached: boolean;     // Indica si vino del cache local
}

// Respuesta al estudiante — siempre positiva (HU007 edge case)
interface SurveySubmitResponse {
  success: true;
  // ⚠️ NUNCA incluir campo "confiable" o "pendienteVerificacion" en la respuesta al estudiante
  message: "Tus respuestas fueron recibidas";  // No "procesadas"
}
```

---

### 5.4 Módulo Médico (Épica 4)

| Método | Endpoint | HU | Descripción |
|---|---|---|---|
| `GET` | `/medical/students?group=:id` | HU009 | Lista de estudiantes por grupo para checklist |
| `POST` | `/medical/bulk-register` | HU009 | Carga masiva de datos clínicos |
| `GET` | `/medical/students/:id/health` | HU010 | Expediente médico (solo rol médico/psicólogo) |
| `PUT` | `/medical/students/:id/health` | HU010 | Actualizar condición de salud |
| `POST` | `/medical/students/:id/prolonged-alert` | HU011 | Generar alerta de impacto prolongado al tutor |

```typescript
// POST /medical/bulk-register
// ⚠️ Solo accesible con rol "medico" — backend valida scope del campus
interface BulkHealthRegisterRequest {
  groupId: string;
  entries: Array<{
    studentId: string;
    condiciones: string[];          // IDs del catálogo clínico
    fechaInicioAusentismo?: string;
    duracionEstimadaDias?: number;
  }>;
}

// GET /medical/students/:id/health — Respuesta diferenciada por rol
// Rol "medico": incluye diagnosticoClinico
// Rol "tutor": SOLO etiquetaOperativa + semaforoEstado (backend maneja esto)
interface HealthProfileMedico {
  studentId: string;
  diagnosticoClinico: string;
  etiquetaOperativa: string;
  semaforoEstado: 'rojo' | 'amarillo' | 'verde';
  condiciones: MedicalCondition[];
}
interface HealthProfileTutor {
  studentId: string;
  // diagnosticoClinico: CAMPO AUSENTE — nunca llega al frontend del tutor
  etiquetaOperativa: string;
  semaforoEstado: 'rojo' | 'amarillo' | 'verde';
}
```

---

### 5.5 Derivaciones (Épica 5)

| Método | Endpoint | HU | Descripción |
|---|---|---|---|
| `POST` | `/referrals/psychology` | HU012 | Crear derivación a psicología |
| `POST` | `/referrals/medical` | HU013 | Crear derivación a servicios médicos |
| `GET` | `/referrals/pending` | HU014 | Bandeja de casos pendientes (psicólogo) |
| `PUT` | `/referrals/:id/accept` | HU014 | Aceptar caso derivado |
| `POST` | `/referrals/:id/notes` | HU015 | Registrar nota clínica (privada o pública) |
| `GET` | `/referrals/capacity/psychology` | HU012 | Estado de capacidad del departamento |

```typescript
// POST /referrals/psychology
interface PsychologyReferralRequest {
  studentId: string;
  alertId: string;
  motivoId: string;            // Del catálogo obligatorio
  descripcionObservable: string; // Validación frontend: sin términos clínicos
}

// POST /referrals/:id/notes
// ⚠️ PRIVACIDAD: notaPrivada=true → cifrado AES-256 en servidor
// Solo el psicólogo puede leer notas privadas
interface ClinicalNoteRequest {
  referralId: string;
  contenido: string;
  esPrivada: boolean;
  recomendacionOperativa?: string; // Solo se publica si esPrivada=false o se publica por separado
}

// GET /referrals/capacity/psychology
interface DepartmentCapacity {
  currentLoad: number;
  maxCapacity: number;
  isSaturated: boolean;
  estimatedWaitDays?: number;
}
```

---

### 5.6 Dashboard Administrativo (Épica 6)

| Método | Endpoint | HU | Descripción |
|---|---|---|---|
| `GET` | `/admin/kpis` | HU016 | KPIs globales de riesgo |
| `GET` | `/admin/kpis?career=:id&semester=:n` | HU016 | KPIs filtrados |
| `GET` | `/admin/groups/:id/drill-down` | HU017 | Drill-down de anomalías por grupo |
| `POST` | `/admin/reports/generate` | HU018 | Generar reporte PDF o Excel |
| `GET` | `/admin/reports/:jobId/status` | HU018 | Estado del reporte asíncrono |

```typescript
// GET /admin/kpis
// ⚠️ Esta respuesta NUNCA incluye datos clínicos individuales
interface AdminKPIs {
  riesgoGlobal: number;         // Índice 0-100
  alertasAtendidas: number;
  alertasIgnoradas: number;
  comparativaPorCarrera: CareerRiskComparison[];
  dataFreshness: string;        // ISO timestamp — para badge de frescura
  latencyMs: number;            // Si > 300000ms (5min), badge de advertencia
}

// POST /admin/reports/generate — Para datasets > 10,000 filas: proceso asíncrono
interface ReportGenerateRequest {
  format: 'pdf' | 'excel';
  filters: { careerId?: string; semester?: number; };
  includeClinicalData: false;   // Siempre false — backend valida esto
}
interface ReportGenerateResponse {
  jobId: string;
  async: boolean;              // true si > 10,000 filas → UI muestra "En proceso"
  estimatedMinutes?: number;
  downloadUrl?: string;        // Disponible si async=false
}
```

---

### 5.7 Auditoría (Épica 8)

| Método | Endpoint | HU | Descripción |
|---|---|---|---|
| `GET` | `/audit/inconsistencies` | HU023 | Lista de inconsistencias de servicio |
| `GET` | `/audit/tutors/:id/history` | HU023 | Historial de desempeño del tutor |
| `GET` | `/audit/micro-surveys/:alertId/status` | HU022 | Estado de la micro-encuesta |

```typescript
// GET /audit/inconsistencies
// ⚠️ Solo accesible con rol "admin" — el Tutor no puede ver su propio historial de auditoría
interface ServiceInconsistency {
  id: string;
  alertId: string;
  tutorId: string;
  tutorName: string;
  studentId: string;
  studentName: string;
  detectedAt: string;
  severity: 'standard' | 'critical';  // critical = 3+ en el ciclo
}
```

---

## 6. Gestión de Estado

### 6.1 Estado Global (Zustand)

```typescript
// store/authStore.ts
interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  // Acciones
  login: (user: AuthUser) => void;
  logout: () => void;
}

// store/notificationStore.ts
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  // Acciones
  addNotification: (n: Notification) => void;
  markAsRead: (id: string) => void;
}

// store/uiStore.ts
interface UIState {
  aiEngineStatus: 'ok' | 'degraded' | 'unavailable';
  setAIEngineStatus: (status: AIEngineStatus) => void;
}
```

### 6.2 Estado de Servidor (TanStack Query)

```typescript
// lib/queryClient.ts — Circuit Breaker para el Motor de IA
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,       // 30s para datos de alertas
      gcTime: 5 * 60_000,      // 5min en caché
      // Si el Motor de IA falla → modo degradado (no error de UI)
      onError: (error) => {
        if (isAIEngineError(error)) {
          useUIStore.getState().setAIEngineStatus('degraded');
        }
      }
    }
  }
});
```

---

## 7. Estrategia de Privacidad Diferencial en Frontend

```
                    Backend filtra por rol
                           ↓
┌─────────────────────────────────────────────────┐
│  GET /students/:id/risk-profile (rol: tutor)    │
│  Respuesta: SIN diagnosticoClinico              │
│  Solo etiquetaOperativa + semaforoEstado        │
└─────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────┐
│         privacyGuard.ts (lib/)                  │
│  validateRoleAccess(user.role, dataField)       │
│  → Segunda capa de verificación en frontend     │
└─────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────┐
│      Componente RiskProfilePanel                │
│  if (role === 'tutor') → render <SaludTutor>   │
│  if (role === 'medico') → render <SaludMedico> │
│  Componentes separados = imposible filtrar mal  │
└─────────────────────────────────────────────────┘
```

**Principio**: La privacidad diferencial se aplica en tres capas:
1. **Servidor**: filtra los campos según el rol del JWT.
2. **Service Layer**: los tipos TypeScript prohíben el campo `diagnosticoClinico` para el Tutor.
3. **Componente**: los componentes del Tutor y del Médico son tipos diferentes — nunca comparten el mismo render de datos de salud.

---

## 8. Estrategia PWA / Offline (Encuesta Estudiantil)

```
Estudiante abre encuesta → Service Worker intercepta
        ↓
¿Hay conexión?
  SÍ → formulario normal
  NO → banner "Sin conexión — tus respuestas están guardadas"
       formulario sigue operable
       respuestas en IndexedDB (cache local)
        ↓
Recupera conexión → retry automático
       → banner "Conexión restaurada — tus respuestas se enviaron"
       → limpia IndexedDB
```

**Implementación**: Workbox con estrategia `NetworkFirst` para el submit del formulario + fallback a IndexedDB.

---

## 9. Manejo de Estados de UI

Cada componente con datos remotos debe implementar los 5 estados:

| Estado | Descripción | Implementación |
|---|---|---|
| **Loading** | Esperando respuesta | Skeleton Card (nunca spinner bloqueante) |
| **Success** | Datos disponibles | Render normal |
| **Empty** | Sin datos para el contexto | Mensaje contextual + ícono (nunca pantalla en blanco) |
| **Error** | Fallo de red/servidor | Toast de error + botón reintentar |
| **Degraded** | Motor de IA no disponible | Banner con timestamp de última actualización |

---

## 10. Routing y Guardias de Acceso

```typescript
// Middleware Next.js — src/middleware.ts
// Protege rutas por rol antes del rendering

const ROLE_ROUTES = {
  tutor:      ['/tutor/*'],
  admin:      ['/admin/*'],
  psicologo:  ['/psicologo/*'],
  medico:     ['/medico/*'],
  // '/encuesta/*' es pública (autenticación por token)
};

// Si el rol no coincide → redirect a /403 con UI amigable
// Registra intento en log de seguridad (HU002 edge case)
```

---

## 11. Módulos por Desarrollar — Roadmap Frontend

Orden recomendado según impacto en atributos de calidad críticos:

| Prioridad | Módulo | Épica | HUs | Estado |
|---|---|---|---|---|
| 1 | Autenticación y RBAC | Épica 1 | HU001, HU002 | ✅ Completado |
| 2 | Dashboard Tutor + Widget Alertas | Épica 2 | HU003, HU004 | ✅ Completado |
| 3 | Bitácora y Cierre de Alertas | Épica 2 | HU005, HU006 | ✅ Completado |
| 4 | Encuesta Estudiantil (Mobile PWA) | Épica 3 | HU007, HU008 | ✅ Completado |
| 5 | Módulo Médico + Privacidad Diferencial | Épica 4 | HU009–HU011 | ✅ Completado |
| 6 | Flujo de Derivaciones | Épica 5 | HU012–HU015 | ✅ Completado |
| 7 | Dashboard Ejecutivo | Épica 6 | HU016–HU018 | ✅ Completado |
| 8 | Auditoría y Control de Calidad | Épica 8 | HU022–HU023 | ✅ Completado |

*Actualizar estado en cada ciclo de Vibe Engineering.*

---

*Documento vivo — actualizar en cada ciclo de HU completado.*  
*Versión 1.0 · Abril 2026 · SAE · Monkora*
