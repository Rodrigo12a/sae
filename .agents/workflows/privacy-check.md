---
description: Auditar que la privacidad diferencial por rol está correctamente implementada antes de cualquier commit.
---

# Workflow: /privacy-check
> **Trigger**: `/privacy-check` o `/privacy-check [archivo o componente]`  
> **Propósito**: Auditar que la privacidad diferencial por rol está correctamente implementada antes de cualquier commit.  
> **Cuándo usarlo**: Antes de cerrar cualquier HU que involucre datos de estudiantes. Obligatorio para HU004, HU009, HU010, HU015.

---

## Auditoría en 4 Capas

### Capa 1 — Tipos TypeScript

```
Buscar en src/types/ y src/features/:

BUSCAR (debe estar AUSENTE en tipos del rol Tutor):
  grep -r "diagnosticoClinico" --include="*.ts" --include="*.tsx"

Si aparece en un tipo que el Tutor puede consumir:
  → ERROR CRÍTICO: detener todo, corregir antes de continuar

Verificar que existen tipos separados por rol:
  → HealthProfileTutor (sin diagnosticoClinico)
  → HealthProfileMedico (con diagnosticoClinico)
  → NUNCA un solo tipo compartido para ambos roles
```

### Capa 2 — Componentes JSX

```
Para cada componente que renderiza datos de salud:

Verificar que el componente del Tutor:
  → NO importa tipos que contengan diagnosticoClinico
  → NO tiene campos vacíos/placeholder que insinúen datos ocultos
  → SÍ muestra el candado visual (LockIcon) con tooltip correcto
  → Tooltip correcto: "Dato clínico confidencial — gestionado por Medicina"

Para notas del Psicólogo:
  → Cuando nota es privada: el Administrador solo ve
    "Intervención psicológica activa — contenido confidencial"
  → NO hay ningún campo vacío, NO hay placeholder del contenido

Verificar separación de componentes:
  → <SaludTutor /> y <SaludMedico /> son componentes DISTINTOS
  → No hay un componente único con condicional if(role === 'tutor')
     que filtre campos del mismo objeto de datos
```

### Capa 3 — Llamadas a la API

```
Para cada llamada en src/services/api/:

Verificar que el endpoint del backend es diferente por rol:
  → GET /students/:id/risk-profile (tutor) → respuesta sin diagnosticoClinico
  → GET /medical/students/:id/health (medico) → respuesta con diagnosticoClinico

Verificar que NO hay un solo endpoint con toda la información
que el frontend filtre en el cliente:
  → El filtrado DEBE ocurrir en el servidor
  → Si se detecta filtrado en el cliente → TENSIÓN ARQUITECTÓNICA, documentar
```

### Capa 4 — Pantalla de Consentimiento

```
Solo aplica para módulo de encuesta (HU007):

Verificar que:
  → La pantalla de consentimiento es pantalla completa (no popup, no modal)
  → Tiene botón "Acepto y continuar" Y botón "No, gracias"
  → El botón de rechazo explica consecuencias sin presionar
  → No se puede saltar o minimizar en el flujo de primera vez
```

---

## Reporte de Auditoría

```markdown
# Privacy Check Report
Fecha: [fecha]
Componentes auditados: [lista]

## Capa 1 — Tipos TypeScript
Estado: ✅ / ❌
Hallazgos: [descripción o "sin hallazgos"]

## Capa 2 — Componentes JSX
Estado: ✅ / ❌
Hallazgos: [descripción o "sin hallazgos"]

## Capa 3 — Llamadas a la API
Estado: ✅ / ❌
Hallazgos: [descripción o "sin hallazgos"]

## Capa 4 — Consentimiento (si aplica)
Estado: ✅ / N/A

## Veredicto Final
✅ APROBADO — Puede proceder al cierre de la HU
❌ RECHAZADO — [lista de correcciones requeridas]
```

---

## Correcciones Automáticas

Si se detectan problemas en la Capa 1 (tipos):
```
→ Separar en dos interfaces distintas
→ Agregar comentario // PRIVACIDAD: tipo exclusivo para rol [X]
→ Nunca fusionar los tipos
```

Si se detectan problemas en la Capa 2 (JSX):
```
→ Separar en dos componentes: <Salud[Rol]> distintos
→ Agregar LockIcon con tooltip correcto
→ Verificar que el DOM inspeccionado no contiene el campo
```
