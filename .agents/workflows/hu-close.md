---
description: Verificar que una HU cumple todos sus criterios de aceptación antes de declararla completada.
---

# Workflow: /hu-close
> **Trigger**: `/hu-close [HU-ID]`  
> **Propósito**: Verificar que una HU cumple todos sus criterios de aceptación antes de declararla completada.  
> **Cuándo usarlo**: Al terminar la implementación, antes de hacer merge o pasar a la siguiente HU.

---

## Pasos del Workflow

### Paso 1 — Auditoría de Trazabilidad

```
Para cada archivo creado/modificado en esta HU:
  → ¿Tiene comentario de cabecera con @epic, @hu, @ux, @api?
  → Si no: agregar antes de continuar

Verificar que design.md está actualizado:
  → ¿El nuevo endpoint está documentado en la sección correspondiente?
  → ¿El roadmap de módulos refleja el estado actualizado (⬜ → ✅)?
```

### Paso 2 — Checklist de Criterios Gherkin

Leer spec.md para [HU-ID] y verificar cada escenario:

```
Por cada escenario definido:
  □ Escenario 1 (happy path): ¿implementado y funcional?
  □ Escenario 2 (variante): ¿implementado?
  □ Edge case(s): ¿contemplados en el código?

Criterios específicos por tipo de HU:

  HUs de Formularios (HU005, HU006, HU007):
  □ Validación mínima de caracteres activa (≥ 30 chars donde aplica)
  □ Contador visible en tiempo real
  □ Botón deshabilitado hasta cumplir requisito
  □ Mensaje de error inline (no dialog)

  HUs con datos del Motor de IA (HU003, HU004, HU019, HU020):
  □ Estado degradado implementado con timestamp
  □ Etiqueta operativa (no score numérico)
  □ Ícono "Ojo/Revisar" disponible como estado alternativo al semáforo

  HUs con privacidad diferencial (HU004, HU009, HU010, HU015):
  □ Ejecutar /privacy-check antes de cerrar
```

### Paso 3 — Checklist de Accesibilidad Final

```
□ Contraste ≥ 4.5:1 en todos los textos del componente
□ Semáforo: siempre color + ícono + texto (nunca solo color)
□ Elementos táctiles ≥ 44×44 px
□ aria-labels en íconos funcionales
□ aria-hidden en íconos decorativos
□ Focus ring visible
□ Errores de validación con aria-describedby
□ Navegación por teclado completa
```

### Paso 4 — Checklist de Performance

```
□ Widget de alertas (HU003): ¿datos pre-computados? ¿sin fetch on-demand?
□ Dashboard ejecutivo (HU016): ¿skeleton durante carga?
□ Encuesta estudiantil (HU007): ¿offline handler con IndexedDB?
□ Endpoints con datos cifrados (AES-256): ¿spinner/skeleton presente? (+50-100ms)
□ Exportación > 10,000 filas (HU018): ¿proceso asíncrono? ¿UI no bloqueante?
```

### Paso 5 — Verificación de Mocks Pendientes

```
Buscar en todos los archivos de esta HU:
  grep "// TODO: conectar"

Por cada TODO encontrado:
  → Documentar en .agent/implementations/[HU-ID]-plan.md sección "Mocks Pendientes"
  → Incluir: endpoint esperado, método HTTP, contrato TypeScript
  → Formato: // TODO: conectar a [METHOD] /api/[endpoint] cuando esté disponible
```

### Paso 6 — Actualizar Estado en design.md

```
Sección "11. Módulos por Desarrollar — Roadmap Frontend":
  Cambiar ⬜ Pendiente → ✅ Completado para las HUs cerradas

Si se crearon nuevos contratos de API no documentados:
  → Agregar en la sección del módulo correspondiente en design.md
```

### Paso 7 — Generar Reporte de Cierre

Crear `.agent/implementations/[HU-ID]-close.md`:

```markdown
# Cierre: [HU-ID] — [Título]
Fecha: [fecha]
Estado: ✅ Completada

## Archivos Creados
- [lista de archivos con paths]

## Archivos Modificados
- [lista con descripción del cambio]

## Criterios Cubiertos
- [x] Escenario 1: [descripción]
- [x] Escenario 2: [descripción]
- [x] Edge case: [descripción]

## Mocks Pendientes de Conexión Real
- [ ] [METHOD] /api/[endpoint] — Componente: [nombre]

## Notas para el Siguiente Ciclo
- [observaciones relevantes para HUs dependientes]
```

---

## Output

- HU marcada como completada en design.md
- Reporte de cierre generado
- Lista de mocks pendientes documentada
- design.md actualizado con contratos nuevos

---

## Criterio de Rechazo

Si alguno de estos puntos falla, la HU **no puede cerrarse**:

```
❌ diagnosticoClinico presente en DOM del rol Tutor
❌ Score numérico del Motor de IA visible en algún componente
❌ Estado vacío implementado como pantalla en blanco
❌ Semáforo usando solo color sin ícono ni texto
❌ Algún escenario Gherkin sin cubrir
```
