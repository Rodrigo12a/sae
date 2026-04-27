# Implementation Plan: HU014 — Aceptar y gestionar caso derivado (psicólogo)
Fecha: 22 Abril 2026
Actor: Psicólogo
Épica: Épica 5 (Derivaciones)

## Resumen y Contexto
Esta historia de usuario permite a los usuarios con rol de `psicologo` acceder a su bandeja de pendientes, visualizar los casos derivados junto con su expediente completo (incluyendo datos sensibles y diagnósticos, ya que el psicólogo tiene los permisos), y aceptar formalmente los casos, lo que notifica de vuelta al tutor.

## Requerimientos UX y Criterios de Aceptación a Cubrir
- [ ] Escenario 1: Visualizar bandeja de pendientes con acceso al expediente completo.
- [ ] Escenario 2: Validar que el botón "Aceptar caso" está deshabilitado si no hay un motivo de aceptación documentado.
- [ ] Escenario 3: Al aceptar el caso, notificar al tutor ("El caso ha sido recibido por Psicología").

## Componentes a Crear
- [ ] `src/app/psicologo/layout.tsx` (Si no existe, configurar layout con `RoleLayout` para `psicologo`)
- [ ] `src/app/psicologo/bandeja/page.tsx` (Página de la bandeja de entrada de derivaciones)
- [ ] `src/features/derivaciones/components/PendingReferralsBandeja/index.tsx` (Componente que lista los casos pendientes)
- [ ] `src/features/derivaciones/components/AcceptReferralModal/index.tsx` (Modal o panel lateral para aceptar el caso, exigiendo el motivo)
- [ ] `src/features/derivaciones/hooks/usePendingReferrals.ts` (Hook con React Query para obtener pendientes)
- [ ] `src/features/derivaciones/hooks/useAcceptReferral.ts` (Hook con React Query para la mutación de aceptación)

## Componentes a Modificar
- [ ] `src/features/derivaciones/types.ts` (Añadir tipos `PendingReferral` y `AcceptReferralRequest`)
- [ ] `src/services/api/referrals.ts` (Implementar endpoints mocks: `getPendingReferrals` y `acceptReferral`)

## Endpoints Necesarios
- `GET /api/referrals/pending` → Obtiene las derivaciones pendientes asignadas a psicología. → Estado: **Mock requerido**.
- `PUT /api/referrals/:id/accept` → Acepta el caso, recibiendo un motivo. → Estado: **Mock requerido**.

## Tipos TypeScript Requeridos
- `PendingReferral`: Interface con `id`, `studentId`, `studentName`, `motivoId`, `descripcionObservable`, y campos para acceso al expediente.
- `AcceptReferralRequest`: Interface con `referralId` y `motivoAceptacion`.

## Estados de UI a Implementar
- [ ] **Loading**: Skeleton para la carga de la bandeja de entrada.
- [ ] **Success**: Tabla/Lista renderizada correctamente y confirmación tipo Toast al aceptar.
- [ ] **Empty state**: Mensaje amigable cuando no hay casos derivados en espera.
- [ ] **Error**: Toast en caso de error al cargar o al aceptar la derivación.

## Checklist de Privacidad
- [ ] ¿El componente se renderiza para el Tutor? No, solo para el Psicólogo.
- [ ] Al acceder al expediente completo desde la bandeja, ¿el psicólogo puede ver el `diagnosticoClinico`? **Sí**, el backend y el frontend lo permiten para este rol, a diferencia del tutor.
- [ ] ¿Los tipos TypeScript reflejan la restricción por rol? Se asegurará de que el psicólogo consuma tipos que incluyan los datos sensibles, o en su defecto que el expediente cargado considere el rol activo.
