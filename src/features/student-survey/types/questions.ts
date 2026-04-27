/**
 * @module SurveyQuestions
 * @description Definición de las 50 preguntas del cuestionario de descerción según cuestionario_desercion.md
 */

export type QuestionType = 'likert' | 'binary' | 'numeric' | 'categorical' | 'multiple-conteo';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: { label: string; value: number }[];
  placeholder?: string;
  category: 'General' | 'Socioeconómica' | 'Académica' | 'Psicoemocional' | 'Psicosocial' | 'Institucional';
}

export const SURVEY_QUESTIONS: Question[] = [
  // Área General (Índices 0-1)
  { id: 3, text: "¿Cuál es tu edad?", type: 'numeric', category: 'General', placeholder: 'Ej. 19' },
  { id: 4, text: "¿Cuál es tu género?", type: 'categorical', category: 'General', options: [
    { label: 'Femenino', value: 1 },
    { label: 'Masculino', value: 2 }
  ]},
  
  // Área Socioeconómica (Índices 2-14)
  { id: 5, text: "¿Ambos padres tienen el mismo nivel académico?", type: 'binary', category: 'Socioeconómica', options: [
    { label: 'No', value: 0 },
    { label: 'Sí', value: 1 }
  ]},
  { id: 6, text: "Último grado de estudios del padre", type: 'categorical', category: 'Socioeconómica', options: [
    { label: 'Primaria', value: 1 },
    { label: 'Secundaria', value: 2 },
    { label: 'Preparatoria', value: 3 },
    { label: 'Licenciatura', value: 4 },
    { label: 'Posgrado', value: 5 }
  ]},
  { id: 7, text: "Último grado de estudios de la madre", type: 'categorical', category: 'Socioeconómica', options: [
    { label: 'Primaria', value: 1 },
    { label: 'Secundaria', value: 2 },
    { label: 'Preparatoria', value: 3 },
    { label: 'Licenciatura', value: 4 },
    { label: 'Posgrado', value: 5 }
  ]},
  { id: 8, text: "Medio de transporte para asistir a la universidad", type: 'categorical', category: 'Socioeconómica', options: [
    { label: 'Transporte público', value: 1 },
    { label: 'Auto propio', value: 2 },
    { label: 'Moto', value: 3 },
    { label: 'Bicicleta', value: 4 },
    { label: 'A pie', value: 5 }
  ]},
  { id: 9, text: "¿Actualmente trabajas?", type: 'binary', category: 'Socioeconómica', options: [
    { label: 'No', value: 0 },
    { label: 'Sí', value: 1 }
  ]},
  { id: 10, text: "¿Tu trabajo interfiere con horarios o tareas escolares?", type: 'binary', category: 'Socioeconómica', options: [
    { label: 'No', value: 0 },
    { label: 'Sí', value: 1 }
  ]},
  { id: 11, text: "¿Tu familia te apoya para sufragar tus estudios?", type: 'likert', category: 'Socioeconómica' },
  { id: 12, text: "¿Cuentas con recursos para libros o proyectos escolares?", type: 'likert', category: 'Socioeconómica' },
  { id: 13, text: "¿Tu familia atraviesa dificultades económicas?", type: 'likert', category: 'Socioeconómica' },
  { id: 14, text: "Número de integrantes en tu familia", type: 'categorical', category: 'Socioeconómica', options: [
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7 o más', value: 7 }
  ]},
  { id: 15, text: "Número de miembros que aportan al ingreso familiar", type: 'categorical', category: 'Socioeconómica', options: [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: 'Más de 5', value: 6 }
  ]},
  { id: 16, text: "Monto de ingreso familiar mensual aproximado", type: 'categorical', category: 'Socioeconómica', options: [
    { label: '$4,000', value: 1 },
    { label: '$5,000', value: 2 },
    { label: '$6,000', value: 3 },
    { label: '$7,000', value: 4 },
    { label: 'Más de $7,000', value: 5 }
  ]},
  { id: 17, text: "¿Alguien depende económicamente de ti?", type: 'categorical', category: 'Socioeconómica', options: [
    { label: 'Ninguno', value: 0 },
    { label: 'Hijos', value: 1 },
    { label: 'Pareja', value: 2 },
    { label: 'Padre', value: 3 },
    { label: 'Madre', value: 4 },
    { label: 'Hermanos', value: 5 }
  ]},

  // Área Académica (Índices 15-24)
  { id: 18, text: "¿Qué carrera cursas actualmente?", type: 'categorical', category: 'Académica', options: [
    { label: 'Ing. en Tecnologías de la Información e Innovación Digital', value: 1 },
    { label: 'Mecatrónica', value: 2 },
    { label: 'Financiera', value: 3 },
    { label: 'Industrial', value: 4 },
    { label: 'Química', value: 5 },
    { label: 'Biotecnología', value: 6 },
    { label: 'Sistemas Automotrices', value: 7 }
  ]},
  { id: 19, text: "¿En qué cuatrimestre te encuentras?", type: 'categorical', category: 'Académica', options: [
    { label: '1°', value: 1 },
    { label: '2°', value: 2 },
    { label: '3°', value: 3 },
    { label: '4°', value: 4 },
    { label: '5°', value: 5 },
    { label: '6°', value: 6 },
    { label: '7°', value: 7 },
    { label: '8°', value: 8 },
    { label: '9°', value: 9 },
    { label: '10°', value: 10 }
  ]},
  { id: 20, text: "¿Por qué elegiste tu carrera?", type: 'categorical', category: 'Académica', options: [
    { label: 'Porque me gusta', value: 1 },
    { label: 'Por herencia laboral/familiar', value: 2 },
    { label: 'Porque me obligaron', value: 3 }
  ]},
  { id: 21, text: "¿Cuántas horas estudias fuera de clase a la semana?", type: 'categorical', category: 'Académica', options: [
    { label: '0', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: 'Más de 3', value: 4 }
  ]},
  { id: 22, text: "¿Organizas tu tiempo para tareas y proyectos?", type: 'likert', category: 'Académica' },
  { id: 23, text: "¿Cuál es el recurso principal con el que cuentas para estudiar en casa?", type: 'categorical', category: 'Académica', options: [
    { label: 'Computadora', value: 1 },
    { label: 'Internet', value: 2 },
    { label: 'Celular', value: 3 },
    { label: 'Material escrito', value: 4 },
    { label: 'Ninguno', value: 5 }
  ]},
  { id: 24, text: "¿Te resulta fácil concentrarte durante las clases?", type: 'likert', category: 'Académica' },
  { id: 25, text: "¿Cumples con tareas académicas en los tiempos establecidos?", type: 'likert', category: 'Académica' },
  { id: 26, text: "¿Comprendes los contenidos de tus materias sin dificultad?", type: 'likert', category: 'Académica' },
  { id: 27, text: "¿Buscas apoyo académico cuando tienes dudas?", type: 'likert', category: 'Académica' },

  // Área Psicoemocional (Índices 25-35)
  { id: 28, text: "Estado civil actual", type: 'categorical', category: 'Psicoemocional', options: [
    { label: 'Soltero/a', value: 1 },
    { label: 'Casado/a', value: 2 },
    { label: 'Unión Libre', value: 3 },
    { label: 'Divorciado/a', value: 4 }
  ]},
  { id: 29, text: "¿Tienes hijos?", type: 'binary', category: 'Psicoemocional', options: [
    { label: 'No', value: 0 },
    { label: 'Sí', value: 1 }
  ]},
  { id: 30, text: "¿Hay armonía en tu casa para concentrarte en tus estudios?", type: 'likert', category: 'Psicoemocional' },
  { id: 31, text: "¿Con quién vives actualmente?", type: 'categorical', category: 'Psicoemocional', options: [
    { label: 'Ambos padres', value: 1 },
    { label: 'Mamá', value: 2 },
    { label: 'Papá', value: 3 },
    { label: 'Hermanos', value: 4 },
    { label: 'Abuelos', value: 5 },
    { label: 'Pareja', value: 6 },
    { label: 'Solo/a', value: 7 }
  ]},
  { id: 32, text: "¿Tienes a alguien con quien hablar cuando estás estresado/a?", type: 'likert', category: 'Psicoemocional' },
  { id: 33, text: "¿Has pensado en abandonar la carrera o cambiar de programa?", type: 'likert', category: 'Psicoemocional' },
  { id: 34, text: "Si pensaras en abandonar, ¿cuál sería la razón principal?", type: 'categorical', category: 'Psicoemocional', options: [
    { label: 'Situación económica', value: 1 },
    { label: 'Situación emocional', value: 2 },
    { label: 'Salud', value: 3 },
    { label: 'Poca motivación', value: 4 },
    { label: 'No me gusta la carrera', value: 5 }
  ]},
  { id: 35, text: "¿Has ocupado el servicio de psicología de la universidad?", type: 'likert', category: 'Psicoemocional' },
  { id: 36, text: "¿El estrés o la ansiedad afectan tu desempeño académico?", type: 'likert', category: 'Psicoemocional' },
  { id: 37, text: "¿Qué tipo de apoyo consideras más útil para continuar tus estudios?", type: 'categorical', category: 'Psicoemocional', options: [
    { label: 'Económico', value: 1 },
    { label: 'Emocional', value: 2 },
    { label: 'Académico', value: 3 }
  ]},
  { id: 38, text: "¿Los problemas personales influyen negativamente en tu desempeño escolar?", type: 'likert', category: 'Psicoemocional' },

  // Área Psicosocial (Índices 36-44)
  { id: 39, text: "¿Sientes el apoyo de tu familia para continuar tus estudios?", type: 'likert', category: 'Psicosocial' },
  { id: 40, text: "Aproximadamente, ¿cuánto tiempo pasas en redes sociales al día?", type: 'categorical', category: 'Psicosocial', options: [
    { label: '1 hora', value: 1 },
    { label: '2 horas', value: 2 },
    { label: '3 horas', value: 3 },
    { label: '4 horas', value: 4 },
    { label: '5 horas', value: 5 },
    { label: 'Más de 5 horas', value: 6 }
  ]},
  { id: 41, text: "¿Con qué frecuencia consumes bebidas alcohólicas?", type: 'likert', category: 'Psicosocial' },
  { id: 42, text: "¿Con qué frecuencia juegas videojuegos al día?", type: 'categorical', category: 'Psicosocial', options: [
    { label: 'No juego', value: 0 },
    { label: 'Menos de 1 hora', value: 1 },
    { label: '1 a 2 horas', value: 2 },
    { label: '3 a 4 horas', value: 3 },
    { label: 'Más de 4 horas', value: 4 }
  ]},
  { id: 43, text: "¿Con qué frecuencia usas tu teléfono durante horas de estudio?", type: 'likert', category: 'Psicosocial' },
  { id: 44, text: "¿Sientes presión externa que te hace considerar dejar la universidad?", type: 'likert', category: 'Psicosocial' },
  { id: 45, text: "¿Te has sentido excluido/a en actividades académicas o sociales?", type: 'likert', category: 'Psicosocial' },
  { id: 46, text: "¿Has tenido conflictos con compañeros o docentes?", type: 'likert', category: 'Psicosocial' },
  { id: 47, text: "¿Tienes o padeces alguna enfermedad o trastorno neurológico?", type: 'binary', category: 'Psicosocial', options: [
    { label: 'No', value: 0 },
    { label: 'Sí', value: 1 }
  ]},

  // Área Institucional (Índices 45-49)
  { id: 48, text: "¿Cuentas con alguna beca de apoyo?", type: 'binary', category: 'Institucional', options: [
    { label: 'No', value: 0 },
    { label: 'Sí', value: 1 }
  ]},
  { id: 49, text: "¿Formas parte de algún selectivo en la universidad?", type: 'binary', category: 'Institucional', options: [
    { label: 'No', value: 0 },
    { label: 'Sí', value: 1 }
  ]},
  { id: 50, text: "Si perteneces a un selectivo, ¿cuánto tiempo al día inviertes?", type: 'categorical', category: 'Institucional', options: [
    { label: 'No pertenezco', value: 0 },
    { label: '1 hora', value: 1 },
    { label: '2 horas', value: 2 },
    { label: '3 horas', value: 3 },
    { label: 'Más de 3 horas', value: 4 }
  ]},
  { id: 51, text: "¿Te sientes apoyado/a por tus profesores cuando tienes dificultades?", type: 'likert', category: 'Institucional' },
  { id: 52, text: "¿Sabes a quién acudir dentro de la institución ante un problema?", type: 'likert', category: 'Institucional' },
  { id: 53, text: "¿Conoces los servicios de apoyo que ofrece la institución (tutorías, asesorías, orientación, etc.)?", type: 'likert', category: 'Institucional' },
  { id: 54, text: "¿Recibes información clara y oportuna sobre actividades, apoyos y servicios institucionales?", type: 'likert', category: 'Institucional' },
  { id: 55, text: "¿Te sientes escuchado(a) por docentes o autoridades cuando expresas alguna necesidad o problema?", type: 'likert', category: 'Institucional' },
];

export const LIKERT_OPTIONS = [
  { label: 'Nunca', value: 1 },
  { label: 'Rara vez', value: 2 },
  { label: 'Algunas veces', value: 3 },
  { label: 'Frecuentemente', value: 4 },
  { label: 'Siempre', value: 5 },
];
