# Implementation Plan: HU015 — Bitácora confidencial de intervención psicológica
Fecha: 2026-04-22
Actor: Psicólogo
Épica: EPICA-5 Derivaciones y Atención Especializada

## Análisis de Dependencias
¿Esta HU depende de otra HU no implementada aún?
- Depende parcialmente de HU014 (Bandeja de casos) para tener casos aceptados, pero la vista de bitácora en `/psicologo/caso/[id]` se puede implementar de forma independiente asumiendo que ya hay un caso aceptado en el sistema con `id`.

¿Qué componentes de components/ui/ pueden reutilizarse?
- `<LockIcon />` (para indicar privacidad diferencial)
- Sistema de inputs y botones base
- Skeleton de carga para la UI

¿Hay restricciones de privacidad diferencial?
- SÍ, **CRÍTICAS**. 
- Rol `tutor`: No debe tener acceso a las notas clínicas privadas. Solo recibirá la `recomendacionOperativa`.
- Rol `administrador`: Solo verá un estado opaco ("Intervención psicológica activa — contenido confidencial"), sin acceso a la bitácora.
- Rol `psicologo`: Acceso total. Las notas con `esPrivada: true` serán cifradas en el servidor (responsabilidad del backend, pero el frontend debe enviar la flag explícita y mostrar la UI correspondiente).

¿El endpoint del backend existe?
- No, lo simularemos con Mock. Añadiremos la función a `src/services/api/referrals.ts`.

## Tipos TypeScript Requeridos
En `src/features/derivaciones/types.ts`:
```typescript
export interface ClinicalNoteRequest {
  referralId: string;
  contenido: string;
  esPrivada: boolean;
  recomendacionOperativa?: string;
}
```

## Endpoints Necesarios
En `src/services/api/referrals.ts`:
- `POST /api/referrals/:id/notes` → Registrar nota clínica (pública o privada) → Estado: Mock

## Componentes a Crear
- [ ] `src/features/derivaciones/hooks/useClinicalNote.ts`
- [ ] `src/features/derivaciones/components/ClinicalNoteEditor/index.tsx` (Componente de UI con toggle "Nota privada", validación Zod, y estados)
- [ ] `src/app/psicologo/caso/[id]/page.tsx` (Página principal para el expediente del caso, aloja el editor de la bitácora)

## Estados de UI a Implementar
- [ ] Loading (skeleton) al cargar historial del caso o al guardar nota
- [ ] Success (Toast confirmando registro de bitácora)
- [ ] Private Mode (Fondo `bg-[#F3E8FF]` o violeta claro cuando `esPrivada === true`, icono de candado cerrado)
- [ ] Public Recommendation Mode (Input extra de `recomendacionOperativa` visible, alerta clara sobre la visibilidad para el tutor)

## Criterios de Aceptación a Cubrir
- [ ] Escenario 1: El psicólogo crea una nota estrictamente privada (cifrado asíncrono, UI diferencial morada).
- [ ] Escenario 2: El psicólogo publica una recomendación para el tutor con vista previa antes del envío.
- [ ] Edge case: Fallo de red al guardar la bitácora (Circuit breaker de React Query lo reintenta y muestra error toast si falla).

## Checklist de Privacidad
- [ ] ¿El componente se renderiza para el Tutor? No, este editor solo vive en el layout del Psicólogo.
- [ ] ¿Los tipos TypeScript reflejan la restricción por rol? Sí, `ClinicalNoteRequest` define claramente `esPrivada` y aísla la `recomendacionOperativa`.
- [ ] ¿El candado visual está implementado donde aplica? Sí, es obligatorio en la sección de Nota Privada.
