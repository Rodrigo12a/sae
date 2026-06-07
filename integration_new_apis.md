# SAE Frontend — Prompt de Integración de Endpoints

**Fecha:** 7 de junio de 2026  
**Backend:** `https://sae-backend-beige.vercel.app/api`  
**Alcance:** 28 endpoints pendientes \+ nuevo flujo de asignación tutor↔alumno  
**Excluye:** Los 15 endpoints ya integrados (✅) y `POST /predict` (uso exclusivo backend→ML)

---

## Contexto del proyecto

Estás trabajando en el frontend del **SIAE (Sistema Inteligente de Acompañamiento Estudiantil)**. El backend ya está desplegado y documentado. Tu tarea es completar la integración de los endpoints pendientes siguiendo el estado actual del código:

- **⚠️ Discrepancia** \= ruta incorrecta en el frontend, corregir la URL y reconectar  
- **🟡 En mock** \= el servicio ya existe en el archivo indicado, solo descomentar la llamada real y eliminar el mock  
- **❌ Ausente** \= crear el servicio desde cero en el archivo indicado

**Autenticación:** Todos los endpoints requieren `Authorization: Bearer <access_token>` excepto `POST /encuesta/verificacion/{token}/submit`. El token viene de `POST /auth/login` y está almacenado en el estado del cliente (no localStorage).

---

## BLOQUE 0 — PROBLEMA ESTRUCTURAL: Asignación tutor↔alumno (resolver primero)

### Diagnóstico

El flujo actual tiene un fallo de diseño: cuando un DOCENTE crea un ALUMNO con `POST /users`, el body solo manda `{ nombre, matricula, password, role }` sin información de tutor ni carrera. Resultado: el alumno queda huérfano en Firestore — sin tutor asignado, sin carrera, y sin aparecer en el dashboard del DOCENTE. El ADMIN tampoco puede ver a qué tutor pertenece cada alumno.

### Solución de dos partes

**Parte A — Solicitar nuevo endpoint al equipo backend:**

El backend necesita implementar:

POST /users/alumno-completo

Authorization: Bearer \<token ADMIN o DOCENTE\>

Body:

{

  "nombre": "Juan Pérez García",

  "matricula": "20230001",

  "password": "Pass123456",

  "role": "ALUMNO",

  "tutorId": "uid\_firebase\_del\_docente",   ← nuevo campo

  "carreraId": "ISC"                        ← nuevo campo

}

Respuesta 201:

{

  "uid": "abc123firebaseUID",

  "message": "Usuario creado y asignado exitosamente",

  "matricula": "20230001",

  "tutorId": "uid\_firebase\_del\_docente",

  "carreraId": "ISC"

}

Este endpoint debe:

1. Crear el usuario en Firebase Auth y Firestore (igual que `POST /users`)  
2. Escribir en el documento Firestore del alumno los campos `tutorId` y `carreraId`  
3. Escribir en el documento Firestore del docente una referencia al alumno (array `tutoradosIds` o subcolección `tutorados`)

Hasta que este endpoint esté disponible, usar como puente temporal `PATCH /carreras/asignar/alumno/{alumnoId}` — ver Parte B.

**Parte B — Solución temporal con endpoints existentes:**

Mientras el backend implementa el endpoint nuevo, el flujo de creación de alumno debe ser de dos pasos en el frontend:

Paso 1: POST /users

Body: { nombre, matricula, password, role: "ALUMNO" }

→ Guardar el uid devuelto

Paso 2: PATCH /carreras/asignar/alumno/{uid\_del\_alumno\_recién\_creado}

Body: (confirmar campos con backend — el DTO está vacío en la spec actual)

→ Asignar carrera y tutorId

**IMPORTANTE:** Antes de implementar el Paso 2, confirmar con el equipo backend los campos exactos de `AsignarAlumnoDto` ya que el Swagger los tiene vacíos. Preguntar si el body espera `{ carreraId, tutorId }` o solo `{ carreraId }`.

**Parte C — Lista de tutorados en el dashboard del DOCENTE:**

Una vez que los alumnos tengan `tutorId` en Firestore, implementar en el dashboard del DOCENTE:

GET /carreras/{carreraId}/alumnos

→ Filtrar en el frontend por alumno.tutorId \=== uid\_del\_docente\_autenticado

→ Mostrar en sección "Mis tutorados" debajo del widget de alertas prioritarias

Cada tarjeta de tutorado debe mostrar: nombre, matrícula, semáforo de riesgo (si existe), y botón para ir al perfil completo del estudiante.

Para el ADMIN, usar `GET /carreras/{id}/alumnos` con el selector de carrera ya existente — mostrar columna "Tutor asignado" con el nombre del docente correspondiente.

---

## BLOQUE 1 — CORRECCIONES URGENTES (⚠️ Discrepancias de ruta)

Corregir estas rutas antes de cualquier otra integración. Son bloqueantes.

### 1.1 — `POST /questionnaire/submit` en `surveys.ts`

**Problema:** El frontend llama a `/surveys/:id/submit`. La ruta correcta es `/questionnaire/submit`. El modelo ML nunca se ha activado desde producción.

**Corrección:**

// surveys.ts — ANTES (incorrecto)

const res \= await apiClient.post(\`/surveys/${id}/submit\`, payload);

// DESPUÉS (correcto)

const res \= await apiClient.post('/questionnaire/submit', {

  respuestas: payload.respuestas  // array de { preguntaId: number, valor: number }

});

// El UID del alumno lo toma el backend del JWT — NO incluir studentId en el body

**Body requerido:**

{

  respuestas: Array\<{ preguntaId: number; valor: number }\> // mínimo 50 items

}

// preguntaId: 1–52

// valor: 0–4 en escala Likert, EXCEPTO preguntaId=10 (num\_integrantes\_familia) que va de 1–10

**Respuesta exitosa (201):**

{

  id: string,              // ID de la evaluación — guardar para llamar /surveys/{id}/resources

  message: string,

  totalPreguntas: number,

  prediccion: {

    studentId: string,

    semaforo: 'rojo' | 'amarillo' | 'revisar' | 'verde',

    riesgo\_pct: number,

    diagnostico: string,

    alerta\_principal: string,

    sugerencia: string,

    focos\_rojos: string\[\]

  }

}

**Casos especiales:**

- Si el ML falla, el backend guarda igual con estado `error_ml` y devuelve `mlError` en la respuesta. La UX debe ser idéntica al envío normal — el alumno no debe saber que el ML falló.  
- La pantalla de confirmación debe decir **"Tus respuestas fueron recibidas"**, NUNCA "Tus datos han sido procesados" (la predicción es asíncrona).

---

### 1.2 — `POST /admin/reports/generate` en `admin.ts`

**Problema:** El frontend usa la ruta `/reports/export` con datos mock. La ruta correcta es `/admin/reports/generate`.

**Corrección:**

// admin.ts — exportAdminReport()

// ANTES: apiClient.post('/reports/export', ...)  \+  datos mock

// DESPUÉS:

const res \= await apiClient.post('/admin/reports/generate', {

  format: 'pdf' | 'excel',          // requerido

  filters: {                          // opcional

    career?: string,                  // ej: "ISC"

    semester?: number,                // ej: 3

    semaforoEstado?: 'rojo' | 'amarillo' | 'revisar' | 'verde'

  }

  // NO enviar includeClinicalData — el backend siempre lo ignora

});

**Respuesta — dos comportamientos según volumen:**

// ≤10,000 alumnos (síncrono):

{ status: 'ready', downloadUrl: string, jobId: string }

// \>10,000 alumnos (asíncrono):

{ status: 'processing', message: string, jobId: string }

**UX requerida:**

- Si `status: 'processing'` → mostrar inmediatamente: *"Tu reporte está siendo generado. Recibirás un correo cuando esté listo."* El botón cambia a "En proceso" con spinner. La UI NO se bloquea.  
- Si `status: 'ready'` → iniciar descarga desde `downloadUrl`.  
- Si el admin filtra por dimensiones de salud → excluir esos campos automáticamente y mostrar advertencia inline.

---

### 1.3 — `POST /encuesta/verificacion/{token}/submit` en `audit.ts`

**Problema:** La ruta en `audit.ts → submitMicroSurvey()` puede ser incorrecta. Verificar y corregir.

**Ruta correcta:** `POST /encuesta/verificacion/{token}/submit`  
**Sin JWT** — esta es la única ruta pública del sistema. No agregar header de autorización.

**Corrección:**

// audit.ts — submitMicroSurvey()

// Esta llamada NO usa apiClient autenticado — usar fetch o instancia sin auth header

const res \= await fetch(

  \`${BASE\_URL}/encuesta/verificacion/${token}/submit\`,

  {

    method: 'POST',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({

      huboSesion: boolean,

      calidadPercibida?: number,  // 1–5, solo si huboSesion \= true

      comentario?: string

    })

  }

);

**Respuesta:**

{ success: true, inconsistencyDetected: false }  // sesión confirmada

{ success: true, inconsistencyDetected: true }   // discrepancia → backend reabre alerta automáticamente

**UX:** Esta pantalla es de acceso público (link en email). Diseño mobile-first, tono empático, máximo 3 preguntas. El estudiante nunca debe ver mensajes de error técnicos.

---

## BLOQUE 2 — MOCK → REAL: Core del sistema (🟡 Alertas y Estudiantes)

Descomentar las llamadas reales en los archivos indicados y eliminar los mocks.

### 2.1 — `GET /alerts/priority` — `alerts.ts` línea 90

// Descomentar y conectar:

const res \= await apiClient.get('/alerts/priority');

// Tipo de respuesta:

interface PriorityAlertsResponse {

  aiEngineStatus: 'ok' | 'unavailable';

  lastUpdatedAt: string; // ISO 8601

  alerts: Array\<{

    id: string;

    studentId: string;

    studentName: string;

    studentPhoto: string | null;

    semaforoEstado: 'rojo' | 'amarillo' | 'verde' | 'revisar' | 'sin-datos';

    etiquetaOperativa: string;

    status: 'nueva' | 'en-seguimiento' | 'derivada-psicologia' | 'derivada-medicina' | 'resuelta';

    isRead: boolean;

    updatedAt: string;

  }\>;

}

**Reglas UX críticas — no negociables:**

- Máximo 5 tarjetas. El backend ya las ordena de mayor a menor urgencia.  
- Si `alerts: []` → mostrar estado vacío: *"Todos tus tutorados están en seguimiento normal"* con ícono de verificación verde. NUNCA pantalla en blanco.  
- Si `aiEngineStatus: 'unavailable'` → mostrar banner en la parte superior del widget: *"Datos actualizados al \[HH:MM\]. Motor de análisis temporalmente no disponible."* (extraer hora de `lastUpdatedAt`).  
- Si `semaforoEstado: 'revisar'` → mostrar ícono "Ojo" en lugar del semáforo estándar.  
- Los scores numéricos **NUNCA** se muestran al DOCENTE — solo `etiquetaOperativa`.  
- `isRead` viene del backend pero no hay endpoint para marcarlo. Actualizar visualmente a "leído" cuando el tutor navega al perfil del estudiante o registra un followup.  
- Latencia objetivo p95 \< 1.5 s (datos pre-computados — no hacer llamadas adicionales al ML en esta carga).

---

### 2.2 — `POST /alerts/{id}/followup` — `alerts.ts` línea 110

// Descomentar y conectar:

const res \= await apiClient.post(\`/alerts/${alertId}/followup\`, {

  contenido: string  // mínimo 30 caracteres

});

// Respuesta:

{

  id: string,

  alertId: string,

  contenido: string,

  registeredBy: string,

  registeredAt: string,

  newAlertStatus: 'en-seguimiento'

}

**UX:** Validar los 30 caracteres en el frontend antes de llamar al endpoint. Mostrar contador de caracteres en tiempo real. El botón "Guardar" permanece deshabilitado hasta cumplir el mínimo.

---

### 2.3 — `PUT /alerts/{id}/close` — `alerts.ts` línea 136

// Descomentar y conectar:

const res \= await apiClient.put(\`/alerts/${alertId}/close\`, {

  evidencia: string,       // mínimo 30 caracteres

  tipoResolucion: string   // ej: "seguimiento-completado" | "derivacion-exitosa" | "falsa-alarma"

});

// Respuesta:

{

  alertId: string,

  newStatus: 'resuelta',

  closedAt: string,

  microSurveyScheduled: true  // el backend programa la micro-encuesta en 24h automáticamente

}

**UX:**

- No mostrar el diálogo de confirmación hasta que `evidencia` tenga ≥30 caracteres.  
- Al cierre exitoso → mostrar snackbar/toast: *"Alerta cerrada. Se enviará encuesta de verificación al estudiante en 24 horas."*  
- Cambio de estado visual inmediato en la tarjeta.

---

### 2.4 — `GET /students/{id}/risk-profile` — `students.ts` línea 178

// Descomentar y conectar:

const res \= await apiClient.get(\`/students/${studentId}/risk-profile\`);

// Tipo de respuesta para rol DOCENTE:

interface RiskProfile {

  id: string;

  name: string;

  matricula: string;

  carrera: string;

  semestre: number;

  tutor: string;

  academico: { semaforoEstado: string; etiquetaOperativa: string };

  socioeconomico: { semaforoEstado: string; etiquetaOperativa: string };

  salud: { semaforoEstado: string; recomendacionOperativa: string };

  // NOTA: 'diagnosticoClinico' nunca aparece en la respuesta para DOCENTE

  alertHistory: Array\<{ id: string; etiquetaOperativa: string; status: string; updatedAt: string }\>;

  encuestaCompletada: boolean;

}

**Reglas de privacidad críticas:**

- El campo `diagnosticoClinico` **NUNCA** aparece en el HTML/DOM para rol DOCENTE — ni como null, ni como vacío, ni con placeholder. El campo no existe en la respuesta del backend para este rol.  
- En la dimensión de salud, mostrar SOLO `salud.recomendacionOperativa` \+ `salud.semaforoEstado`.  
- Si `encuestaCompletada: false` → mostrar *"Variables personales: pendientes"* y deshabilitar la dimensión socioeconómica. Mostrar botón prominente "Reenviar encuesta".

---

### 2.5 — `GET /students/{id}/academic-history` — `students.ts` línea 192

// Descomentar y conectar:

const res \= await apiClient.get(\`/students/${studentId}/academic-history\`);

// Respuesta ya formateada para Recharts:

{

  studentId: string,

  asistencia: Array\<{ mes: string; porcentaje: number }\>,      // últimos 6 meses

  calificaciones: Array\<{ materia: string; promedio: number }\>,

  promedioGeneral: number,

  asistenciaGeneral: number

}

**UX:** Renderizar gráfica de línea para calificaciones y gráfica de barras para asistencia. El semáforo nunca usa el color como único diferenciador (WCAG AA) — siempre incluir ícono \+ texto semántico junto al color.

---

### 2.6 — `GET /surveys/{id}/resources` — `surveys.ts` línea 112

// Descomentar y conectar:

// id \= ID de la evaluación devuelto por POST /questionnaire/submit

const res \= await apiClient.get(\`/surveys/${evaluacionId}/resources\`);

// Respuesta:

Array\<{

  id: string;

  title: string;

  description: string;

  icon: string;

  location: string;

  phone: string;

}\>

// La respuesta NUNCA incluye pendienteVerificacion ni confiable

// Si no hay recursos en Firestore → devuelve catálogo base predeterminado

**UX:** Mostrar recursos en pantalla de confirmación post-encuesta. Al menos un recurso visible. Los recursos son contextuales según las respuestas del alumno (el backend ya los filtra).

---

## BLOQUE 3 — MOCK → REAL: Derivaciones (🟡)

Todos los servicios existen en `referrals.ts`. Reemplazar mocks con llamadas reales.

### 3.1 — `GET /referrals/capacity/psychology`

const res \= await apiClient.get('/referrals/capacity/psychology');

// Respuesta:

{ currentLoad: number; maxCapacity: number; isSaturated: boolean; estimatedWaitDays?: number }

**UX:** Llamar a este endpoint ANTES de mostrar el botón "Derivar a psicología" o al hacer clic en él. Los botones "Derivar a psicología" y "Derivar a servicios médicos" deben estar deshabilitados hasta que exista una alerta activa en el perfil del estudiante.

Si `isSaturated: true` → mostrar: *"El departamento de psicología está al máximo de capacidad. Tu derivación está en espera — el administrador ha sido notificado."* \+ `estimatedWaitDays` si está disponible.

---

### 3.2 — `POST /referrals/psychology` y `POST /referrals/medical`

// Mismo body para ambos endpoints:

const res \= await apiClient.post('/referrals/psychology', {  // o '/referrals/medical'

  studentId: string,

  alertId: string,

  motivoId: string,          // requerido — dropdown del catálogo

  descripcionObservable: string

});

// Respuesta:

{ id: string; status: 'pending'; createdAt: string }

**UX crítica:**

- `motivoId` es obligatorio. Sin él, el psicólogo no puede aceptar el caso.  
- En el campo `descripcionObservable`: detectar términos clínicos en el frontend (lista: "depresión", "ansiedad", "diagnóstico", "trastorno", "patología", "síndrome") y mostrar advertencia inline: *"Describe comportamientos observables, evita diagnósticos."* Sin bloquear el envío.

---

### 3.3 — `GET /referrals/pending`

const res \= await apiClient.get('/referrals/pending');

// Respuesta (array):

Array\<{

  id: string;

  studentId: string;

  studentName: string;

  motivoId: string;

  descripcionObservable: string;

  createdAt: string;

  department: 'psychology' | 'medical';

  aiValidation: {

    isAutoReport: boolean;

    symptomatologyDetected: boolean;

    confidence?: number;  // SOLO visible para PSICOLOGO — no renderizar para otros roles

  }

}\>

**UX:** No renderizar `aiValidation.confidence` para roles distintos a PSICOLOGO.

---

### 3.4 — `PUT /referrals/{id}/accept`

const res \= await apiClient.put(\`/referrals/${referralId}/accept\`, {

  referralId: string,

  observacionesAceptacion?: string

});

// Respuesta:

{ referralId: string; status: 'accepted'; acceptedAt: string }

**UX:** Si la derivación fue creada sin `motivoId` → el botón "Aceptar caso" debe estar deshabilitado con tooltip: *"El tutor debe completar el motivo antes de que puedas aceptar este caso."* El backend notifica al tutor automáticamente al aceptar.

---

### 3.5 — `POST /referrals/{id}/notes`

const res \= await apiClient.post(\`/referrals/${referralId}/notes\`, {

  referralId: string,

  contenido: string,

  esPrivada: boolean,

  recomendacionOperativa?: string  // solo si esPrivada \= false, visible para el tutor

});

// Respuesta:

{ id: string; referralId: string; esPrivada: boolean; savedAt: string }

**UX:**

- Cuando `esPrivada: true` → cambiar el fondo del editor a color diferenciado (indicador visual de confidencialidad).  
- Botón "Publicar recomendación para el Tutor" separado del botón de guardar nota privada.  
- Mostrar vista previa de lo que verá el tutor antes de publicar.  
- Para rol ADMIN consultando el expediente → mostrar solo: *"Intervención psicológica activa — contenido confidencial"* \+ ícono candado. Sin acceso al contenido.

---

## BLOQUE 4 — MOCK → REAL: Auditoría (🟡)

### 4.1 — `GET /audit/inconsistencies` — `audit.ts`

const res \= await apiClient.get('/audit/inconsistencies');

// Respuesta (array):

Array\<{

  id: string;

  alertId: string;

  tutorId: string;

  tutorName: string;

  studentId: string;

  studentName: string;

  detectedAt: string;

  severity: 'normal' | 'critical';  // 'critical' si el tutor acumula 3+ en el ciclo

  discrepancyType: string;

  tutorReported: string;

  studentReported: string;

  isResolved: boolean;

}\>

**UX:** Si `severity: 'critical'` → mostrar badge rojo en el nombre del tutor y registrar en el reporte de gestión mensual. Este módulo **NUNCA** es accesible para DOCENTE — son módulos separados con navegación separada.

---

### 4.2 — `GET /audit/tutors/{id}/history` — `audit.ts`

const res \= await apiClient.get(\`/audit/tutors/${tutorId}/history\`);

// Respuesta:

{

  tutorId: string;

  tutorName: string;

  totalInterventions: number;

  inconsistenciesCount: number;

  criticalStatus: boolean;

  lastDiscrepancyDate: string;

}

**UX:** Vista de solo lectura, sin opción de edición.

---

### 4.3 — `PUT /audit/inconsistencies/{id}/resolve` — `audit.ts`

**Problema adicional:** La ruta en el frontend puede ser incorrecta. Verificar y corregir.

// Ruta correcta:

const res \= await apiClient.put(\`/audit/inconsistencies/${inconsistencyId}/resolve\`, {

  action: 'resolve' | 'escalate',

  observaciones?: string

});

// Respuesta: { success: boolean }

---

## BLOQUE 5 — ENDPOINTS NUEVOS: Ausentes (❌)

Crear los servicios desde cero en los archivos indicados.

### 5.1 — `GET /users/{id}` → agregar en `users.ts`

// Nuevo método: userService.getById(uid: string)

const res \= await apiClient.get(\`/users/${uid}\`);

// Respuesta:

{ uid: string; nombre: string; role: string; matricula?: string; email?: string; status: string }

Usar en: pantalla de perfil de usuario, drill-down de admin, vista de tutor en derivaciones.

---

### 5.2 — `GET /audit/micro-surveys/{alertId}/status` → agregar en `audit.ts`

// Nuevo método: auditService.getMicroSurveyStatus(alertId: string)

const res \= await apiClient.get(\`/audit/micro-surveys/${alertId}/status\`);

// Respuesta:

{

  id: string;

  status: 'pending' | 'no-contact' | 'expired' | 'completed';

  data: {

    studentName: string;

    tutorName: string;

    alertCategory: string;

    expiresAt: string;

  }

}

**UX:** Si `status: 'no-contact'` → notificar al admin: *"Estudiante \[nombre\] sin datos de contacto verificados. Se requiere actualización."*  Si `status: 'expired'` → la alerta permanece cerrada, no reabrir.

---

### 5.3 — Cuestionario: tres endpoints nuevos → crear `questionnaire.ts`

// 1\. GET /questionnaire/mis-evaluaciones — solo ALUMNO

//    El UID se toma del JWT — no enviar parámetros

const res \= await apiClient.get('/questionnaire/mis-evaluaciones');

// 2\. GET /questionnaire/alumno/{uid} — ADMIN y DOCENTE

const res \= await apiClient.get(\`/questionnaire/alumno/${uid}\`);

// 3\. GET /questionnaire/todas — solo ADMIN

const res \= await apiClient.get('/questionnaire/todas');

// Respuesta (igual estructura para los tres):

Array\<{

  id: string;

  alumnoId: string;

  nombre: string;

  matricula: string;

  totalPreguntas: number;

  fecha: string;

  estado: 'procesado' | 'error\_ml' | 'pendiente';

  resultado?: {

    semaforo: 'rojo' | 'amarillo' | 'revisar' | 'verde';

    riesgo\_pct: number;

    diagnostico: string;

  }

}\>

---

### 5.4 — Carreras: cinco endpoints nuevos → agregar en `admin.ts`

// 1\. GET /carreras/{id}

const res \= await apiClient.get(\`/carreras/${carreraId}\`);

// 2\. GET /carreras/{id}/alumnos  (paginado)

const res \= await apiClient.get(\`/carreras/${carreraId}/alumnos\`);

// Usar esta respuesta para construir la lista de tutorados del DOCENTE

// Filtrar por alumno.tutorId \=== uid\_del\_docente\_autenticado

// 3\. GET /carreras/{id}/docentes  (paginado)

const res \= await apiClient.get(\`/carreras/${carreraId}/docentes\`);

// 4\. PATCH /carreras/asignar/docente/{docenteId}

// ⚠️ CONFIRMAR campos del body con backend — AsignarDocenteDto está vacío en Swagger

const res \= await apiClient.patch(\`/carreras/asignar/docente/${docenteId}\`, {

  carreraId: string  // campo probable — confirmar antes de implementar

});

// 5\. PATCH /carreras/asignar/alumno/{alumnoId}

// ⚠️ CONFIRMAR campos del body con backend — AsignarAlumnoDto está vacío en Swagger

const res \= await apiClient.patch(\`/carreras/asignar/alumno/${alumnoId}\`, {

  carreraId: string,   // campo probable

  tutorId: string      // campo probable — confirmar antes de implementar

});

---

## BLOQUE 6 — Reglas transversales (aplicar en todos los endpoints)

### Sistema de semáforo

El semáforo **NUNCA** usa el color como único diferenciador (WCAG AA). Siempre: ícono \+ color \+ texto semántico.

| `semaforoEstado` | Color | Ícono | Texto |
| :---- | :---- | :---- | :---- |
| `rojo` | \#C0392B | triángulo con \! | `etiquetaOperativa` del backend |
| `amarillo` | \#F39C12 | círculo con \! | `etiquetaOperativa` del backend |
| `verde` | \#27AE60 | círculo con ✓ | "En seguimiento normal" |
| `revisar` | \#8E44AD | ojo | "Datos pendientes de verificación" |
| `sin-datos` | \#95A5A6 | reloj | "Sin encuesta completada" |

### Privacidad diferencial — no negociables

- `diagnosticoClinico` **NUNCA** aparece en el DOM para rol DOCENTE — ni como null, ni como campo vacío, ni con placeholder.  
- Los scores numéricos del Motor de IA **NUNCA** se muestran al DOCENTE — solo `etiquetaOperativa`.  
- El módulo de auditoría (`/audit/*`) **NUNCA** es accesible para DOCENTE — son módulos con navegación separada.  
- El módulo médico debe tener color de interfaz diferenciado (tonos verdes) e ícono de escudo en el encabezado.  
- `aiValidation.confidence` en derivaciones — solo renderizar para rol PSICOLOGO.

### Modo degradado del Motor de IA

Cuando `aiEngineStatus: 'unavailable'` en `/alerts/priority`:

- Mostrar banner con timestamp de los últimos datos disponibles.  
- Permitir que el DOCENTE acceda a perfiles y registre seguimientos manualmente.  
- No generar nuevas alertas basadas en scores durante el período de degradación.

### Comportamiento offline — encuesta estudiantil

- PWA con Service Worker \+ IndexedDB (ya requerido por RT-02).  
- Al perder conexión: banner no intrusivo *"Sin conexión — tus respuestas están guardadas"*. El formulario sigue siendo operable.  
- Al reconectar: reintento automático y banner *"Conexión restaurada — tus respuestas se enviaron correctamente"*. Sin intervención del usuario.

### Logout

No existe endpoint de logout en el backend. Al cerrar sesión: limpiar el token del estado del cliente y redirigir a `/login`.

---

## Checklist de entrega

**P0 — Correcciones de ruta (bloqueantes):**

- [ ] Corregir `POST /questionnaire/submit` en `surveys.ts`  
- [ ] Corregir `POST /admin/reports/generate` en `admin.ts`  
- [ ] Verificar y corregir `POST /encuesta/verificacion/{token}/submit` en `audit.ts`

**P0.5 — Problema estructural:**

- [ ] Solicitar al backend `POST /users/alumno-completo` con campos `tutorId` y `carreraId`  
- [ ] Confirmar campos de `AsignarAlumnoDto` y `AsignarDocenteDto` con backend  
- [ ] Implementar flujo de dos pasos temporal para creación de alumno con asignación  
- [ ] Agregar sección "Mis tutorados" en dashboard del DOCENTE (filtrar `/carreras/{id}/alumnos` por `tutorId`)  
- [ ] Agregar columna "Tutor asignado" en vista de alumnos del ADMIN

**P1 — Mock → Real (core):**

- [ ] `GET /alerts/priority`  
- [ ] `POST /alerts/{id}/followup`  
- [ ] `PUT /alerts/{id}/close`  
- [ ] `GET /students/{id}/risk-profile`  
- [ ] `GET /students/{id}/academic-history`  
- [ ] `GET /surveys/{id}/resources`

**P2 — Mock → Real (derivaciones y auditoría):**

- [ ] `GET /referrals/capacity/psychology`  
- [ ] `POST /referrals/psychology`  
- [ ] `POST /referrals/medical`  
- [ ] `GET /referrals/pending`  
- [ ] `PUT /referrals/{id}/accept`  
- [ ] `POST /referrals/{id}/notes`  
- [ ] `GET /audit/inconsistencies`  
- [ ] `GET /audit/tutors/{id}/history`  
- [ ] `PUT /audit/inconsistencies/{id}/resolve`

**P3 — Endpoints ausentes (nuevos):**

- [ ] `GET /users/{id}`  
- [ ] `GET /questionnaire/mis-evaluaciones`  
- [ ] `GET /questionnaire/alumno/{uid}`  
- [ ] `GET /questionnaire/todas`  
- [ ] `GET /audit/micro-surveys/{alertId}/status`  
- [ ] `GET /carreras/{id}`  
- [ ] `GET /carreras/{id}/alumnos`  
- [ ] `GET /carreras/{id}/docentes`  
- [ ] `PATCH /carreras/asignar/docente/{docenteId}` *(pendiente confirmación de body)*  
- [ ] `PATCH /carreras/asignar/alumno/{alumnoId}` *(pendiente confirmación de body)*

