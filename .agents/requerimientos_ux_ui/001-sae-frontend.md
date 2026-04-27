> Sistema Inteligente de Acompañamiento Estudiantil  
> Monkora · Rodrigo Osorio Rojas · Abril 2026  
> Versión 1.0 | Basado en 75 requerimientos UX/UI · 23 HU · ISO/IEC 25010

---

## 1. Resumen del Sistema

El **SIAE** es una plataforma educativa de acompañamiento estudiantil con **privacidad diferencial por rol**. El mismo dato produce vistas distintas según el actor autenticado. Esta restricción es el driver arquitectónico más importante y condiciona todas las decisiones de diseño de componentes.

**Stack de contexto relevante:**
- Autenticación: SSO delegado a LDAP/AD institucional (SAML 2.0 / OIDC). No hay gestión propia de contraseñas.
- Motor de IA: sistema externo (caja negra). Puede no responder. Siempre diseñar estado degradado.
- Encuesta estudiantil: PWA con Service Worker + IndexedDB. Funciona offline.
- Datos clínicos: cifrados AES-256 en reposo. La transformación diagnóstico→etiqueta ocurre **en servidor**, nunca en cliente.

---

## 2. Actores y sus Dashboards

| Actor | Ruta sugerida | Acceso a datos clínicos | Notas clave |
|---|---|---|---|
| `tutor` | `/tutor/dashboard` | ❌ Solo etiqueta operativa | Scores de IA nunca visibles |
| `estudiante` | `/encuesta` | ❌ Solo sus propios datos | Mobile-first, offline-capable |
| `administrador` | `/admin/dashboard` | ❌ Solo KPIs agregados | Sin datos clínicos individuales |
| `psicologo` | `/psicologo/casos` | ✅ Expediente completo | Notas privadas cifradas |
| `medico` | `/medico/captura` | ✅ Diagnósticos clínicos | Interfaz diferenciada (tonos verdes) |

---

## 3. Sistema de Diseño

### 3.1 Paleta de colores

```css
/* Colores primarios */
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

/* Semáforo de riesgo — ver sección 4 */
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

/* Color de Tipografía */
--text-primary: #1E293B;
--text-secondary: #475569;
--text-muted: #94A3B8;
--text-inverse: #FFFFFF;

/* Estados UI */
 --state-hover: #F1F5F9;
--state-active: #E2E8F0;
--state-disabled: #CBD5E1;

/* Estados */
--color-warning:          #F39C12;
--color-success:          #27AE60;
--color-error:            #E74C3C;
```

### 3.2 Tipografía

```css
/* Fuente principal */
font-family: 'Inter', 'Roboto', system-ui, sans-serif;

/* Escala */
--text-xs:   12px; /* Solo captions y labels de formulario */
--text-sm:   14px; /* Texto secundario */
--text-base: 16px; /* Cuerpo — tamaño mínimo de lectura */
--text-lg:   18px; /* Subtítulos, labels destacados */
--text-xl:   20px; /* Títulos de sección */
--text-2xl:  24px; /* Headings H3 */
--text-3xl:  28px; /* Headings H2 */
--text-4xl:  32px; /* Headings H1 */
```

### 3.3 Espaciado y Accesibilidad

```css
/* Touch targets — móvil */
--touch-min:        44px;  /* Mínimo absoluto WCAG */
--touch-recommended: 48px; /* Recomendado */
--touch-gap-min:    8px;   /* Separación mínima entre elementos interactivos */

/* Contraste mínimo WCAG AA */
/* Texto normal: 4.5:1 sobre fondo */
/* Texto grande (>18px bold): 3:1 sobre fondo */
```

---

## 4. Componente: Semáforo de Riesgo (`<RiskIndicator />`)

El semáforo es el componente visual más crítico. **Nunca usar color como único diferenciador.**

### Estados y especificación

| Estado | Color | Icono | Texto semántico | Cuándo usarlo |
|---|---|---|---|---|
| `high` | `#C0392B` | `⚠ triángulo + !` | Etiqueta orientada a la acción | Score alto, alerta activa |
| `medium` | `#F39C12` | `● círculo + !` | Etiqueta de seguimiento | Score medio, atención requerida |
| `low` | `#27AE60` | `● círculo + ✓` | "En seguimiento normal" | Sin alertas activas |
| `unverified` | `#8E44AD` | `👁 ojo` | "Requiere verificación" | Dato no confiable o contradicción detectada |
| `no-data` | `#95A5A6` | `🕐 reloj` | "Variables personales: pendientes" | Sin encuesta completada |
| `degraded` | `#F39C12` | `⚠ + timestamp` | "Datos al [HH:MM]. Motor no disponible." | Circuit Breaker abierto |

### Reglas de uso
- El estado `unverified` **nunca coexiste** con los estados `high/medium/low`. Es un reemplazo.
- En la vista del rol `tutor`, la dimensión de salud solo puede mostrar `low/medium/high/no-data`. Nunca muestra el diagnóstico.
- En modo degradado, mostrar el **último score pre-computado** con indicador temporal.
- **Etiquetas de riesgo nunca dicen** "alto riesgo de abandono". Siempre orientadas a la acción: "Requiere apoyo en Matemáticas", "Apoyo económico disponible", etc.

### Props sugeridos

```ts
type RiskStatus = 'high' | 'medium' | 'low' | 'unverified' | 'no-data' | 'degraded';

interface RiskIndicatorProps {
  status: RiskStatus;
  label: string;          // Etiqueta operativa del catálogo (nunca el diagnóstico)
  updatedAt?: Date;       // Requerido si status === 'degraded'
  expandable?: boolean;   // Permite ver dimensiones secundarias
}
```

---

## 5. Módulo: Dashboard del Tutor (`/tutor/dashboard`)

### Widget de Atención Prioritaria

- Renderizado desde **scores pre-computados** (no on-demand al Motor de IA).
- Tiempo de carga objetivo: **p95 < 1.5 s**.
- Máximo **5 tarjetas** ordenadas por score descendente.
- Cada tarjeta: nombre, foto (opcional), `<RiskIndicator />`, etiqueta de acción.

**Estados del widget:**

```
Estado normal     → Hasta 5 tarjetas con semáforo
Estado vacío      → "Todos tus tutorados están en seguimiento normal" + icono ✓ verde
Estado degradado  → Banner superior: "Datos actualizados al HH:MM. Motor temporalmente no disponible."
Estado con dato ¿ → Tarjeta con icono 👁 en lugar de semáforo
```

**Regla crítica:** El campo `score` (número crudo del Motor de IA) **nunca llega al frontend del tutor**. Solo llega la `actionLabel` del catálogo configurable. Validar en API Gateway / BFF.

### Perfil de Riesgo del Estudiante

Secciones del perfil para el rol `tutor`:

```
/tutor/estudiante/:id
├── Dimensión Académica
│   ├── Gráfica de línea: calificaciones por materia (semestre actual / histórico)
│   └── Gráfica de barras: asistencia
├── Dimensión Socioeconómica
│   ├── Visible solo si encuesta completada
│   └── Estado "Variables pendientes" + botón "Reenviar encuesta" si no hay datos
├── Dimensión de Salud
│   ├── Solo muestra: RiskIndicator + etiqueta operativa
│   ├── Campo 'diagnóstico' NO existe en el DOM (no hidden, no vacío — ausente)
│   └── Tooltip del candado: "Dato clínico confidencial — gestionado por Medicina"
└── Historial de alertas
    └── Timeline vertical: fecha / tipo / estado (Nueva|En seguimiento|Resuelta|Derivada)
```

### Flujo de Registro de Seguimiento

```
Click "Registrar seguimiento"
  → Formulario inline (no modal)
  → Campo texto: mínimo 30 caracteres (contador en tiempo real)
  → Botón "Guardar" disabled hasta cumplir requisito
  → Post-guardado: toast "Seguimiento registrado. Estado → En seguimiento"

Click "Marcar como Resuelta" (alerta crítica)
  → Validación: texto ≥ 30 chars
  → Si válido: modal de confirmación → cierre → toast "Se enviará micro-encuesta en 24h"
  → Si inválido: error inline, sin modal

Reapertura por inconsistencia
  → Badge "Inconsistencia detectada" (rojo) en la tarjeta
  → Notificación in-app al tutor
```

---

## 6. Módulo: Encuesta Estudiantil (`/encuesta`) — Mobile First

### Requisitos de implementación

- **PWA** con Service Worker registrado en la raíz.
- Respuestas guardadas en **IndexedDB** (no localStorage).
- Reintento automático al reconectar. Sin intervención del usuario.
- Tiempo mínimo de completado: **60 segundos** (validado en backend, invisible al usuario).

### Flujo de pantallas

```
1. Bienvenida empática
   → Mensaje personalizado + tiempo estimado "aprox. 3-5 minutos"
   → Sin tecnicismos

2. Consentimiento (RC-03 obligatorio)
   → Texto en lenguaje claro
   → Botones: "Acepto y continuar" / "No, gracias"
   → El rechazo explica consecuencias sin presionar

3. Formulario por secciones
   → Barra de progreso siempre visible: "2 de 4: Hábitos"
   → Una pregunta por pantalla en móvil
   → Controles: tarjetas grandes (no radio pequeños), sliders, texto simple
   → Sin autocompletado en campos de texto

4. Confirmación
   → Mensaje personalizado con nombre
   → Al menos 1 recurso institucional relevante según respuestas
   → Sin indicación de validación pendiente (UX idéntica aunque dato sea no-confiable)
```

### Estados de conectividad (UI)

```
Offline detectado  → Banner no intrusivo: "Sin conexión — tus respuestas están guardadas"
                     Formulario sigue operable
Reconexión         → Banner: "Conexión restaurada — tus respuestas se enviaron correctamente"
                     Sin acción requerida del usuario
Error de enlace    → Página: "Este enlace expiró" + botón "Solicitar nuevo enlace"
                     Solo si han pasado > 7 días desde el envío
```

---

## 7. Módulo Médico (`/medico`) — Interfaz Diferenciada

### Indicadores visuales del módulo

- **Color de interfaz**: tonos verdes (`--color-medical-bg`, `--color-medical-accent`).
- **Ícono de escudo** en el header: "Datos de salud — Acceso exclusivo para personal médico".
- Distinguir visualmente de todos los demás módulos del sistema.

### Privacidad diferencial — regla de implementación

```
API /api/estudiante/:id/salud

  Si rol === 'medico' o rol === 'psicologo':
    → Retorna: { diagnostico, etiquetaOperativa, semaforo }

  Si rol === 'tutor' o rol === 'administrador':
    → Retorna: { etiquetaOperativa, semaforo }
    → Campo 'diagnostico' NO incluido en la respuesta (no null, no undefined — ausente)

Esta lógica vive en el servidor (BFF/API Gateway).
El frontend no puede "revelar" lo que el servidor no envía.
```

### Captura masiva

```
/medico/captura
  → Selector de grupo/carrera (filtrable)
  → Tabla: fila por estudiante, columnas por condición clínica (checkboxes)
  → Botón "Guardar todo" al final
  → Si estudiante tiene expediente del ciclo actual:
      Modal: "Expediente existente — ¿Actualizar?" + resumen de cambios
  → Si condición sin traducción en catálogo:
      Inline: "Condición registrada. Admin será notificado para configurar etiqueta."
      No bloquear el guardado.
```

---

## 8. Módulo de Derivaciones

### Flujo desde el Tutor

```
Perfil estudiante → botones "Derivar a Psicología" / "Derivar a Medicina"
  → Disabled si no hay alerta activa en el perfil

Modal de derivación:
  → Selector de motivo (catálogo, obligatorio)
  → Campo observaciones con placeholder: "Describe comportamientos observables
     (ej. ausentismo frecuente, bajo ánimo)"
  → Validación de términos clínicos (ej. "depresión", "ansiedad"):
      Warning inline: "Describe comportamientos observables, evita diagnósticos."
      No bloquear el envío.

Si psicología está saturada (QA-12):
  → "El departamento está al máximo de capacidad.
     Tu derivación está en espera — el administrador ha sido notificado."
  → No mostrar error. La derivación queda en cola.
```

### Gestión de casos — Psicólogo

```
/psicologo/casos
  → Lista de casos pendientes: prioridad / motivo / estudiante / tutor origen
  → Botón "Aceptar caso" disabled si falta motivo en el catálogo
    Tooltip: "El tutor debe completar el motivo antes de que puedas aceptar."

Expediente del caso:
  → El psicólogo ve: historial académico + datos sensibles del formulario + diagnósticos médicos
  → Editor de nota clínica:
      Toggle "Nota privada" (candado visible)
      Cuando activo: fondo del editor cambia a color diferenciado
      Guardado de nota privada ≠ publicación de recomendación al tutor
  → Botón separado: "Publicar recomendación para el Tutor"
      Vista previa de lo que verá el tutor antes de publicar

Vista del Administrador en el mismo expediente:
  → Solo ve: "Intervención psicológica activa — contenido confidencial" + icono candado
  → Sin acceso al contenido de notas privadas
```

---

## 9. Panel Ejecutivo (`/admin/dashboard`)

### KPIs principales

```
Layout superior (tarjetas numéricas):
  → Índice de riesgo global + tendencia vs. período anterior (↑↓)
  → Alertas atendidas vs. ignoradas
  → Comparativa por carrera

Badge de frescura de datos (QA-04):
  → "Actualizado hace X minutos"
  → Si > 5 minutos: badge cambia a color de advertencia (--color-warning)

Filtros persistentes:
  → Carrera + Semestre
  → Actualización reactiva de todas las gráficas
  → Estado vacío: "Sin datos suficientes para este segmento"
```

### Drill-down

```
Click en barra del gráfico que supera umbral:
  → Panel lateral con lista de estudiantes en riesgo
  → Variables predominantes: "80% de este riesgo es por factor económico"
  → Link a perfil individual de cada estudiante
  → Botón "← Volver al dashboard" conserva filtros activos
```

### Exportación (QA-10)

```
Botón "Generar reporte" → selector PDF / Excel

Excel:
  → Una fila por estudiante, variables agregadas
  → SIN campos clínicos (excluir automáticamente, sin opción del admin)
  → Si filtro genera > 10,000 filas:
      Respuesta inmediata: "Tu reporte está siendo generado. Recibirás un correo."
      Botón → estado "En proceso" con spinner
      UI no se bloquea (proceso asíncrono en worker)

PDF:
  → Previsualización del layout antes de generar
  → Generado en < 30 s para datasets normales
```

---

## 10. Módulo de Auditoría (`/admin/auditoria`)

> Este módulo es técnicamente independiente del módulo de alertas (RP-02).
> No debe ser navegable desde el dashboard del Tutor.

```
Panel de inconsistencias:
  → Lista de alertas reabiertas por discrepancia
  → Detalle: caso / tutor involucrado / fecha

Historial por tutor:
  → Timeline: cierres de alertas / estado de micro-encuestas / inconsistencias
  → Vista de solo lectura

Badge de desempeño crítico:
  → Si tutor acumula ≥ 3 inconsistencias en el ciclo:
      Badge rojo en nombre del tutor
      Entrada automática en reporte de gestión mensual
```

### Micro-encuesta de verificación

```
Enviada automáticamente 24h post-cierre de alerta crítica.
Diseño idéntico a encuesta principal: mobile-first, barra de progreso, tono empático.
Máximo 3 preguntas.

Si estudiante no responde en 48h:
  → Alerta permanece cerrada
  → Log: "Micro-encuesta no respondida"

Si estudiante no tiene canal verificado:
  → Notificación al Admin: "Estudiante [nombre] sin datos de contacto verificados."
```

---

## 11. Sistema de Notificaciones In-App

### Categorías y colores

| Categoría | Color | Casos de uso |
|---|---|---|
| Alertas de riesgo | Rojo `#C0392B` | Nueva alerta generada, reapertura por inconsistencia |
| Derivaciones | Azul `#2E75B6` | Caso recibido, caso aceptado, saturación de capacidad |
| Auditoría | Naranja `--color-warning` | Inconsistencia de servicio, desempeño crítico |
| Informativas | Gris `#95A5A6` | Actualizaciones del sistema, avisos administrativos |

### Comportamiento de toasts/snackbars

```
Duración: 5 segundos (no bloqueantes)
Posición:
  Desktop → inferior-derecha
  Móvil   → parte superior

Consolidación: si llega actualización de notificación no leída del mismo estudiante,
actualizar la existente con badge "Actualizada" en lugar de crear nueva.
```

---

## 12. Accesibilidad — Checklist de Implementación

- [ ] Todos los íconos funcionales tienen `aria-label` o `<title>`. Decorativos: `aria-hidden="true"`.
- [ ] Navegación completa con `Tab`. Activación con `Enter`/`Space`. `focus-visible` ring siempre visible.
- [ ] El semáforo siempre incluye: **color + ícono + texto semántico** (nunca solo color).
- [ ] Mensajes de error asociados al campo con `aria-describedby`. Anunciados automáticamente.
- [ ] Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande (>18px bold).
- [ ] Touch targets mínimo 44×44 px. Separación mínima entre interactivos: 8 px.
- [ ] Tipografía base mínima 16 px en cuerpo. 14 px para texto secundario. 12 px solo para captions.

---

## 13. Reglas Críticas — Lo que el Diseño NO puede hacer

Estas restricciones son no negociables. Cualquier propuesta que las contradiga debe revisarse con el arquitecto antes de implementar.

| ❌ Prohibido | ✅ Correcto |
|---|---|
| Mostrar el score numérico del Motor de IA al Tutor | Mostrar solo la etiqueta operativa del catálogo |
| Mostrar el campo "diagnóstico" en el DOM del rol Tutor | Omitir el campo completamente (no ocultar con CSS) |
| Usar un popup/modal descartable para el consentimiento | Pantalla completa en el flujo de primera vez |
| Decir "Tus datos han sido procesados" en la confirmación de encuesta | "Tus respuestas fueron recibidas" |
| Mostrar el campo diagnóstico vacío o como placeholder | El campo no existe en la respuesta de la API |
| Navegar al módulo de auditoría desde el dashboard del Tutor | Módulos separados con acceso diferenciado |
| Generar un reporte Excel con columnas de datos clínicos | Excluir automáticamente sin opción del admin |
| Usar color como único diferenciador en el semáforo | Color + ícono + texto semántico siempre |
| Dashboard del Tutor con llamada síncrona al Motor de IA al cargar | Scores pre-computados en caché |

---

## 14. Resumen de Requerimientos por Módulo

| Módulo | IDs | Total |
|---|---|---|
| Autenticación y Control de Acceso | UX-AU-01 a UX-AU-08 | 8 |
| Dashboard y Gestión de Alertas (Tutor) | UX-DT-01 a UX-DT-15 | 15 |
| Encuesta de Contexto (Estudiante) | UX-EN-01 a UX-EN-11 | 11 |
| Módulo Médico con Privacidad Diferencial | UX-MM-01 a UX-MM-08 | 8 |
| Derivaciones y Atención Especializada | UX-DR-01 a UX-DR-09 | 9 |
| Panel Ejecutivo y Reportes (Administrador) | UX-PA-01 a UX-PA-09 | 9 |
| Auditoría y Control de Calidad | UX-AU-09 a UX-AU-13 | 5 |
| Componentes Transversales y Sistema de Diseño | UX-CN-01 a UX-AC-04 | 10 |
| **TOTAL** | | **75** |

---

*SIAE · Monkora | Rodrigo Osorio Rojas · Abril 2026*
