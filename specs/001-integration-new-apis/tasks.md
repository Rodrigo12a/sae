# Tasks: 001-integration-new-apis

**Input**: Design documents from `/specs/001-integration-new-apis/`
**Prerequisites**: plan.md (required), spec.md (required)

## Phase 1: Setup (Shared Infrastructure)
- [x] T001 Initialize branch environment variables for Spec-Kit execution tracking.

## Phase 2: Foundational (Correcting Endpoint Discrepancies)
- [x] T002 [P] Correct `POST /questionnaire/submit` endpoint in `src/services/api/surveys.ts`.
- [x] T003 [P] Correct `POST /admin/reports/generate` endpoint in `src/services/api/admin.ts`.
- [x] T004 [P] Correct public endpoint `POST /encuesta/verificacion/{token}/submit` in `src/services/api/audit.ts`.

## Phase 3: Core Integration (Mock to Real Reconnections)
- [x] T005 [P] Un-comment real calls in `src/services/api/alerts.ts` (`getPriorityAlerts`, `registerFollowUp`, `closeAlert`).
- [x] T006 [P] Un-comment real calls in `src/services/api/students.ts` (`getStudentRiskProfile`, `getStudentAcademicHistory`).
- [x] T007 [P] Un-comment real calls in `src/services/api/surveys.ts` (`getSurveyResources`).
- [x] T008 [P] Un-comment real calls in `src/services/api/referrals.ts` (all capacity, creation, acceptance, and clinical note actions).
- [x] T009 [P] Un-comment real calls in `src/services/api/audit.ts` (inconsistencies lists, tutor history, resolve inconsistency).

## Phase 4: UI Features & Flow Integrations
- [x] T010 Implement the two-step allocation flow in student creation forms (Docente & Admin panels) using `POST /users` and `PATCH /carreras/asignar/alumno/{alumnoId}`.
- [x] T011 Update the Docente dashboard UI to fetch career students `GET /carreras/{carreraId}/alumnos` and filter/display "Mis tutorados".
- [x] T012 Update the Admin dashboard student list to display the assigned tutor name from the backend.

## Phase 5: New Endpoints Implementation
- [x] T013 Create new service file `src/services/api/questionnaire.ts` and define `/questionnaire/mis-evaluaciones`, `/questionnaire/alumno/{uid}`, `/questionnaire/todas`.
- [x] T014 Add `userService.getById(uid)` to `src/services/api/users.ts`.
- [x] T015 Add career endpoints to `src/services/api/admin.ts` (`GET /carreras/{id}`, `GET /carreras/{id}/alumnos`, `GET /carreras/{id}/docentes`, `PATCH /carreras/asignar/docente/{docenteId}`, `PATCH /carreras/asignar/alumno/{alumnoId}`).
- [x] T016 Add `auditService.getMicroSurveyStatus(alertId)` to `src/services/api/audit.ts`.

## Phase 6: Polish and Verification
- [x] T017 Verify all files contain appropriate `@module`, `@epic`, `@hu`, `@api`, and `@privacy` metadata comments.
- [x] T018 Check that `diagnosticoClinico` is completely filtered out from tutor layouts.
- [x] T019 Run Next.js build check (`npm run build`) to ensure TypeScript compilation passes.
