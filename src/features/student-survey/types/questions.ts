/**
 * @module SurveyQuestions
 * @description Definición de las 52 preguntas del cuestionario SAE V2.0 según preguntas.md, mapeadas del 1 al 52.
 */

export type QuestionType = 'likert' | 'binary' | 'numeric' | 'categorical';

export interface Question {
  id: number;
  backendPreguntaId: number; // ID oficial (1 al 52)
  text: string;
  type: QuestionType;
  options?: { label: string; value: number }[];
  placeholder?: string;
  category: 'Socioeconómica' | 'Académica' | 'Psicoemocional' | 'Psicosocial' | 'Institucional';
}

export const SURVEY_QUESTIONS: Question[] = [
  // Área Socioeconómica (1 a 13)
  { 
    id: 1, 
    backendPreguntaId: 1, 
    text: "¿Ambos padres tienen el mismo nivel académico?", 
    type: 'binary', 
    category: 'Socioeconómica', 
    options: [
      { label: 'No', value: 0 },
      { label: 'Sí', value: 1 }
    ]
  },
  { 
    id: 2, 
    backendPreguntaId: 2, 
    text: "Último grado de estudios de papá.", 
    type: 'categorical', 
    category: 'Socioeconómica', 
    options: [
      { label: 'Primaria', value: 1 },
      { label: 'Secundaria', value: 2 },
      { label: 'Preparatoria', value: 3 },
      { label: 'Licenciatura', value: 4 },
      { label: 'Posgrado', value: 5 }
    ]
  },
  { 
    id: 3, 
    backendPreguntaId: 3, 
    text: "Último grado de estudios de mamá.", 
    type: 'categorical', 
    category: 'Socioeconómica', 
    options: [
      { label: 'Primaria', value: 1 },
      { label: 'Secundaria', value: 2 },
      { label: 'Preparatoria', value: 3 },
      { label: 'Licenciatura', value: 4 },
      { label: 'Posgrado', value: 5 }
    ]
  },
  { 
    id: 4, 
    backendPreguntaId: 4, 
    text: "¿Qué medio de transporte utilizas para asistir a la universidad?", 
    type: 'categorical', 
    category: 'Socioeconómica', 
    options: [
      { label: 'En transporte público', value: 1 },
      { label: 'En mi auto', value: 2 },
      { label: 'En moto', value: 3 },
      { label: 'En bicicleta', value: 4 },
      { label: 'Camino', value: 5 }
    ]
  },
  { 
    id: 5, 
    backendPreguntaId: 5, 
    text: "¿Actualmente trabajas?", 
    type: 'binary', 
    category: 'Socioeconómica', 
    options: [
      { label: 'No', value: 0 },
      { label: 'Sí', value: 1 }
    ]
  },
  { 
    id: 6, 
    backendPreguntaId: 6, 
    text: "¿Tu trabajo interfiere con tus horarios o tareas escolares?", 
    type: 'binary', 
    category: 'Socioeconómica', 
    options: [
      { label: 'No', value: 0 },
      { label: 'Sí', value: 1 }
    ]
  },
  { 
    id: 7, 
    backendPreguntaId: 7, 
    text: "¿Tu familia te apoya para sufragar tus estudios?", 
    type: 'likert', 
    category: 'Socioeconómica' 
  },
  { 
    id: 8, 
    backendPreguntaId: 8, 
    text: "¿Cuentas con recurso para la compra de libros o financiar proyectos escolares?", 
    type: 'likert', 
    category: 'Socioeconómica' 
  },
  { 
    id: 9, 
    backendPreguntaId: 9, 
    text: "¿Tu familia atraviesa actualmente dificultades económicas?", 
    type: 'likert', 
    category: 'Socioeconómica' 
  },
  { 
    id: 10, 
    backendPreguntaId: 10, 
    text: "¿Número de integrantes en tu familia?", 
    type: 'numeric', 
    category: 'Socioeconómica',
    placeholder: 'Introduce número de personas (1-10)'
  },
  { 
    id: 11, 
    backendPreguntaId: 11, 
    text: "Número de miembros que aportan al ingreso familiar:", 
    type: 'categorical', 
    category: 'Socioeconómica', 
    options: [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: 'Más de 5', value: 6 }
    ]
  },
  { 
    id: 12, 
    backendPreguntaId: 12, 
    text: "¿A cuánto asciende el monto de ingreso familiar mensual?", 
    type: 'categorical', 
    category: 'Socioeconómica', 
    options: [
      { label: '4000', value: 1 },
      { label: '5000', value: 2 },
      { label: '6000', value: 3 },
      { label: '7000', value: 4 },
      { label: 'Más de 7000', value: 5 }
    ]
  },
  { 
    id: 13, 
    backendPreguntaId: 13, 
    text: "¿Alguien depende económicamente de ti?", 
    type: 'categorical', 
    category: 'Socioeconómica', 
    options: [
      { label: 'Ninguno', value: 0 },
      { label: 'Hijos', value: 1 },
      { label: 'Esposa', value: 2 },
      { label: 'Padre', value: 3 },
      { label: 'Madre', value: 4 },
      { label: 'Hermanos', value: 5 }
    ]
  },

  // Área Académica / Hábitos de Estudio (14 a 23)
  { 
    id: 14, 
    backendPreguntaId: 14, 
    text: "¿Qué carrera cursas actualmente?", 
    type: 'categorical', 
    category: 'Académica', 
    options: [
      { label: 'Ingeniería en Tecnologías de la Información e Innovación Digital', value: 1 },
      { label: 'Mecatrónica', value: 2 },
      { label: 'Financiera', value: 3 },
      { label: 'Industrial', value: 4 },
      { label: 'Química', value: 5 },
      { label: 'Biotecnología', value: 6 },
      { label: 'Sistemas automotrices', value: 7 }
    ]
  },
  { 
    id: 15, 
    backendPreguntaId: 15, 
    text: "¿Qué cuatrimestre cursas actualmente?", 
    type: 'categorical', 
    category: 'Académica', 
    options: [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 },
      { label: '7', value: 7 },
      { label: '8', value: 8 },
      { label: '9', value: 9 },
      { label: '10', value: 10 }
    ]
  },
  { 
    id: 16, 
    backendPreguntaId: 16, 
    text: "¿Por qué elegiste tu carrera?", 
    type: 'categorical', 
    category: 'Académica', 
    options: [
      { label: 'Porque me gusta', value: 1 },
      { label: 'Porque voy heredar el trabajo de algún familiar o conocido', value: 2 },
      { label: 'Porque me obligaron', value: 3 }
    ]
  },
  { 
    id: 17, 
    backendPreguntaId: 17, 
    text: "¿Cuántas horas dedicas al estudio fuera del horario de clases por semana?", 
    type: 'categorical', 
    category: 'Académica', 
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: 'Más de tres', value: 4 }
    ]
  },
  { 
    id: 18, 
    backendPreguntaId: 18, 
    text: "¿Organizas tu tiempo para cumplir con tareas y proyectos?", 
    type: 'likert', 
    category: 'Académica' 
  },
  { 
    id: 19, 
    backendPreguntaId: 19, 
    text: "¿Con qué medios cuentas para estudiar en casa?", 
    type: 'categorical', 
    category: 'Académica', 
    options: [
      { label: 'Computadora', value: 1 },
      { label: 'Acceso a internet', value: 2 },
      { label: 'Teléfono celular', value: 3 },
      { label: 'Material escrito (impresos, libros)', value: 4 }
    ]
  },
  { 
    id: 20, 
    backendPreguntaId: 20, 
    text: "¿Te resulta fácil concentrarte durante las clases?", 
    type: 'likert', 
    category: 'Académica' 
  },
  { 
    id: 21, 
    backendPreguntaId: 21, 
    text: "¿Cumples con los compromisos y tareas académicas en los tiempos establecidos?", 
    type: 'likert', 
    category: 'Académica' 
  },
  { 
    id: 22, 
    backendPreguntaId: 22, 
    text: "¿Comprendes los contenidos de tus materias sin dificultad?", 
    type: 'likert', 
    category: 'Académica' 
  },
  { 
    id: 23, 
    backendPreguntaId: 23, 
    text: "¿Buscas apoyo académico cuando tienes dudas o dificultades en alguna asignatura?", 
    type: 'likert', 
    category: 'Académica' 
  },

  // Área Psicoemocional (24 a 34)
  { 
    id: 24, 
    backendPreguntaId: 24, 
    text: "¿Cuál es tu estado civil?", 
    type: 'categorical', 
    category: 'Psicoemocional', 
    options: [
      { label: 'Soltero', value: 1 },
      { label: 'Casado', value: 2 },
      { label: 'Unión Libre', value: 3 },
      { label: 'Divorciado', value: 4 }
    ]
  },
  { 
    id: 25, 
    backendPreguntaId: 25, 
    text: "¿Tienes hijos?", 
    type: 'binary', 
    category: 'Psicoemocional', 
    options: [
      { label: 'No', value: 0 },
      { label: 'Sí', value: 1 }
    ]
  },
  { 
    id: 26, 
    backendPreguntaId: 26, 
    text: "¿Hay armonía en tu casa para concentrarte en tus estudios?", 
    type: 'likert', 
    category: 'Psicoemocional' 
  },
  { 
    id: 27, 
    backendPreguntaId: 27, 
    text: "¿Con quién vives actualmente?", 
    type: 'categorical', 
    category: 'Psicoemocional', 
    options: [
      { label: 'Con ambos padres', value: 1 },
      { label: 'Con mamá', value: 2 },
      { label: 'Con papá', value: 3 },
      { label: 'Con hermanos', value: 4 },
      { label: 'Con abuelos', value: 5 },
      { label: 'Con pareja', value: 6 },
      { label: 'Solo(a)', value: 7 }
    ]
  },
  { 
    id: 28, 
    backendPreguntaId: 28, 
    text: "¿Tienes a alguien con quien hablar cuando te sientes preocupado o estresado?", 
    type: 'likert', 
    category: 'Psicoemocional' 
  },
  { 
    id: 29, 
    backendPreguntaId: 29, 
    text: "¿Has pensado en abandonar la carrera o cambiar de programa?", 
    type: 'likert', 
    category: 'Psicoemocional' 
  },
  { 
    id: 30, 
    backendPreguntaId: 30, 
    text: "Si pensaras en abandonar tus estudios, ¿Cuál sería la principal razón?", 
    type: 'categorical', 
    category: 'Psicoemocional', 
    options: [
      { label: 'Situación económica', value: 1 },
      { label: 'Situación emocional', value: 2 },
      { label: 'Salud', value: 3 },
      { label: 'Poca motivación por estudiar', value: 4 },
      { label: 'No me gusta la carrera', value: 5 }
    ]
  },
  { 
    id: 31, 
    backendPreguntaId: 31, 
    text: "¿Has ocupado el servicio de psicología de la universidad?", 
    type: 'likert', 
    category: 'Psicoemocional' 
  },
  { 
    id: 32, 
    backendPreguntaId: 32, 
    text: "¿El estrés o la ansiedad afectan tu desempeño académico?", 
    type: 'likert', 
    category: 'Psicoemocional' 
  },
  { 
    id: 33, 
    backendPreguntaId: 33, 
    text: "¿Qué tipo de apoyo consideras más útil para continuar tus estudios?", 
    type: 'categorical', 
    category: 'Psicoemocional', 
    options: [
      { label: 'Económico', value: 1 },
      { label: 'Emocional', value: 2 },
      { label: 'Académico', value: 3 }
    ]
  },
  { 
    id: 34, 
    backendPreguntaId: 34, 
    text: "¿Sientes que los problemas personales influyen negativamente en tu desempeño escolar?", 
    type: 'likert', 
    category: 'Psicoemocional' 
  },

  // Área Psicosocial (35 a 42)
  { 
    id: 35, 
    backendPreguntaId: 35, 
    text: "¿Sientes que cuentas con el apoyo de tu familia para continuar tus estudios universitarios?", 
    type: 'likert', 
    category: 'Psicosocial' 
  },
  { 
    id: 36, 
    backendPreguntaId: 36, 
    text: "¿Qué tiempo pasas en redes sociales (Facebook, Instagram, TikTok, etc.)?", 
    type: 'categorical', 
    category: 'Psicosocial', 
    options: [
      { label: '1 hora al día', value: 1 },
      { label: '2 horas al día', value: 2 },
      { label: '3 horas al día', value: 3 },
      { label: '4 horas al día', value: 4 },
      { label: '5 horas al día', value: 5 },
      { label: 'Más de 5 horas al día', value: 6 }
    ]
  },
  { 
    id: 37, 
    backendPreguntaId: 37, 
    text: "¿Con qué frecuencia consumes bebidas alcohólicas?", 
    type: 'likert', 
    category: 'Psicosocial' 
  },
  { 
    id: 38, 
    backendPreguntaId: 38, 
    text: "¿Con qué frecuencia juegas videojuegos y cuánto tiempo aproximadamente dedicas a esta actividad al día?", 
    type: 'categorical', 
    category: 'Psicosocial', 
    options: [
      { label: 'No juego videojuegos', value: 0 },
      { label: 'Juego menos de 1 hora al día', value: 1 },
      { label: 'Juego entre 1 y 2 horas al día', value: 2 },
      { label: 'Juego entre 3 y 4 horas al día', value: 3 },
      { label: 'Juego más de 4 horas al día', value: 4 }
    ]
  },
  { 
    id: 39, 
    backendPreguntaId: 39, 
    text: "¿Con qué frecuencia utilizas tu teléfono móvil durante tus horas de estudio?", 
    type: 'likert', 
    category: 'Psicosocial' 
  },
  { 
    id: 40, 
    backendPreguntaId: 40, 
    text: "¿Sientes presión externa (económica, familiar o social) que te hace considerar dejar la universidad?", 
    type: 'likert', 
    category: 'Psicosocial' 
  },
  { 
    id: 41, 
    backendPreguntaId: 41, 
    text: "¿Te has sentido excluido(a) o poco integrado(a) en actividades académicas o sociales?", 
    type: 'likert', 
    category: 'Psicosocial' 
  },
  { 
    id: 42, 
    backendPreguntaId: 42, 
    text: "¿Has tenido conflictos con compañeros o docentes que afecten tu desempeño académico?", 
    type: 'likert', 
    category: 'Psicosocial' 
  },

  // Área de Integración Institucional (43 a 52)
  { 
    id: 43, 
    backendPreguntaId: 43, 
    text: "¿Cuentas con alguna beca de apoyo para estudios?", 
    type: 'binary', 
    category: 'Institucional', 
    options: [
      { label: 'No', value: 0 },
      { label: 'Sí', value: 1 }
    ]
  },
  { 
    id: 44, 
    backendPreguntaId: 44, 
    text: "¿Formas parte de algún selectivo en la universidad?", 
    type: 'binary', 
    category: 'Institucional', 
    options: [
      { label: 'No', value: 0 },
      { label: 'Sí', value: 1 }
    ]
  },
  { 
    id: 45, 
    backendPreguntaId: 45, 
    text: "Si es que perteneces a un selectivo, ¿cuánto tiempo al día inviertes en ello?", 
    type: 'categorical', 
    category: 'Institucional', 
    options: [
      { label: 'No pertenezco', value: 0 },
      { label: 'Una hora', value: 1 },
      { label: '2 horas', value: 2 },
      { label: '3 horas', value: 3 },
      { label: 'Más de 3 horas', value: 4 }
    ]
  },
  { 
    id: 46, 
    backendPreguntaId: 46, 
    text: "¿Te sientes abrumado, triste o con ansiedad con frecuencia?", 
    type: 'likert', 
    category: 'Institucional' 
  },
  { 
    id: 47, 
    backendPreguntaId: 47, 
    text: "¿Cuentas con una red de apoyo (familia/amigos) que te ayudaría ante un problema grave?", 
    type: 'likert', 
    category: 'Institucional' 
  },
  { 
    id: 48, 
    backendPreguntaId: 48, 
    text: "Te sientes apoyado(a) por tus profesores cuando tienes dificultades académicas.", 
    type: 'likert', 
    category: 'Institucional' 
  },
  { 
    id: 49, 
    backendPreguntaId: 49, 
    text: "Sabes a quién acudir dentro de la institución cuando tienes un problema académico o personal.", 
    type: 'likert', 
    category: 'Institucional' 
  },
  { 
    id: 50, 
    backendPreguntaId: 50, 
    text: "¿Conoces los servicios de apoyo que ofrece la institución (tutorías, asesorías, orientación, etc.)?", 
    type: 'likert', 
    category: 'Institucional' 
  },
  { 
    id: 51, 
    backendPreguntaId: 51, 
    text: "¿Recibes información clara y oportuna sobre actividades, apoyos y servicios institucionales?", 
    type: 'likert', 
    category: 'Institucional' 
  },
  { 
    id: 52, 
    backendPreguntaId: 52, 
    text: "¿Te sientes escuchado(a) por docentes o autoridades cuando expresas alguna necesidad o problema?", 
    type: 'likert', 
    category: 'Institucional' 
  }
];

export const LIKERT_OPTIONS = [
  { label: 'Nunca', value: 1 },
  { label: 'Rara vez', value: 2 },
  { label: 'Algunas veces', value: 3 },
  { label: 'Frecuentemente', value: 4 },
  { label: 'Siempre', value: 5 },
];
