# Implementation Plan: HU010 — Semáforo de salud con privacidad diferencial
Fecha: 2026-04-22
Actor: Médico / Tutor
Épica: Épica 4 — Módulo Médico con Privacidad Diferencial

## Resumen del Problema
El sistema debe permitir que el Médico registre condiciones de salud que generen un impacto visual (Semáforo) en el perfil del estudiante, pero garantizando que el Tutor **NUNCA** vea el diagnóstico clínico. El Tutor solo verá una "Etiqueta Operativa" (ej: "Requiere apoyo en Matemáticas" en lugar de "TDAH").

## Componentes a Crear
- [ ] `src/features/medico/components/StudentHealthDetail/index.tsx`: Vista detallada para el Médico con capacidad de edición del semáforo y diagnóstico.
- [ ] `src/features/medico/components/HealthSemaphoreBadge/index.tsx`: Componente especializado que renderiza el estado de salud según el rol.
- [ ] `src/features/medico/hooks/useStudentHealth.ts`: Hook para obtener y actualizar el perfil de salud de un estudiante.

## Componentes a Modificar
- [ ] `src/features/dashboard-tutor/components/RiskProfilePanel/index.tsx`: Integrar la dimensión de salud usando el nuevo badge de privacidad diferencial.
- [ ] `src/services/api/medical.ts`: Añadir endpoints `getStudentHealth(id)` y `updateStudentHealth(id, data)`.

## Endpoints Necesarios
- `GET /api/medical/students/:id/health` → Obtiene perfil de salud → Estado: Mock (Diferencial por rol)
- `PUT /api/medical/students/:id/health` → Actualiza diagnóstico y semáforo → Estado: Mock

## Tipos TypeScript Requeridos
- Reutiliza `HealthProfileMedico` y `HealthProfileTutor` de `src/features/medico/types.ts`.

## Estados de UI a Implementar
- [ ] Loading (skeleton) en el perfil de salud.
- [ ] Success: Feedback visual tras actualización del Médico.
- [ ] Empty state: Cuando no hay registros médicos previos.
- [ ] Error: Manejo de 403 (Permisos) y 404.

## Criterios de Aceptación a Cubrir
- [ ] **Escenario 1 (Vista Tutor)**: El Tutor ve el semáforo y el texto "Seguimiento activo recomendado", pero el campo `diagnóstico` no existe en el HTML.
- [ ] **Escenario 2 (Vista Médico)**: El Médico ve "Asma Crónica" y puede cambiar el semáforo de Amarillo a Rojo.
- [ ] **Escenario 3 (Seguridad)**: Un Tutor intentando acceder al endpoint de médico recibe un 403.

## Checklist de Privacidad
- [ ] ¿El componente se renderiza para el Tutor?
      Si sí: ¿el campo diagnosticoClinico está ausente? **SÍ**.
- [ ] ¿Los tipos TypeScript reflejan la restricción por rol? **SÍ (ya definidos)**.
- [ ] ¿El candado visual está implementado donde aplica? **SÍ (usar LockIcon)**.

## Riesgos y Notas
- **Latencia**: El perfil de salud es una dimensión crítica en el dashboard, se requiere Skeleton UI.
- **Vibes**: El diseño debe ser consistente con la estética de "limpieza médica" (tonos suaves, íconos claros).
