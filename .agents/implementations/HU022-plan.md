# Implementation Plan: HU022 — Micro-encuesta de verificación
Fecha: 2026-04-22
Actor: Sistema / Estudiante
Épica: Épica 8 — Auditoría y Control de Calidad del Servicio

## Resumen funcional
Permitir que el sistema valide si una intervención de un tutor efectivamente ocurrió y fue útil, mediante una encuesta corta (máximo 3 preguntas) enviada al estudiante. El diseño debe ser empático, mobile-first y coherente con la encuesta principal de contexto.

## Componentes a Crear
- [ ] `src/features/auditoria/components/MicroSurvey/index.tsx`: Contenedor principal que maneja el flujo de la micro-encuesta.
- [ ] `src/features/auditoria/components/MicroSurvey/MicroSurveyWizard.tsx`: Adaptación del `SurveyWizard` para 3 preguntas.
- [ ] `src/features/auditoria/components/MicroSurvey/SuccessStep.tsx`: Pantalla de agradecimiento tras completar la verificación.
- [ ] `src/features/auditoria/hooks/useMicroSurvey.ts`: Hook para manejar el estado de las respuestas y la mutación hacia la API.

## Componentes a Modificar
- [ ] `src/services/api/audit.ts`: Crear servicio para `submitMicroSurvey` y `getMicroSurveyStatus`.

## Nuevas Rutas
- [ ] `src/app/encuesta/verificacion/[token]/page.tsx`: Ruta pública accesible vía link enviado al estudiante.

## Endpoints Necesarios
- `GET` `/api/audit/micro-surveys/:token` → Validar token y obtener datos básicos del estudiante/alerta → Estado: **Mock**
- `POST` `/api/audit/micro-surveys/:token/submit` → Enviar respuestas de la micro-encuesta → Estado: **Mock**

## Tipos TypeScript Requeridos
```typescript
interface MicroSurveyData {
  studentName: string;
  tutorName: string;
  alertCategory: string;
  expiresAt: string;
}

interface MicroSurveyResponse {
  wasIntervened: boolean;
  helpfulnessScore: number; // 1-5
  comments?: string;
}
```

## Estados de UI a Implementar
- [ ] **Loading**: Skeleton de la encuesta mientras se valida el token.
- [ ] **Success**: Mensaje empático: "Gracias por ayudarnos a mejorar tu acompañamiento".
- [ ] **Expired/Invalid**: Estado para tokens de >48h o links corruptos.
- [ ] **Error**: Fallo al enviar las respuestas.

## Criterios de Aceptación a Cubrir
- [ ] **Escenario 1 (Happy Path)**: El estudiante abre el link, ve barra de progreso, responde 3 preguntas y recibe confirmación.
- [ ] **Escenario 2 (Token Expirado)**: Si el link tiene más de 48h, mostrar mensaje: "Este link de verificación ha expirado".
- [ ] **Escenario 3 (Validación de datos)**: El botón "Finalizar" solo se habilita si se responden las preguntas obligatorias.

## Checklist de Privacidad
- [ ] ¿La encuesta revela el diagnóstico clínico? **NO** (Solo menciona "acompañamiento" o "orientación").
- [ ] ¿El token es único y no predecible? (Manejado por backend, frontend solo consume).
- [ ] ¿Se evita guardar datos sensibles en localStorage? (Solo se envían al submit).

## Checklist de Accesibilidad (WCAG AA)
- [ ] Contraste 4.5:1 en todos los textos.
- [ ] Áreas táctiles >44px para opciones Sí/No y escala Likert.
- [ ] Uso de `aria-live` para anuncios de cambio de paso en la encuesta.
