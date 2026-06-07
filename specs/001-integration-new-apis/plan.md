# Implementation Plan: 001-integration-new-apis

**Branch**: `001-integration-new-apis` | **Date**: 2026-06-07 | **Spec**: [spec.md](file:///c:/Users/Royer/OneDrive/Documentos/proyectos-monkqi/02-sistema-de-abandono-escolar/sae-frontend/specs/001-integration-new-apis/spec.md)
**Input**: Feature specification from `/specs/001-integration-new-apis/spec.md`

## Summary

Complete the integration of 28 pending endpoints in the SIAE frontend, resolve the tutor-student career assignment structural design issue, correct incorrect endpoints (discrepancies), convert existing mocks to real backend API calls, and implement missing endpoints. All calls will be routed through the service layer `src/services/api/` using the shared `api` instance configured with the institutional API base URL.

## Technical Context

- **Language/Version**: TypeScript 5.x / JavaScript
- **Framework**: Next.js 15+ (App Router)
- **Primary Dependencies**: Axios (client at `src/lib/api.ts`), NextAuth.js
- **Testing**: Manual testing, local execution, build checks
- **Target Platform**: Web (responsive mobile-first)
- **Constraints**: 
  - Privacy differential: Tutor role must never receive or render clinical diagnoses (`diagnosticoClinico`). Visual padlock (`🔒`) on tutor fields.
  - Semaforo: Standard color + icon + semantic text representation. Never show numeric AI scores to tutors.
  - Degradation mode support: Handle `aiEngineStatus === 'unavailable'` gracefully via banner notifications without blocking manual features.
  - Character limit constraints (mín. 30 chars for follow-up notes/evidence).

## Proposed Changes

### Bloque 0 — Asignación Tutor↔Alumno
- **Modify** User creation form in Admin/Docente panels to support a two-step temporary flow:
  1. `POST /users` to create the student account and retrieve the UID.
  2. `PATCH /carreras/asignar/alumno/{alumnoId}` with `{ carreraId, tutorId }` to assign the career and tutor reference.
- **Modify** Docente Dashboard to list "Mis tutorados" by fetching `GET /carreras/{carreraId}/alumnos` and filtering by the logged-in docente UID.
- **Modify** Admin Dashboard student list to display the "Tutor asignado" name.

### Bloque 1 — Correcciones Urgentes
- **Modify** `src/services/api/surveys.ts`: Correct `POST /surveys/:id/submit` to `POST /questionnaire/submit`.
- **Modify** `src/services/api/admin.ts`: Correct report endpoint from `/reports/export` to `POST /admin/reports/generate`.
- **Modify** `src/services/api/audit.ts`: Verify public endpoint `POST /encuesta/verificacion/{token}/submit` and ensure it runs without JWT header.

### Bloque 2 & 3 — Mock → Real
- **Modify** `src/services/api/alerts.ts`: Un-comment and verify `GET /alerts/priority`, `POST /alerts/{id}/followup`, `PUT /alerts/{id}/close`.
- **Modify** `src/services/api/students.ts`: Un-comment and verify `GET /students/{id}/risk-profile` and `GET /students/{id}/academic-history`.
- **Modify** `src/services/api/surveys.ts`: Un-comment and verify `GET /surveys/{id}/resources`.
- **Modify** `src/services/api/referrals.ts`: Un-comment and verify all capacity, referral creation, acceptance, and clinical note actions.
- **Modify** `src/services/api/audit.ts`: Un-comment and verify all tutor audit logs and discrepancy listings.

### Bloque 5 — Endpoints Nuevos
- **New File** `src/services/api/questionnaire.ts`: Implement new questionnaire-related calls (`GET /questionnaire/mis-evaluaciones`, `GET /questionnaire/alumno/{uid}`, `GET /questionnaire/todas`).
- **Modify** `src/services/api/users.ts`: Add `userService.getById(uid)`.
- **Modify** `src/services/api/admin.ts`: Add career assignments, fetch career by ID, students by career, teachers by career.
- **Modify** `src/services/api/audit.ts`: Add `GET /audit/micro-surveys/{alertId}/status`.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure type checks and bundling compile without errors.

### Manual Verification
- Deploy/run locally with `npm run dev`.
- Verify student creation form triggers the two-step allocation flow successfully.
- Verify priority alert lists load without displaying raw AI risk percentage to docente.
