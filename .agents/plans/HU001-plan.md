# Plan de Implementación: HU001 — Autenticación y Control de Acceso

> **Historia de Usuario**: Como usuario del sistema, quiero iniciar sesión de forma segura y ser redirigido a mi dashboard correspondiente para acceder a las funciones permitidas por mi rol.
> **Estado**: Refactorización en curso | **Épica**: 1 — Autenticación

---

## 1. Análisis de Situación Actual

| Componente | Estado Actual | Acción Necesaria |
|---|---|---|
| `LoginForm.tsx` | En `src/modules/auth/`, usa `useState` local y `next-auth`. | Mover a `src/features/auth/ui/`, desacoplar lógica a un Custom Hook. |
| **Logic** | Redirección básica, sin bloqueo por intentos, sin consentimiento. | Implementar contador de intentos y flujo de consentimiento. |
| **Design** | Colores hardcodeados, no sigue `design.md`. | Aplicar sistema de tokens CSS y tipografía 'Inter'. |
| **Service layer** | Usa `axios` directamente. | Integrar con `src/services/api` siguiendo Clean Architecture. |

---

## 2. Arquitectura de la Solución (Clean Architecture)

Se seguirá la estructura definida en `design.md`:

```text
src/features/auth/
├── ui/                 # Componentes visuales (LoginForm, ConsentScreen)
├── hooks/              # Lógica de estado (useLogin, useLockout)
├── domain/             # Lógica de negocio (reglas de bloqueo, roles)
├── data/               # Transformadores de datos / Mocks
└── services/           # Llamadas a API (authService)
```

---

## 3. Especificaciones Técnicas

### 3.1. Reglas de Bloqueo (QA-01)
- Límite: 3 intentos fallidos.
- Acción: Bloqueo de 15 minutos.
- Persistencia: `localStorage` (como respaldo) + Estado en el servidor.
- UI: Contador regresivo visible cuando el usuario intenta loguearse bloqueado.

### 3.2. Privacidad Diferencial & Consentimiento (RC-03)
- Primer acceso: Detectado vía flag `needsConsent` en el response del login.
- Pantalla: Completa (no modal), lenguaje claro, botones grandes (48px).
- Persistencia: `POST /auth/consent` antes de proceder al dashboard.

### 3.3. Redirección por Rol
- `TUTOR` -> `/tutor/dashboard`
- `ESTUDIANTE` -> `/encuesta`
- `PSICOLOGO` -> `/psicologo/casos`
- `MEDICO` -> `/medico/captura` (con tonos verdes)
- `ADMINISTRADOR` -> `/admin/dashboard`

---

## 4. Plan de Tareas

### Fase 1: Infraestructura y Dominio
- [ ] Crear estructura de carpetas en `src/features/auth/`.
- [ ] Definir tipos de dominio para `User`, `AuthSession` y `LoginResponse`.
- [ ] Implementar `auth.service.ts` en la capa de servicios con manejo de errores robusto.

### Fase 2: Lógica (Hooks)
- [ ] `useAuthLockout`: Manejo de intentos fallidos y timer de 15 min.
- [ ] `useLogin`: Orquestador de login + redirección + flujo de consentimiento.

### Fase 3: UI & Presentación
- [ ] Refactorizar `LoginForm.tsx`:
    - Integrar `Inter` y variables CSS.
    - Agregar estados `loading`, `error` y `blocked`.
    - Ajustar touch targets (44px min).
- [ ] Crear `ConsentScreen.tsx`:
    - Flujo obligatorio de primera vez.
- [ ] Implementar `AuthLayout.tsx` con carrusel institucional renovado.

### Fase 4: Integración y Cierre
- [ ] Conectar con NextAuth para persistencia de sesión.
- [ ] Verificar redirecciones dinámicas.
- [ ] Aplicar `/hu-close` checklist.

---

## 5. Conectividad API (Mocks)

| Endpoint | Método | Propósito |
|---|---|---|
| `/auth/login` | POST | Inicio de sesión. Devuelve `needsConsent`. |
| `/auth/consent` | POST | Registrar aceptación de privacidad. |
| `/auth/me` | GET | Recuperar perfil y rol actual. |

---

## 6. Checklist de Fidelidad (Spec-Fidelity)

- [ ] ¿Usa variables CSS de `design.md`? (e.g. `--color-primary`)
- [ ] ¿Evita dar datos clínicos al Tutor? (N/A en Login, pero crítico en perfil previo)
- [ ] ¿Maneja estados de carga/error diseñados?
- [ ] ¿Cumple con accesibilidad (contraste 4.5:1)?

---
v1.0.0 | Generado para HU001
