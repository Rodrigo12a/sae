# Cuestionario para Detectar Alumnos en Riesgo de Deserción — UPTX

## Descripción

Este cuestionario detecta factores de riesgo de deserción escolar en alumnos de la UPTX. La información es utilizada únicamente con fines estadísticos y de acompañamiento académico.

---

## Instrucciones para el Agente

### Flujo de envío al backend

1. El alumno inicia sesión y obtiene su `access_token` (JWT).  
2. El agente presenta las preguntas al alumno y recopila sus respuestas.  
3. Al finalizar, el agente envía el array `respuestas` al endpoint con el token en el header.  
4. El backend guarda la evaluación con estado `pendiente` hasta que el modelo ML la procese.

### Endpoint

POST https://sae-backend-beige.vercel.app/questionnaire/submit

**Headers requeridos:**

Authorization: Bearer \<access\_token\>

Content-Type: application/json

**Body requerido:**

{

  "respuestas": \[\<array de 50 valores numéricos, uno por pregunta\>\]

}

⚠️ El UID del alumno es extraído automáticamente del JWT. El frontend **no** debe enviarlo.  
⚠️ Solo puede ser usado por usuarios con rol **ALUMNO**.

### Codificación de respuestas

Cada pregunta debe mapearse a un valor numérico según su tipo:

#### Preguntas de escala Likert (Nunca → Siempre)

| Opción | Valor |
| :---- | :---- |
| Nunca | 1 |
| Rara vez | 2 |
| Algunas veces | 3 |
| Frecuentemente | 4 |
| Siempre | 5 |

#### Preguntas de escala Likert (opción positiva)

| Opción | Valor |
| :---- | :---- |
| Nunca | 1 |
| Rara vez | 2 |
| Algunas veces | 3 |
| Frecuentemente | 4 |
| Siempre | 5 |

#### Preguntas binarias (Sí/No)

| Opción | Valor |
| :---- | :---- |
| No | 0 |
| Sí | 1 |

#### Preguntas categóricas — ver tabla de codificación por pregunta más abajo.

---

## Preguntas del Cuestionario

Las preguntas están numeradas del **1 al 50** en el orden en que deben ser enviadas en el array `respuestas`.

---

### Área General (Preguntas 1–4)

**Pregunta 1 — Nombre completo**  
Tipo: Texto libre (no se envía en el array; se usa solo para identificación visual en el frontend)

**Pregunta 2 — Correo electrónico**  
Tipo: Texto libre (no se envía en el array; el backend lo toma del JWT)

**Pregunta 3 — Edad**  
Tipo: Numérico (enviar el valor tal cual, ej. `19`)  
Posición en array: `respuestas[0]`

**Pregunta 4 — Género**  
Tipo: Categórica  
| Opción | Valor | |--------|-------| | Femenino | 1 | | Masculino | 2 |  
Posición en array: `respuestas[1]`

---

### Área Socioeconómica (Preguntas 5–16)

**Pregunta 5 — ¿Ambos padres tienen el mismo nivel académico?**  
Tipo: Binaria  
Posición en array: `respuestas[2]`

**Pregunta 6 — Último grado de estudios del padre**  
| Opción | Valor | |--------|-------| | Primaria | 1 | | Secundaria | 2 | | Preparatoria | 3 | | Licenciatura | 4 | | Posgrado | 5 |  
Posición en array: `respuestas[3]`

**Pregunta 7 — Último grado de estudios de la madre**  
*(Misma codificación que pregunta 6\)*  
Posición en array: `respuestas[4]`

**Pregunta 8 — Medio de transporte para asistir a la universidad**  
| Opción | Valor | |--------|-------| | Transporte público | 1 | | Auto propio | 2 | | Moto | 3 | | Bicicleta | 4 | | A pie | 5 |  
Posición en array: `respuestas[5]`

**Pregunta 9 — ¿Actualmente trabajas?**  
Tipo: Binaria  
Posición en array: `respuestas[6]`

**Pregunta 10 — ¿Tu trabajo interfiere con horarios o tareas escolares?**  
Tipo: Binaria  
Posición en array: `respuestas[7]`

**Pregunta 11 — ¿Tu familia te apoya para sufragar tus estudios?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[8]`

**Pregunta 12 — ¿Cuentas con recursos para libros o proyectos escolares?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[9]`

**Pregunta 13 — ¿Tu familia atraviesa dificultades económicas?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[10]`

**Pregunta 14 — Número de integrantes en tu familia**  
| Opción | Valor | |--------|-------| | 2 | 2 | | 3 | 3 | | 4 | 4 | | 5 | 5 | | 6 | 6 | | Más de 7 | 7 |  
Posición en array: `respuestas[11]`

**Pregunta 15 — Número de miembros que aportan al ingreso familiar**  
| Opción | Valor | |--------|-------| | 1 | 1 | | 2 | 2 | | 3 | 3 | | 4 | 4 | | 5 | 5 | | Más de 5 | 6 |  
Posición en array: `respuestas[12]`

**Pregunta 16 — Monto de ingreso familiar mensual (MXN)**  
| Opción | Valor | |--------|-------| | $4,000 | 1 | | $5,000 | 2 | | $6,000 | 3 | | $7,000 | 4 | | Más de $7,000 | 5 |  
Posición en array: `respuestas[13]`

**Pregunta 17 — ¿Alguien depende económicamente de ti?** *(selección múltiple — enviar suma de valores)*  
| Opción | Valor | |--------|-------| | Ninguno | 0 | | Hijos | 1 | | Esposa/Esposo | 2 | | Padre | 3 | | Madre | 4 | | Hermanos | 5 |

Si aplica selección múltiple, enviar el valor del dependiente de mayor peso o el primero seleccionado.  
Posición en array: `respuestas[14]`

---

### Área Académica / Hábitos de Estudio (Preguntas 18–26)

**Pregunta 18 — Carrera que cursas actualmente**  
| Opción | Valor | |--------|-------| | Ing. en Tecnologías de la Información e Innovación Digital | 1 | | Mecatrónica | 2 | | Financiera | 3 | | Industrial | 4 | | Química | 5 | | Biotecnología | 6 | | Sistemas Automotrices | 7 |  
Posición en array: `respuestas[15]`

**Pregunta 19 — Cuatrimestre actual**  
Enviar el número directamente (1–10).  
Posición en array: `respuestas[16]`

**Pregunta 20 — ¿Por qué elegiste tu carrera?**  
| Opción | Valor | |--------|-------| | Porque me gusta | 1 | | Porque voy a heredar trabajo de familiar/conocido | 2 | | Porque me obligaron | 3 |  
Posición en array: `respuestas[17]`

**Pregunta 21 — Horas de estudio fuera de clases por semana**  
| Opción | Valor | |--------|-------| | 0 | 0 | | 1 | 1 | | 2 | 2 | | 3 | 3 | | Más de 3 | 4 |  
Posición en array: `respuestas[18]`

**Pregunta 22 — ¿Organizas tu tiempo para tareas y proyectos?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[19]`

**Pregunta 23 — Medios con que cuentas para estudiar en casa** *(selección múltiple — enviar conteo de recursos disponibles)*  
| Recursos disponibles | Valor | |----------------------|-------| | Ninguno | 0 | | 1 recurso | 1 | | 2 recursos | 2 | | 3 recursos | 3 | | 4 recursos (todos) | 4 |  
*(Computadora, Internet, Celular, Material escrito)*  
Posición en array: `respuestas[20]`

**Pregunta 24 — ¿Te resulta fácil concentrarte durante las clases?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[21]`

**Pregunta 25 — ¿Cumples con tareas académicas en los tiempos establecidos?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[22]`

**Pregunta 26 — ¿Comprendes los contenidos de tus materias sin dificultad?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[23]`

**Pregunta 27 — ¿Buscas apoyo académico cuando tienes dudas?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[24]`


### Área Psicoemocional (Preguntas 28–37)

**Pregunta 28 — Estado civil**  
| Opción | Valor | |--------|-------| | Soltero/a | 1 | | Casado/a | 2 | | Unión Libre | 3 | | Divorciado/a | 4 |  
Posición en array: `respuestas[25]`

**Pregunta 29 — ¿Tienes hijos?**  
Tipo: Binaria  
Posición en array: `respuestas[26]`

**Pregunta 30 — ¿Hay armonía en tu casa para concentrarte en tus estudios?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[27]`

**Pregunta 31 — ¿Con quién vives actualmente?**  
| Opción | Valor | |--------|-------| | Con ambos padres | 1 | | Con mamá | 2 | | Con papá | 3 | | Con hermanos | 4 | | Con abuelos | 5 | | Con pareja | 6 | | Solo/a | 7 |  
Posición en array: `respuestas[28]`

**Pregunta 32 — ¿Tienes a alguien con quien hablar cuando estás estresado/a?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[29]`

**Pregunta 33 — ¿Has pensado en abandonar la carrera o cambiar de programa?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[30]`

**Pregunta 34 — Si pensaras en abandonar, ¿cuál sería la razón principal?**  
| Opción | Valor | |--------|-------| | Situación económica | 1 | | Situación emocional | 2 | | Salud | 3 | | Poca motivación | 4 | | No me gusta la carrera | 5 |  
Posición en array: `respuestas[31]`

**Pregunta 35 — ¿Has ocupado el servicio de psicología de la universidad?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[32]`

**Pregunta 36 — ¿El estrés o la ansiedad afectan tu desempeño académico?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[33]`

**Pregunta 37 — ¿Qué tipo de apoyo consideras más útil para continuar tus estudios?**  
| Opción | Valor | |--------|-------| | Económico | 1 | | Emocional | 2 | | Académico | 3 |  
Posición en array: `respuestas[34]`

**Pregunta 38 — ¿Los problemas personales influyen negativamente en tu desempeño escolar?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[35]`

### Área Psicosocial (Preguntas 39–45)

**Pregunta 39 — ¿Sientes el apoyo de tu familia para continuar tus estudios?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[36]`

**Pregunta 40 — Tiempo en redes sociales al día**  
| Opción | Valor | |--------|-------| | 1 hora | 1 | | 2 horas | 2 | | 3 horas | 3 | | 4 horas | 4 | | 5 horas | 5 | | Más de 5 horas | 6 |  
Posición en array: `respuestas[37]`

**Pregunta 41 — ¿Con qué frecuencia consumes bebidas alcohólicas?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[38]`

**Pregunta 42 — ¿Con qué frecuencia juegas videojuegos?**  
| Opción | Valor | |--------|-------| | No juego | 0 | | Menos de 1 hora/día | 1 | | Entre 1 y 2 horas/día | 2 | | Entre 3 y 4 horas/día | 3 | | Más de 4 horas/día | 4 |  
Posición en array: `respuestas[39]`

**Pregunta 43 — ¿Con qué frecuencia usas tu teléfono durante horas de estudio?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[40]`

**Pregunta 44 — ¿Sientes presión externa que te hace considerar dejar la universidad?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[41]`

**Pregunta 45 — ¿Te has sentido excluido/a en actividades académicas o sociales?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[42]`

**Pregunta 46 — ¿Has tenido conflictos con compañeros o docentes?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[43]`

**Pregunta 47 — ¿Tienes o padeces alguna enfermedad o trastorno neurológico?**  
Tipo: Binaria  
Posición en array: `respuestas[44]`

### Área de Integración Institucional (Preguntas 48–52)

**Pregunta 48 — ¿Cuentas con alguna beca de apoyo?**  
Tipo: Binaria  
Posición en array: `respuestas[45]`

**Pregunta 49 — ¿Formas parte de algún selectivo en la universidad?**  
Tipo: Binaria  
Posición en array: `respuestas[46]`

**Pregunta 50 — Si perteneces a un selectivo, ¿cuánto tiempo al día inviertes?**  
| Opción | Valor | |--------|-------| | No aplica / No pertenezco | 0 | | 1 hora | 1 | | 2 horas | 2 | | 3 horas | 3 | | Más de 3 horas | 4 |  
Posición en array: `respuestas[47]`

**Pregunta 51 — ¿Te sientes apoyado/a por tus profesores cuando tienes dificultades?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[48]`

**Pregunta 52 — ¿Sabes a quién acudir dentro de la institución ante un problema?**  
Tipo: Likert (1=Nunca, 5=Siempre)  
Posición en array: `respuestas[49]`

## Resumen del array `respuestas` (50 posiciones)

| Índice | Pregunta |
| :---- | :---- |
| `[0]` | Edad |
| `[1]` | Género |
| `[2]` | ¿Ambos padres mismo nivel académico? |
| `[3]` | Nivel académico del padre |
| `[4]` | Nivel académico de la madre |
| `[5]` | Medio de transporte |
| `[6]` | ¿Trabaja actualmente? |
| `[7]` | ¿Trabajo interfiere con estudios? |
| `[8]` | Apoyo familiar económico |
| `[9]` | Recursos para libros/proyectos |
| `[10]` | Dificultades económicas familiares |
| `[11]` | Número de integrantes en familia |
| `[12]` | Miembros que aportan al ingreso |
| `[13]` | Ingreso familiar mensual |
| `[14]` | Dependientes económicos |
| `[15]` | Carrera |
| `[16]` | Cuatrimestre |
| `[17]` | Motivo de elección de carrera |
| `[18]` | Horas de estudio fuera de clases |
| `[19]` | Organización del tiempo |
| `[20]` | Medios de estudio en casa |
| `[21]` | Concentración en clases |
| `[22]` | Cumplimiento de tareas |
| `[23]` | Comprensión de materias |
| `[24]` | Búsqueda de apoyo académico |
| `[25]` | Estado civil |
| `[26]` | ¿Tiene hijos? |
| `[27]` | Armonía en casa |
| `[28]` | ¿Con quién vive? |
| `[29]` | Red de apoyo emocional |
| `[30]` | Pensamientos de abandono |
| `[31]` | Razón principal para abandonar |
| `[32]` | Uso de servicio psicológico institucional |
| `[33]` | Impacto del estrés/ansiedad académica |
| `[34]` | Tipo de apoyo más útil |
| `[35]` | Influencia de problemas personales |
| `[36]` | Apoyo familiar para estudios |
| `[37]` | Tiempo en redes sociales |
| `[38]` | Consumo de bebidas alcohólicas |
| `[39]` | Frecuencia de videojuegos |
| `[40]` | Uso de celular durante estudio |
| `[41]` | Presión externa para dejar universidad |
| `[42]` | Sentimiento de exclusión social/académica |
| `[43]` | Conflictos con compañeros/docentes |
| `[44]` | Enfermedad o trastorno neurológico |
| `[45]` | ¿Tiene beca? |
| `[46]` | ¿Pertenece a selectivo? |
| `[47]` | Tiempo invertido en selectivo |
| `[48]` | Apoyo docente ante dificultades |
| `[49]` | Sabe a quién acudir en la institución |


## Notas para el agente

- Las preguntas de **texto libre** (nombre, correo) **no se incluyen en el array** — son solo para UX.  
- El array debe tener **exactamente 50 valores** antes de enviar.  
- Si una pregunta no aplica (ej. selectivo para quien no pertenece), enviar `0`.  
- Validar que todos los valores estén dentro del rango permitido antes de hacer el POST.  
- En caso de error de autenticación (401), el agente debe solicitar al usuario que inicie sesión nuevamente.

