# Implementation Plan: Épica 7 — Motor de IA (Validación y Predicción)
Fecha: 2026-04-22
Actor: Transversal (Tutor, Administrador, Psicólogo)
Épica: Épica 7 — Motor de IA

## Contexto
El Motor de IA es un sistema externo cuyos outputs transforman la visualización del riesgo en el frontend. Esta épica se centra en la integración de esos estados (inconsistencias, etiquetas operativas y filtrado de falsos positivos) en los módulos existentes.

## Componentes a Crear
- [ ] `src/hooks/useAIEngineStatus.ts`: Hook para sincronizar el estado global del motor (`ok`, `degraded`, `unavailable`) desde las respuestas de la API.
- [ ] `src/features/dashboard-tutor/components/AIEngineStatusBanner/index.tsx`: Banner informativo para el dashboard cuando el motor no está al 100%.

## Componentes a Modificar
- [ ] `src/features/dashboard-tutor/components/PriorityAlertWidget/index.tsx`: Integrar el `AIEngineStatusBanner` y asegurar que renderiza correctamente el estado `revisar`.
- [ ] `src/features/derivaciones/components/PendingReferralsBandeja/index.tsx`: Añadir indicador visual para casos de "Auto-reporte: sintomatología emocional" filtrados/validados por IA (HU021).
- [ ] `src/services/api/alerts.ts`: Actualizar mocks para incluir casos con `semaforoEstado: 'revisar'` y diferentes estados del motor.
- [ ] `src/services/api/referrals.ts`: Actualizar mocks de derivaciones para incluir el flag de validación de sintomatología emocional.

## Endpoints Impactados (Outputs del Motor)
- `GET /alerts/priority` → Incluye `aiEngineStatus` y estados `revisar`.
- `GET /referrals/pending` → Incluye metadata de validación de auto-reportes.

## Tipos TypeScript Requeridos
Ya definidos en `src/types/alert.ts`:
- `SemaforoEstado`: 'revisar'
- `AIEngineStatus`: 'ok' | 'degraded' | 'unavailable'

## Estados de UI a Implementar
- [ ] **Modo Degradado**: Banner persistente con timestamp de última actualización.
- [ ] **Inconsistencia Detectada**: Ícono de ojo (`👁`) color púrpura (`#7E57C2`) en tarjetas de alerta.
- [ ] **Validación de Síntomas**: Badge informativo en la bandeja del psicólogo para auto-reportes validados.

## Criterios de Aceptación a Cubrir
- [ ] **HU019**: El Tutor visualiza el ícono "Ojo/Revisar" cuando el motor detecta inconsistencias en una encuesta.
- [ ] **HU020**: Todas las etiquetas en el dashboard son operativas (ej: "Requiere apoyo en Matemáticas") y nunca se muestra el score 0-100.
- [ ] **HU021**: El Psicólogo identifica claramente las solicitudes de tamizaje originadas por auto-reportes de sintomatología emocional.

## Checklist de Privacidad
- [ ] El estado "revisar" NO revela el motivo clínico de la inconsistencia al Tutor.
- [ ] Las etiquetas operativas traducen el riesgo técnico a lenguaje de acompañamiento.
- [ ] El indicador de sintomatología emocional para el psicólogo es confidencial y solo visible en su rol.
