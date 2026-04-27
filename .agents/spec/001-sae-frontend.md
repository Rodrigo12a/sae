# spec.md
# SAE — Especificación Funcional Frontend
> Sistema Inteligente de Acompañamiento Estudiantil  
> Monkora · Rodrigo Osorio Rojas · Abril 2026  
> Versión 1.0 · Basado en 23 HUs · 8 Épicas · 75 Requerimientos UX/UI

---

## 1. Visión General del Sistema

El SAE es una plataforma web de acompañamiento estudiantil con **privacidad diferencial por rol**. Su propósito es detectar proactivamente estudiantes en riesgo de deserción y coordinar intervenciones multi-actor (tutor, psicólogo, médico, administrador) preservando la confidencialidad clínica.

**Responsabilidad del frontend**: Toda la interfaz de usuario. El ML y el backend son sistemas externos que el frontend consume.

### 1.1 Actores y Contexto de Uso

| Actor | Contexto principal | Dispositivo |
|---|---|---|
| **Tutor Académico** | Jornadas de tutoría, monitoreo de alertas, registro de seguimientos | Desktop / tablet |
| **Estudiante** | Completar encuesta de contexto personal | Móvil (conectividad variable) |
| **Administrador / Director** | Dashboard ejecutivo, KPIs, exportación de reportes | Desktop |
| **Psicólogo Educativo** | Gestión de derivaciones, expedientes con datos sensibles | Desktop |
| **Médico Institucional** | Captura masiva de datos clínicos, semáforo de salud | Desktop / tablet |
| **Motor de IA** | Sistema externo (no UI propia); el frontend consume sus outputs | — |

### 1.2 Principios No Negociables

1. **Privacidad por diseño**: El DOM del Tutor nunca contiene datos clínicos.
2. **Semáforo estandarizado**: Sistema visual único rojo/amarillo/verde en toda la plataforma.
3. **Orientación a la acción**: Las etiquetas de riesgo describen necesidades institucionales, nunca estigmatizan.
4. **Mobile-first**: Módulo de encuesta estudiantil optimizado para móvil con conectividad inestable.
5. **Modo degradado visible**: Cuando el Motor de IA no responde, mostrar estado con timestamp.
6. **Accesibilidad WCAG AA**: Contraste mínimo 4.5:1 · Toque mínimo 44×44 px.

---

## 2. Épicas y Resumen de Historias de Usuario

### Épica 1 — Autenticación y Control de Acceso

| ID | Título | Actor | Prioridad |
|---|---|---|---|
| HU001 | Inicio de sesión con rol diferenciado | Todos los usuarios | Alta |
| HU002 | Control de permisos por nivel de acceso | Administrador / Sistema | Alta |

#### HU001 — Inicio de sesión con rol diferenciado
**Como** usuario del sistema, **quiero** iniciar sesión con mis credenciales institucionales **para** acceder únicamente a las funciones y datos correspondientes a mi rol.

**Criterios de aceptación clave:**
- ✅ Login exitoso → redirección automática al dashboard del rol.
- ✅ 3 intentos fallidos → bloqueo 15 min + cuenta regresiva visible + notificación al admin.
- ✅ Sin rol asignado → mensaje "Cuenta pendiente de activación" + solicitud automática al admin.
- ✅ Pantalla de consentimiento de privacidad obligatoria en primer acceso.

**Requerimientos UX vinculados**: UXAU-01 al UXAU-05

---

#### HU002 — Control de permisos por nivel de acceso
**Como** administrador, **quiero** que cada rol tenga permisos de lectura/escritura definidos **para** garantizar confidencialidad de la información sensible.

**Criterios de aceptación clave:**
- ✅ Tutor ve solo etiqueta operativa (nunca diagnóstico clínico) con candado visible.
- ✅ Psicólogo accede a datos sensibles completos en casos derivados.
- ✅ Manipulación de URL → HTTP 403 + log de seguridad.

**Requerimientos UX vinculados**: UXAU-06, UXAU-07, UXAU-08

---

### Épica 2 — Dashboard y Gestión de Alertas (Tutor)

| ID | Título | Actor | Prioridad |
|---|---|---|---|
| HU003 | Visualizar alertas prioritarias en el dashboard | Tutor | Alta |
| HU004 | Consultar perfil de riesgo del estudiante | Tutor | Alta |
| HU005 | Registrar seguimiento en bitácora ágil | Tutor | Alta |
| HU006 | Cerrar alerta con evidencia obligatoria | Tutor | Alta |

#### HU003 — Visualizar alertas prioritarias en el dashboard
**Como** tutor, **quiero** ver un widget de "Atención prioritaria" con estudiantes de mayor urgencia **para** focalizar mi esfuerzo.

**Criterios de aceptación clave:**
- ✅ Máximo 5 tarjetas ordenadas por urgencia: nombre + semáforo + etiqueta acción.
- ✅ Sin alertas → "Todos tus tutorados están en seguimiento normal" (no pantalla en blanco).
- ✅ Datos inconsistentes → ícono "Ojo / Revisar" en lugar de semáforo.
- ✅ Motor de IA no disponible → timestamp visible de última actualización.

**Requerimientos UX vinculados**: UXDT-01 al UXDT-05  
**Métrica de performance**: p95 < 1.5 segundos (datos pre-computados).

---

#### HU004 — Consultar perfil de riesgo del estudiante
**Como** tutor, **quiero** acceder a un perfil visual holístico del estudiante (académico + socioeconómico + salud) **para** tener contexto antes de la tutoría.

**Criterios de aceptación clave:**
- ✅ Gráficas de asistencia/calificaciones + semáforo por dimensión + historial de alertas.
- ✅ Bandera médica → solo etiqueta operativa traducida (diagnóstico NUNCA en DOM del Tutor).
- ✅ Sin encuesta completada → indicador "Variables personales: pendientes" + botón "Reenviar encuesta".

**Requerimientos UX vinculados**: UXDT-06 al UXDT-10

---

#### HU005 — Registrar seguimiento en bitácora ágil
**Como** tutor, **quiero** registrar en pocos clics el resultado de una sesión **para** mantener historial sin cargas administrativas.

**Criterios de aceptación clave:**
- ✅ Formulario inline (no modal) con mínimo 30 caracteres. Contador en tiempo real.
- ✅ Guardado → timestamp + autor. Alerta cambia de "Nueva" a "En seguimiento".
- ✅ Texto < 30 caracteres → bloqueo con mensaje de validación.

**Requerimientos UX vinculados**: UXDT-11, UXDT-12

---

#### HU006 — Cerrar alerta con evidencia obligatoria
**Como** tutor, **quiero** cerrar una alerta adjuntando evidencia **para** asegurar que el cierre sea auditable.

**Criterios de aceptación clave:**
- ✅ Cierre válido → estado "Resuelta" + micro-encuesta al estudiante en 24h.
- ✅ Estudiante reporta "no hubo sesión" → alerta reabierta + notificación "Inconsistencia de servicio" al admin.

**Requerimientos UX vinculados**: UXDT-13, UXDT-14, UXDT-15

---

### Épica 3 — Encuesta de Contexto (Estudiante)

| ID | Título | Actor | Prioridad |
|---|---|---|---|
| HU007 | Completar encuesta de contexto desde móvil | Estudiante | Alta |
| HU008 | Recibir confirmación y recursos al finalizar | Estudiante | Media |

#### HU007 — Completar encuesta de contexto desde móvil
**Como** estudiante, **quiero** completar una encuesta desde mi celular de forma rápida y empática **para** que la institución me ofrezca el apoyo adecuado.

**Criterios de aceptación clave:**
- ✅ Acceso por enlace seguro → pantalla empática → formulario con barra de progreso.
- ✅ Completado en < 60 segundos → datos marcados como "Pendiente de verificación" (sin penalizar UX al estudiante).
- ✅ Enlace > 7 días → mensaje de enlace expirado + "Solicitar nuevo enlace".
- ✅ Pérdida de conectividad → guardar en caché local + retry automático.

**Requerimientos UX vinculados**: UXEN-01 al UXEN-08, UXEN-11  
**Métrica**: Tasa de completado ≥ 80% · Abandono < 20% · Tiempo entre 60 s y 5 min.

---

#### HU008 — Recibir confirmación y recursos al finalizar encuesta
**Como** estudiante, **quiero** ver una pantalla de confirmación con apoyos institucionales relevantes **para** sentir que compartir mi información tiene beneficio inmediato.

**Criterios de aceptación clave:**
- ✅ Pantalla de éxito con nombre personalizado + al menos un recurso institucional contextual.
- ✅ Error de red → guardar en caché + reintento sin pérdida de datos.
- ✅ Mensaje: "Tus respuestas fueron recibidas" (NO "procesadas" — validación es asíncrona).

**Requerimientos UX vinculados**: UXEN-09, UXEN-10

---

### Épica 4 — Módulo Médico con Privacidad Diferencial

| ID | Título | Actor | Prioridad |
|---|---|---|---|
| HU009 | Carga masiva de datos de campaña de salud | Médico | Alta |
| HU010 | Semáforo de salud con privacidad diferencial | Médico | Alta |
| HU011 | Alertar área académica por impacto de salud prolongado | Médico | Media |

#### HU009 — Carga masiva de datos de campaña de salud
**Como** médico, **quiero** capturar resultados de jornada de salud mediante checklist para múltiples estudiantes **para** eliminar captura en papel.

**Criterios de aceptación clave:**
- ✅ Interfaz checklist: selector grupo/carrera → lista filtrable → casillas por condición → guardado masivo.
- ✅ Estudiante duplicado → modal de confirmación "Expediente existente" antes de sobreescribir.
- ✅ Condición sin traducción → notificación inline + alerta al admin (sin bloquear flujo).

**Requerimientos UX vinculados**: UXMM-01 al UXMM-04

---

#### HU010 — Semáforo de salud con privacidad diferencial
**Como** médico, **quiero** marcar a un estudiante con bandera de salud visible para el tutor sin exponer el diagnóstico clínico.

**Criterios de aceptación clave:**
- ✅ Tutor ve: solo etiqueta operativa + semáforo. Campo "diagnóstico" AUSENTE del DOM.
- ✅ Médico ve: diagnóstico clínico completo + etiqueta operativa + semáforo editable.
- ✅ Acceso a estudiante de otro campus → denegado + log de auditoría.

**Requerimientos UX vinculados**: UXMM-05, UXMM-06

---

#### HU011 — Alertar área académica por impacto de salud prolongado
**Como** médico, **quiero** generar alerta al tutor cuando un problema de salud impactará asistencia prolongada.

**Criterios de aceptación clave:**
- ✅ Condición de impacto prolongado → notificación automática al tutor asignado (sin datos clínicos).
- ✅ Actualización antes de lectura → consolidar en una sola notificación con badge "Actualizada".

**Requerimientos UX vinculados**: UXMM-07, UXMM-08

---

### Épica 5 — Derivaciones y Atención Especializada

| ID | Título | Actor | Prioridad |
|---|---|---|---|
| HU012 | Derivar caso a psicología desde perfil del estudiante | Tutor | Alta |
| HU013 | Derivar caso a servicios médicos | Tutor | Alta |
| HU014 | Aceptar y gestionar caso derivado (psicólogo) | Psicólogo | Alta |
| HU015 | Registrar bitácora confidencial de intervención psicológica | Psicólogo | Alta |

#### HU012 — Derivar caso a psicología
**Como** tutor, **quiero** derivar a un estudiante a psicología con motivo documentado **para** asegurar atención especializada.

**Criterios de aceptación clave:**
- ✅ Botón "Derivar a psicología" habilitado solo con alerta activa.
- ✅ Modal: motivo del catálogo (obligatorio) + campo observaciones.
- ✅ Departamento saturado → advertencia + escalado al admin.
- ✅ Alerta cambia a "Derivada - Psicología".

**Requerimientos UX vinculados**: UXDR-01 al UXDR-04

---

#### HU013 — Derivar caso a servicios médicos
**Como** tutor, **quiero** derivar a un estudiante al servicio médico cuando sus síntomas físicos superan la tutoría.

**Criterios de aceptación clave:**
- ✅ Descripción observable (no diagnóstica) → validación que detecta términos clínicos con advertencia inline.
- ✅ Alerta cambia a "Derivada - Medicina".

**Requerimientos UX vinculados**: UXDR-02, UXDR-03

---

#### HU014 — Aceptar y gestionar caso derivado (psicólogo)
**Como** psicólogo, **quiero** recibir y aceptar formalmente casos derivados con acceso al expediente completo.

**Criterios de aceptación clave:**
- ✅ Bandeja de pendientes → expediente completo (historial académico + datos sensibles + diagnósticos).
- ✅ Al aceptar → tutor recibe confirmación "El caso ha sido recibido por Psicología".
- ✅ Sin motivo documentado → botón "Aceptar caso" deshabilitado.

**Requerimientos UX vinculados**: UXDR-05, UXDR-06

---

#### HU015 — Bitácora confidencial de intervención psicológica
**Como** psicólogo, **quiero** registrar notas clínicas con máxima privacidad y publicar solo la recomendación operativa al tutor.

**Criterios de aceptación clave:**
- ✅ Editor con toggle "Nota privada" → fondo diferenciado → cifrado en servidor.
- ✅ Botón separado "Publicar recomendación para el Tutor" con vista previa.
- ✅ Administrador → solo ve "Intervención psicológica activa — contenido confidencial".

**Requerimientos UX vinculados**: UXDR-07, UXDR-08, UXDR-09

---

### Épica 6 — Panel Ejecutivo y Reportes (Administrador)

| ID | Título | Actor | Prioridad |
|---|---|---|---|
| HU016 | Visualizar KPIs en el dashboard ejecutivo | Administrador | Alta |
| HU017 | Explorar patrones sistémicos por grupo y semestre | Administrador | Media |
| HU018 | Exportar reportes en múltiples formatos | Administrador | Media |

#### HU016 — Dashboard ejecutivo con KPIs en tiempo real
**Como** director académico, **quiero** ver KPIs de riesgo de deserción por programa y semestre **para** tomar decisiones basadas en datos.

**Criterios de aceptación clave:**
- ✅ KPIs: Índice de riesgo global + Alertas atendidas vs. ignoradas + Comparativa por carrera.
- ✅ Datos con latencia máxima de 5 minutos. Badge de frescura visible.
- ✅ Filtros por carrera/semestre → actualización en tiempo real de todas las gráficas.
- ✅ Sin datos para el filtro → estado vacío con mensaje claro.

**Requerimientos UX vinculados**: UXPA-01 al UXPA-04  
**Métrica de performance**: p95 < 3 s · Throughput ≥ 50 req/s.

---

#### HU017 — Drill-down por grupo y semestre
**Como** director académico, **quiero** hacer drill-down sobre anomalías para identificar la causa raíz.

**Criterios de aceptación clave:**
- ✅ Clic en barra del gráfico → panel lateral con estudiantes en riesgo y variables predominantes.
- ✅ Navegar al perfil individual desde el panel lateral con regreso conservando filtros.

**Requerimientos UX vinculados**: UXPA-05, UXPA-06

---

#### HU018 — Exportar reportes en múltiples formatos
**Como** director académico, **quiero** exportar datos en PDF o Excel según el contexto.

**Criterios de aceptación clave:**
- ✅ PDF: previsualización → generación < 30 s → resumen ejecutivo con gráficas y KPIs.
- ✅ Excel: datos crudos por estudiante con metadatos de auditoría (sin datos clínicos).
- ✅ Dataset > 10,000 filas → proceso asíncrono + correo cuando esté listo + UI no se bloquea.

**Requerimientos UX vinculados**: UXPA-07 al UXPA-09

---

### Épica 7 — Motor de IA (Validación y Predicción)

> El Motor de IA es un sistema externo. El frontend **solo consume** sus outputs transformados. No existe UI directa para este módulo, pero sus comportamientos afectan el diseño de todos los componentes.

| ID | Título | Impacto en Frontend |
|---|---|---|
| HU019 | Detectar inconsistencias en encuesta | Ícono "Ojo/Revisar" en dashboard del Tutor |
| HU020 | Generar etiquetas de riesgo orientadas a la acción | Diseño de tarjetas: etiqueta operativa, no score |
| HU021 | Filtrar falsos positivos en auto-reportes | Solicitud de tamizaje en bandeja del Psicólogo |

**Implicaciones de diseño:**
- Las tarjetas del widget de alertas **nunca** muestran score numérico.
- El estado "Ojo/Revisar" reemplaza (no coexiste con) el semáforo estándar.
- La bandeja del psicólogo puede recibir solicitudes de tamizaje con indicador "Auto-reporte: sintomatología emocional".
- El campo "Depresión" nunca se registra como diagnóstico desde una encuesta estudiantil.

---

### Épica 8 — Auditoría y Control de Calidad del Servicio

| ID | Título | Actor | Prioridad |
|---|---|---|---|
| HU022 | Verificar intervención del tutor con micro-encuesta | Sistema / Estudiante | Media |
| HU023 | Alertar al administrador por inconsistencia de servicio | Administrador | Media |

#### HU022 — Micro-encuesta de verificación
**Como** sistema de auditoría, **quiero** enviar micro-encuesta al estudiante al cerrar alerta crítica **para** validar que la intervención ocurrió.

**Criterios de aceptación clave:**
- ✅ Diseño idéntico a encuesta principal: mobile-first, barra de progreso, tono empático. Máximo 3 preguntas.
- ✅ Sin respuesta en 48h → log "Micro-encuesta no respondida" (alerta permanece cerrada).
- ✅ Sin canal de verificación → admin recibe notificación para actualizar datos de contacto.

**Requerimientos UX vinculados**: UXAU-09, UXAU-10

---

#### HU023 — Alertar por inconsistencia de servicio
**Como** director académico, **quiero** recibir notificación cuando haya discrepancia entre reporte del tutor y respuesta del estudiante.

**Criterios de aceptación clave:**
- ✅ Discrepancia → alerta reabierta "Inconsistencia detectada" + notificación al admin con detalle del caso.
- ✅ 3+ inconsistencias del mismo tutor en el ciclo → "Alerta de desempeño crítico" en reporte de gestión mensual.

**Requerimientos UX vinculados**: UXAU-11 al UXAU-13

---

## 3. Resumen de Requerimientos UX/UI por Módulo

| Módulo | Requerimientos | IDs |
|---|---|---|
| Autenticación y Control de Acceso | 8 | UXAU-01 a UXAU-08 |
| Dashboard y Gestión de Alertas (Tutor) | 15 | UXDT-01 a UXDT-15 |
| Encuesta de Contexto (Estudiante) | 11 | UXEN-01 a UXEN-11 |
| Módulo Médico con Privacidad Diferencial | 8 | UXMM-01 a UXMM-08 |
| Derivaciones y Atención Especializada | 9 | UXDR-01 a UXDR-09 |
| Panel Ejecutivo y Reportes (Administrador) | 9 | UXPA-01 a UXPA-09 |
| Auditoría y Control de Calidad | 5 | UXAU-09 a UXAU-13 |
| Componentes Transversales y Sistema de Diseño | 10 | UXCN-01 a UXAC-04 |
| **TOTAL** | **75** | — |

---

## 4. Sistema de Diseño — Referencia Rápida

### Paleta de Colores

```css
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

/* Semáforo */
--semaforo-rojo: #D64545;
--semaforo-amarillo: #F4B740;
--semaforo-verde: #2FA36B;
--semaforo-ojo: #7E57C2;
--semaforo-gris: #94A3B8;
```

### Tipografía

```css
font-family: 'Inter', 'Roboto', system-ui;
font-size-base: 16px;
font-size-min-body: 16px;
font-size-min-secondary: 14px;
font-size-min-caption: 12px;
```

### Componentes Transversales

- **Semáforo**: Siempre color + ícono + texto. Ver `spec-fidelity.md` sección 5.
- **Notificaciones in-app**: Centro de notificaciones con badge. Categorías: Riesgo (rojo), Derivaciones (azul), Auditoría (naranja), Informativas (gris).
- **Toasts/Snackbars**: 5 segundos, no bloqueantes. Desktop: inferior-derecha. Móvil: parte superior.

---

## 5. Atributos de Calidad ISO 25010 — Impacto en Frontend

| QA | Atributo | Métrica / Restricción Frontend |
|---|---|---|
| QA-01 | Confidencialidad / RBAC | Datos clínicos nunca en DOM del Tutor |
| QA-02 | No repudio / Auditoría | Logs inmutables en módulo independiente |
| QA-03 | Privacidad médica / AES-256 | Spinners obligatorios en vistas con datos cifrados (50–100 ms extra) |
| QA-04 | Performance dashboard ejecutivo | p95 < 3 s · Latencia ≤ 5 min · Throughput ≥ 50 req/s |
| QA-05 | Latencia del widget de alertas | p95 < 1.5 s (datos pre-computados) |
| QA-07 | Tolerancia a fallos / Offline | PWA + Service Worker para encuesta estudiantil |
| QA-08 | Usabilidad / Aprendibilidad | Encuesta: tasa completado ≥ 80% · Abandono < 20% |
| QA-10 | Exportación asíncrona | Hasta 50,000 filas sin bloquear UI |
| QA-11 | Orientación a la acción | Etiquetas: necesidades institucionales, no estigma |
| QA-12 | Disponibilidad de derivaciones | Detección de saturación del departamento < 1 min |

---

*Este documento es fuente de verdad funcional para el equipo de frontend del SAE.*  
*Versión 1.0 · Abril 2026 · Monkora*
