# Implementation Plan: HU007 — Completar encuesta de contexto desde móvil
Fecha: 2026-04-22
Actor: Estudiante
Épica: Épica 3 — Encuesta de Contexto (Estudiante)

## Resumen de la Historia de Usuario
**Como** estudiante, **quiero** completar una encuesta desde mi celular de forma rápida y empática **para** que la institución me ofrezca el apoyo adecuado.

## Componentes a Crear
- [ ] `src/features/encuesta/components/SurveyWizard/index.tsx`: Orquestador del flujo de la encuesta.
- [ ] `src/features/encuesta/components/QuestionStep/index.tsx`: Componente para renderizar una pregunta individual.
- [ ] `src/features/encuesta/components/SurveyHeader/index.tsx`: Título y barra de progreso.
- [ ] `src/features/encuesta/components/OfflineBanner/index.tsx`: Aviso de pérdida de conexión y guardado local.
- [ ] `src/components/ui/ProgressBar/index.tsx`: Componente de UI base para progreso.

## Componentes a Modificar
- [ ] `src/app/encuesta/[token]/page.tsx`: Crear la página de entrada para la encuesta.
- [ ] `src/services/api/surveys.ts`: Implementar métodos para validar token y enviar respuestas.

## Endpoints Necesarios
- `GET /api/surveys/token/:token` → Valida el token y devuelve la estructura de la encuesta → Estado: Mock (basado en contract)
- `POST /api/surveys/:id/submit` → Envía las respuestas con metadatos de tiempo y conectividad → Estado: Mock (basado en contract)

## Tipos TypeScript Requeridos
- `Survey`: Estructura de la encuesta (id, título, preguntas).
- `SurveyQuestion`: Definición de pregunta (id, texto, tipo: radio|text|etc).
- `SurveyResponse`: Respuesta del estudiante.
- `SurveySubmitRequest`: Payload de envío (responses, completionTimeMs, offlineCached).

## Estados de UI a Implementar
- [ ] **Loading**: Skeleton de la primera pregunta y header.
- [ ] **Success**: Redirección a HU008 (Confirmación).
- [ ] **Empty/Expired**: Pantalla de "Enlace expirado" (HU007 criterio 3).
- [ ] **Error**: Toast de error con opción de reintento.
- [ ] **Offline**: Banner persistente indicando que los datos se guardarán localmente.

## Criterios de Aceptación a Cubrir
- [ ] **Escenario 1 (Happy Path)**: El estudiante accede, ve el progreso y envía exitosamente.
- [ ] **Escenario 2 (Enlace Expirado)**: Token > 7 días muestra mensaje de expiración y botón de solicitud.
- [ ] **Escenario 3 (Offline)**: Si cae el internet, la encuesta sigue operable y se sincroniza al recuperar conexión.
- [ ] **Escenario 4 (Telemetría)**: Envío de `completionTimeMs` para detección de respuestas inconsistentes (< 60s).

## Checklist de Privacidad
- [ ] ¿El componente se renderiza para el Tutor? **No** (Ruta pública para estudiantes).
- [ ] ¿Se exponen datos clínicos? **No**.
- [ ] ¿El token es seguro y temporal? **Sí** (Validación en backend).

## Riesgos y Notas Técnicas
- **Offline Sync**: Se usará `localStorage` o `IndexedDB` para persistir el progreso parcial si el Service Worker no está disponible.
- **Vibe de Diseño**: Mobile-first radical. Una pregunta por pantalla para maximizar enfoque y velocidad (UX-07/08).
- **Animaciones**: Transiciones suaves entre preguntas usando `framer-motion`.

---
/**
 * @hu HU007
 * @ux UXEN-01 al UXEN-08, UXEN-11
 * @qa QA-07 (Modo offline), QA-08 (Tasa completado)
 */
