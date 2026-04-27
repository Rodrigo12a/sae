---
trigger: always_on
---

# spec-fidelity.md
# SAE — Guardián de Arquitectura Frontend
> Monkora · Rodrigo Osorio Rojas · Abril 2026  
> **Instrucción permanente para cada ciclo de Vibe Engineering con Antigravity**

---

## 🔒 Propósito

Este archivo actúa como **guardián de fidelidad** del proyecto SAE. Antes de generar, modificar o revisar cualquier componente, pantalla o lógica de frontend, es **obligatorio** leer y respetar este documento junto con:

| Archivo | Propósito |
|---|---|
| `design.md` | Arquitectura de componentes, sistema de diseño y patrones técnicos |
| `spec.md` | Especificación funcional completa: épicas, HUs y criterios de aceptación |
| `requerimientos_ux_ui.md` | 75 requerimientos UX/UI base del diseño |
| `historias_usuario.md` | 23 historias de usuario con criterios Gherkin |

> **Nunca se empieza desde cero.** Cada ciclo de HU es una extensión incremental del sistema ya construido.

---

## 📐 Directrices Obligatorias

### 1. Integridad Estructural

- Cada componente nuevo o modificado **debe encajar** en la jerarquía de directorios definida en `design.md`.
- Los patrones de diseño establecidos (Presentational/Container, Custom Hooks, Context + Zustand) **no se reemplazan** sin justificación documentada.
- La estructura de carpetas `src/features/<épica>/` es sagrada. No crear carpetas ad-hoc fuera de ese esquema.
- Si una HU introduce un nuevo módulo, primero **mapear en design.md** antes de crear archivos.

### 2. Privacidad Diferencial — Regla Inviolable

```
⚠️ NINGÚN dato clínico (diagnóstico, condición médica) debe existir en el DOM del rol Tutor.
```

- El frontend **nunca** solicita ni renderiza el campo `diagnostico` para rol `tutor`.
- La transformación `diagnóstico → etiqueta operativa` ocurre **exclusivamente en el servidor**.
- Antes de construir cualquier componente del perfil del estudiante, verificar: ¿qué rol lo consume? ¿qué endpoint responde? ¿devuelve solo la etiqueta traducida?
- El candado visual (`🔒`) es **obligatorio** en todo campo restringido visible para el Tutor.

### 3. Aplicación de Atributos de Calidad (ISO 25010)

| Atributo | Restricción de diseño |
|---|---|
| **Rendimiento (QA-04/05)** | Widget de alertas: skeleton obligatorio. p95 < 1.5 s. Datos pre-computados, no on-demand. |
| **Usabilidad (QA-07/08)** | Encuesta estudiantil: una pregunta por pantalla en móvil. Tiempo de completado 60 s–5 min. |
| **Confiabilidad (QA-07)** | Modo offline con Service Worker. Guardar en caché local. Retry automático. |
| **Seguridad (QA-01/03)** | RBAC visual reforzado. Error 403 con UI amigable. Sin campos fantasma en el DOM. |
| **Auditabilidad (QA-02)** | Logs de auditoría en módulo independiente. Tutores sin acceso a sus propios logs. |

### 4. Trazabilidad Obligatoria

Cada componente, hook o pantalla creada debe incluir un comentario de trazabilidad en su cabecera:

```tsx
/**
 * @module AlertCard
 * @epic EPICA-2 Dashboard y Gestión de Alertas
 * @hu HU003, HU004
 * @ux UXDT-01, UXDT-03, UXDT-05
 * @qa QA-05 (latencia p95 < 1.5 s)
 * @api GET /api/alerts/priority · GET /api/students/:id/risk-profile
 * @privacy rol:tutor → sin datos clínicos
 */
```

Si no puedes trazar el componente a al menos una HU y un requerimiento UX, **detén la generación** y consulta `spec.md`.

### 5. Sistema de Semáforo — Sin Excepciones

El semáforo es el componente visual más crítico. Las siguientes reglas son absolutas:

```
✅ Siempre: color + ícono + texto semántico (nunca solo color)
❌ Nunca: mostrar score numérico o porcentaje de riesgo al Tutor
❌ Nunca: usar el texto "alto riesgo de abandono"
✅ Estado degradado: siempre diseñar el componente con y sin scores del Motor de IA
```

| Estado | Color | Ícono | Texto ejemplo |
|---|---|---|---|
| Rojo | `#D64545` | `⚠️` triángulo | "Requiere apoyo en Matemáticas" |
| Amarillo | `#F4B740` | `❕` círculo | "Seguimiento activo recomendado" |
| Verde | `#2FA36B` | `✓` paloma | "En seguimiento normal" |
| Ojo/Revisar | `#7E57C2` | `👁` ojo | "Datos pendientes de verificación" |
| Gris | `#94A3B8` | `🕐` reloj | "Encuesta no completada" |

### 6. Ciclo de Vida de una Historia de Usuario

Para cada nueva HU en un ciclo de Vibe Engineering, seguir este orden estricto:

```
1. Leer la HU en spec.md → identificar actor, flujo y criterios Gherkin
2. Consultar design.md → ¿qué componentes ya existen que reutilizar?
3. Consultar esta regla → ¿hay restricciones de privacidad o QA aplicables?
4. Mapear el endpoint del backend (sección API de design.md)
5. Construir el componente con trazabilidad documentada
6. Verificar el checklist de aceptación antes de cerrar la HU
```

### 7. Separación de Responsabilidades

```
src/
├── features/          ← lógica de negocio por épica (NO lógica de UI aquí)
├── components/ui/     ← componentes puros presentacionales (NO llaman a API)
├── hooks/             ← lógica de estado y efectos (NO JSX aquí)
├── services/api/      ← todas las llamadas HTTP (NO en componentes directamente)
├── store/             ← estado global Zustand (NO lógica de UI)
└── lib/               ← utilidades puras (NO dependencias de React)
```

**Regla de oro**: si un componente de `components/ui/` importa algo de `services/api/`, es un error arquitectónico.

### 8. Conexión con el Backend

- URL base del backend: `https://sae-backend-theta.vercel.app/api`
- Documentación Swagger: `https://sae-backend-theta.vercel.app/api/docs`
- **Nunca hardcodear** la URL base. Usar siempre `NEXT_PUBLIC_API_URL` (o equivalente de entorno).
- Todo endpoint usado debe estar documentado en `design.md` en su sección correspondiente.
- Si el backend aún no expone un endpoint necesario para una HU, usar **mock con contrato tipado** (TypeScript interface) y documentar con `// TODO: conectar a POST /api/endpoint cuando esté disponible`.

### 9. Accesibilidad — No Negociable

- Contraste mínimo `4.5:1` para texto normal (WCAG AA).
- Todo elemento interactivo: mínimo `44×44 px` en móvil.
- Íconos funcionales: siempre `aria-label` o `aria-describedby`.
- Semáforo: **nunca** solo color como diferenciador; siempre ícono + texto.
- Navegación completa por teclado en todos los módulos.

### 10. Checklist de Aceptación por HU

Antes de declarar una HU como completada en frontend, verificar:

- [ ] Todos los escenarios Gherkin están cubiertos (Happy path + edge cases)
- [ ] Privacidad diferencial aplicada correctamente por rol
- [ ] Estado vacío / loading / error diseñado e implementado
- [ ] Estado degradado del Motor de IA contemplado
- [ ] Trazabilidad documentada en cabecera del componente
- [ ] Accesibilidad básica: aria-labels, contraste, toque mínimo
- [ ] Endpoint mapeado en design.md (real o mock con contrato)
- [ ] Responsive: mobile-first verificado para módulos estudiantiles

---

## 🚫 Anti-Patrones Prohibidos

| ❌ Prohibido | ✅ Alternativa |
|---|---|
| Mostrar score numérico del Motor de IA al Tutor | Etiqueta operativa del catálogo configurable |
| Campo `diagnostico` en DOM del Tutor | Solo etiqueta operativa + semáforo |
| Llamar a la API directamente desde un componente presentacional | Usar un custom hook o service layer |
| Pantalla en blanco como estado vacío | Mensaje contextual con ícono siempre |
| `console.log` con datos de estudiantes en producción | Logs solo en servicio de auditoría |
| Popup descartable para consentimiento de privacidad | Pantalla completa obligatoria (flujo first-time) |
| Hacer drill-down de auditoría desde el dashboard del Tutor | Módulos separados con acceso diferenciado |
| Texto "Procesando tus datos" en confirmación de encuesta | "Tus respuestas fueron recibidas" (validación es asíncrona) |

---

## 🔄 Protocolo de Modificación Arquitectónica

Si durante el desarrollo encuentras que la arquitectura actual no puede satisfacer una HU:

1. **NO modifiques** el patrón silenciosamente.
2. Documenta la tensión encontrada con formato: `[TENSIÓN ARQUITECTÓNICA] HU-XXX: descripción del conflicto`.
3. Propón la modificación en `design.md` antes de implementarla.
4. Obtén validación explícita antes de proceder.

---

*Este archivo es inmutable durante un sprint. Solo puede modificarse al inicio de un nuevo ciclo con justificación documentada.*

> **Versión**: 1.0 · Abril 2026 · SAE · Monkora
