Guía de Integración Frontend: Cuestionario \+ Predicción ML  
Este documento explica de forma detallada cómo el equipo de frontend debe enviar los datos del cuestionario al backend, qué hace el sistema internamente para obtener la predicción del modelo de Machine Learning, y cómo mostrar los resultados al alumno. El documento está dirigido principalmente al equipo de frontend.

### **Metadatos del Documento**

| Atributo | Detalle | Atributo | Detalle |
| :---- | :---- | :---- | :---- |
| **Versión** | 2.0 | **Backend** | NestJS 11, Vercel |
| **Fecha** | Mayo 2026 | **Modelo ML** | RandomForest (Cloud Run) |
| **Audiencia** | Equipo Frontend | **Base de datos** | Firebase / Firestore |

1\. ¿Qué es el preguntaId y de dónde viene?  
Cada pregunta del cuestionario SAE tiene un número de identificación único (preguntaId) que corresponde exactamente al número de pregunta visible en el PDF oficial del cuestionario. No es un índice técnico ni un ID de base de datos; es simplemente el número que aparece en el documento impreso que responde el alumno.  
**Regla fundamental:** La pregunta número 6 del PDF del cuestionario SAE siempre tendrá preguntaId \= 6. La pregunta 29 tendrá preguntaId \= 29. No existe ningún cálculo ni transformación, es una relación directa uno a uno.

* **Escala de valores:** La escala general es 0 a 4 (0 \= Nunca/Nada, 1 \= Casi nunca, 2 \= A veces, 3 \= Casi siempre, 4 \= Siempre/Mucho).  
* **Excepción importante (pregunta 10):** Para el número de integrantes del hogar, se debe enviar el número real de personas (1, 2, 3... hasta 10), NO la escala 0-4.

**¿Por qué este diseño?** El cuestionario tiene 52 preguntas en total, pero el modelo de Machine Learning solo utiliza 23 de ellas. Al enviar cada respuesta con su número de pregunta, el backend puede identificar automáticamente cuáles son las 23 que necesita, sin que el frontend tenga que preocuparse por cuáles son relevantes para el modelo. El frontend simplemente envía todo y el backend hace la selección internamente.  
**Ejemplo visual de cómo se construye el array:**  
JavaScript  
// El PDF muestra las preguntas numeradas del 1 al 52\. \[cite: 18\]  
// El frontend construye un objeto por cada pregunta respondida: \[cite: 19\]

{ "preguntaId": 1, "valor": 2 } // Pregunta 1 del PDF \-\> el alumno respondió "2" \[cite: 20\]  
{ "preguntaId": 6, "valor": 3 } // Pregunta 6 del PDF \-\> el alumno respondió "3" \[cite: 21\]  
{ "preguntaId": 10, "valor": 5 } // Pregunta 10 del PDF \-\> el alumno respondió "5" \[cite: 21, 22\]  
{ "preguntaId": 29, "valor": 1 } // Pregunta 29 del PDF \-\> el alumno respondió "1" \[cite: 23, 24\]  
{ "preguntaId": 52, "valor": 0 } // Pregunta 52 del PDF \-\> el alumno respondió "0" \[cite: 25, 27\]

2\. Flujo completo de la pantalla al resultado ML  
El siguiente flujo ocurre cada vez que un alumno termina el cuestionario. El frontend solo realiza una llamada HTTP y recibe todo en una sola respuesta.

1. **Alumno inicia sesión:** El alumno introduce su matrícula y contraseña. El backend responde con un access\_token (JWT). El frontend debe guardar este token para usarlo en los siguientes requests.  
2. **Alumno responde el cuestionario:** La pantalla del cuestionario muestra las 52 preguntas numeradas del PDF. El frontend almacena cada respuesta en un array: { preguntaId, valor }.  
3. **Frontend envía el cuestionario completo:** Al presionar "Enviar", el frontend hace POST /questionnaire/submit con el array completo de respuestas y el token en el header Authorization.  
4. **Backend guarda todas las respuestas:** El backend almacena todas las 52 respuestas en Firestore, en la colección "evaluaciones". El estado inicial es "procesando".  
5. **Backend extrae las 23 variables del modelo:** Internamente, el backend identifica las preguntas con IDs: 4, 6, 7, 9, 10, 12, 13, 16, 17, 21, 22, 26, 28, 29, 32, 36, 38, 40, 43, 46, 48, 49 y 50\. Las traduce a los nombres de columnas que espera el modelo ML.  
6. **Backend llama al microservicio ML:** Envía las 23 variables al microservicio FastAPI desplegado en Google Cloud Run. El modelo RandomForestClassifier devuelve el porcentaje de riesgo y diagnóstico.  
7. **Backend calcula el semáforo y guarda el resultado:** A partir del riesgo\_pct calcula el semáforo (rojo/amarillo/revisar/verde) y actualiza el perfil del alumno en Firestore. Si el semáforo es rojo o amarillo, crea automáticamente una alerta para el tutor.  
8. **Frontend recibe la respuesta con predicción incluida:** Todo lo anterior ocurre en el backend antes de responder. El frontend recibe en un solo JSON: confirmación de guardado \+ predicción ML completa.

3\. Endpoint principal  
POST /questionnaire/submit

| Propiedad | Detalle |
| :---- | :---- |
| **Método** | POST |
| **URL** | https://\<tu-backend\>.vercel.app/questionnaire/submit |
| **Autenticación** | Bearer Token (JWT) header Authorization |
| **Rol requerido** | ALUMNO únicamente |
| **Content-Type** | application/json |

**Headers requeridos:**

* Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  
* Content-Type: application/json

**Estructura del Body (JSON):**  
JSON  
{  
  "respuestas": \[  
    { "preguntaId": 1, "valor": 2 },  
    { "preguntaId": 2, "valor": 3 },  
    { "preguntaId": 3, "valor": 1 },  
    { "preguntaId": 4, "valor": 2 },  
    { "preguntaId": 10, "valor": 5 }, // \<-- numero real de personas, NO escala 0-4  
    { "preguntaId": 52, "valor": 0 }  
  \]  
}

*(Nota obtenida del bloque de código: El studentId NO se envía en el body. El backend lo extrae automáticamente del token JWT.)*  
**Importante:** El campo studentId NO debe incluirse en el body. El backend obtiene el UID del alumno directamente del token JWT enviado en el header. El orden de las preguntas en el array tampoco importa; el backend busca cada una por su preguntaId.  
**Reglas de validación:**

| Campo | Regla | Error si se incumple |
| :---- | :---- | :---- |
| **respuestas** | Array de objetos, mínimo 50 elementos | 400 Bad Request |
| **preguntaId** | Entero entre 1 y 52 | 400 Bad Request |
| **valor (general)** | Entero entre 0 y 4 | 400 Bad Request |
| **valor (pregunta 10\)** | Entero entre 1 y 10 | 400 Bad Request |
| **Authorization** | Token JWT válido con rol ALUMNO | 401/403 |

4\. Respuesta del backend  
**Caso exitoso (predicción incluida):**  
JSON  
{  
  "id": "eval\_abc123", // ID de la evaluación guardada  
  "message": "Respuestas guardadas correctamente",  
  "totalPreguntas": 52,  
  "prediccion": {  
    "studentId": "uid\_firebase\_del\_alumno",  
    "semaforo": "amarillo", // "rojo" | "amarillo" | "revisar" | "verde"  
    "riesgo\_pct": 58.3, // Porcentaje de riesgo (0 a 100\)  
    "diagnostico": "SEGUIMIENTO RECOMENDADO",  
    "alerta\_principal": "ha\_pensado\_abandonar", // Variable con mayor impacto  
    "sugerencia": "Agendar sesión de tutoría preventiva.",  
    "focos\_rojos": \[  
      "ha\_pensado\_abandonar",  
      "estres\_afecta\_academico" // Variables de mayor riesgo  
    \]  
  }  
}

*(Estructura JSON obtenida de las referencias documentales)*.  
**Caso con error del servicio ML (respuestas SÍ se guardaron):**  
JSON  
{  
  "id": "eval\_xyz789",  
  "message": "Respuestas guardadas correctamente",  
  "totalPreguntas": 52,  
  "mlError": "No se pudo contactar el servicio ML: fetch failed"  
}

*(Nota: El campo "prediccion" estará ausente. Las respuestas están seguras en Firestore.)*  
**Manejo del error ML en el frontend:** Si la respuesta no contiene el campo "prediccion" pero sí contiene "mlError", significa que las respuestas se guardaron correctamente pero el microservicio ML no estuvo disponible en ese momento. El frontend debe mostrar un mensaje como: *"Tus respuestas fueron guardadas. El resultado de tu evaluación estará disponible en breve."*.  
5\. Cómo visualizar el resultado ML en el frontend  
El objeto "prediccion" dentro de la respuesta contiene todos los datos necesarios para mostrar el diagnóstico al alumno. A continuación se detalla cada campo y cómo debe interpretarse visualmente.

| Campo | Tipo | Cómo mostrarlo |
| :---- | :---- | :---- |
| **semaforo** | string | Color/icono: rojo \= riesgo alto, amarillo \= riesgo medio, revisar \= riesgo bajo, verde \= sin riesgo |
| **riesgo\_pct** | number | Barra de progreso o porcentaje. Ej: "Nivel de riesgo: 58.3%" |
| **diagnostico** | string | Etiqueta de texto. Ej: "ALERTA DE RIESGO" / "SIN RIESGO DETECTADO" |
| **alerta\_principal** | string | Nombre interno de la variable crítica (puede omitirse en UI de alumno) |
| **sugerencia** | string | Mostrar como recomendación al alumno. Ej: tarjeta informativa |
| **focos\_rojos** | string\[\] | Lista de áreas de riesgo. Se pueden mostrar como etiquetas o chips de advertencia |

**Tabla del semáforo, colores y acciones sugeridas:**

| Valor | riesgo\_pct | Color sugerido | Mensaje para el alumno | Acción automática del backend |
| :---- | :---- | :---- | :---- | :---- |
| **rojo** | \>= 70% | \#c62828 (Rojo) | Se ha activado una alerta. Te contactará tu tutor. | Crea alerta urgente en colección alertas |
| **amarillo** | 45-69% | \#f57f17 (Naranja) / \#e65100 (Ámbar) | Se recomienda hablar con tu tutor pronto. | Crea alerta de seguimiento en alertas |
| **revisar** | 25-44% | \[Sin color especificado\] | Hay algunas áreas a mejorar. Revisa los recursos disponibles. | Actualiza perfil únicamente |
| **verde** | \< 25% | \#2e7d32 (Verde) | ¡Todo bien\! Sigue así. | Actualiza perfil únicamente |

**Ejemplo de implementación en JavaScript/TypeScript:**  
JavaScript  
async function enviarCuestionario(respuestas, token) {  
  const res \= await fetch("/questionnaire/submit", {  
    method: "POST",  
    headers: {  
      "Content-Type": "application/json",  
      "Authorization": \`Bearer ${token}\`  
    },  
    body: JSON.stringify({ respuestas })  
  });  
    
  const data \= await res.json();  
    
  if (data.prediccion) {  
    const { semaforo, riesgo\_pct, diagnostico, sugerencia, focos\_rojos } \= data.prediccion;  
      
    mostrarSemaforo(semaforo); // "rojo" | "amarillo" | "revisar" | "verde"  
    mostrarPorcentaje(riesgo\_pct); // 0 a 100  
    mostrarDiagnostico(diagnostico);  
    mostrarSugerencia(sugerencia);  
    mostrarFocosRojos(focos\_rojos); // array de strings  
  } else if (data.mlError) {  
    mostrarMensaje("Respuestas guardadas. Resultado disponible pronto.");  
  }  
}

*(Código consolidado de las referencias del documento original)*.  
6\. Endpoints para consultar resultados y datos adicionales  
Además del endpoint principal de envío, existen endpoints para que el frontend consulte los resultados posteriormente.  
6.1 GET /questionnaire/mis-evaluaciones

* **Rol requerido:** ALUMNO  
* **Descripción:** Devuelve el historial completo de evaluaciones del alumno autenticado, incluyendo los resultados ML de cada evaluación. Útil para mostrar el historial de predicciones y la evolución del riesgo a lo largo del tiempo.

**Ejemplo de respuesta:**  
JSON  
\[ { "id": "eval123", "fecha": "...", "estado": "procesado", "resultado": { "semaforo": "verde", "riesgo\_pct": 18.2 } } \] 

*(Ejemplo extraído de las referencias)*.  
6.2 GET /questionnaire/alumno/:uid

* **Rol requerido:** ADMIN, DOCENTE  
* **Descripción:** Igual al anterior pero permite a administradores o docentes consultar el historial de un alumno específico pasando su UID de Firebase como parámetro.

**Ejemplo de respuesta:**  
JSON  
// Mismo formato que mis-evaluaciones 

*(Ejemplo extraído de las referencias)*.  
6.3 GET /surveys/:id/resources

* **Rol requerido:** ALUMNO  
* **Descripción:** Devuelve los recursos institucionales disponibles (psicología, becas, tutorías). Se recomienda llamar a este endpoint después de mostrar el resultado del cuestionario, pasando el ID de la evaluación recién creada.

**Ejemplo de respuesta:**  
JSON  
\[ { "id": "psicologia", "title": "Servicio de Psicología", "description": "...", "phone": "Ext. 23101" } \] 

*(Ejemplo extraído de las referencias)*.  
7\. Referencia: Las 23 preguntas que usa el modelo ML  
El frontend no necesita conocer esta tabla para implementar el envío; simplemente envía todas las respuestas. Esta sección es solo de referencia para el equipo. La columna "Pregunta en el PDF" indica el número de pregunta exacto que aparece en el cuestionario impreso.

| preguntaId | Columna en el modelo ML | Bloque | Escala |
| :---- | :---- | :---- | :---- |
| **4** | transporte\_publico | naranja | 0-4 |
| **6** | trabajo\_interfiere | verde | 0-4 |
| **7** | apoyo\_familiar\_economico | verde | 0-4 |
| **9** | dificultades\_economicas\_familia | verde | 0-4 |
| **10** | num\_integrantes\_familia | naranja | 1-10 (número real) |
| **12** | ingreso\_mensual | verde | 0-4 |
| **13** | carrera | naranja | 0-4 |
| **16** | cumple\_tareas | verde | 0-4 |
| **17** | comprende\_contenidos | verde | 0-4 |
| **21** | dependiente | verde | 0-4 |
| **22** | razon | verde | 0-4 |
| **26** | armonia\_casa | verde | 0-4 |
| **28** | tiene\_con\_quien\_hablar | verde | 0-4 |
| **29** | ha\_pensado\_abandonar | verde | 0-4 |
| **32** | estres\_afecta\_academico | verde | 0-4 |
| **36** | horas\_redes\_sociales | naranja | 0-4 |
| **38** | frecuencia\_videojuegos | naranja | 0-4 |
| **40** | presion\_externa\_abandono | verde | 0-4 |
| **43** | tiene\_beca | verde | 0-4 |
| **46** | se\_siente\_abrumado | verde | 0-4 |
| **48** | apoyo\_profesores | verde | 0-4 |
| **49** | sabe\_a\_quien\_acudir | verde | 0-4 |
| **50** | conoce\_servicios\_institucionales | naranja | 0-4 |

8\. Nota sobre el estado actual del modelo ML  
**Estado actual** El modelo de Machine Learning actualmente desplegado es un RandomForestClassifier entrenado de forma estática. Esto significa que el modelo fue entrenado una sola vez con un conjunto de datos histórico y sus parámetros están fijos en archivos PKL (archivos de serialización de scikit-learn). Cada vez que el microservicio en Cloud Run recibe una solicitud de predicción, carga estos archivos y aplica el modelo, pero no aprende ni actualiza sus pesos con las nuevas respuestas que llegan del sistema.  
En términos simples: el modelo da predicciones basadas en lo que aprendió durante su entrenamiento inicial, pero no mejora con el tiempo ni con los nuevos datos que los alumnos van generando al responder el cuestionario.  
**¿Qué implica esto para el sistema?** Por ahora el sistema funciona correctamente para generar predicciones. Sin embargo, a medida que se acumulen más evaluaciones reales en Firestore, la calidad y precisión del modelo podría mejorarse mediante un proceso de re-entrenamiento periódico.  
**¿Qué se podría hacer para que el modelo aprenda?** Sin entrar en detalles técnicos profundos, las dos estrategias más comunes para que un modelo de este tipo mejore con el tiempo son:

* **Re-entrenamiento periódico (recomendado para este caso):** El científico de datos descarga los datos acumulados en Firestore, re-entrena el modelo con todos los datos disponibles (históricos \+ nuevos) y genera nuevos archivos PKL. Estos archivos actualizados se suben al microservicio en Cloud Run para reemplazar los anteriores. Este proceso puede hacerse cada cierto período (por ejemplo, al final de cada semestre) y no requiere cambios en el backend ni en el frontend.  
* **Aprendizaje incremental (más complejo):** Existen variantes de modelos que pueden actualizarse con nuevos datos sin re-entrenarse desde cero. Requeriría cambios en la arquitectura del microservicio ML y en el proceso de guardado de datos, ya que el modelo necesitaría recibir no solo las respuestas sino también el resultado real de cada alumno (si efectivamente abandonó o no) para aprender de él. Esta información actualmente no se recolecta de forma sistemática en el sistema.

**Para el equipo de frontend:** El estado estático del modelo no afecta la implementación. El endpoint de envío del cuestionario funciona igual independientemente de si el modelo se actualiza o no. Cualquier mejora futura al modelo será transparente para el frontend \- simplemente se reemplazarán los archivos PKL en el servidor.  
**Nota Adicional:** Para dudas técnicas sobre el backend o el modelo ML, consultar la documentación interactiva en /api (Swagger UI) del backend desplegado en Vercel.  
