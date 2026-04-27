/**
 * @module StudentsService
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU004
 * @ux UXDT-06, UXDT-07, UXDT-08, UXDT-09, UXDT-10
 * @qa QA-01 (privacidad), QA-03
 * @api GET /students/:id/risk-profile · GET /students/:id/academic-history
 * @privacy ⚠️ La respuesta para rol 'tutor' NUNCA incluye diagnosticoClinico.
 *          El backend filtra por JWT. Este servicio usa DimensionSaludTutor como tipo.
 */

import type { StudentRiskProfile, AcademicHistory } from '@/src/types/student';

// ─────────────────────────────────────────────────────────────────────────────
// Mock data — remover cuando el backend esté disponible
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_RISK_PROFILES: Record<string, StudentRiskProfile> = {
  'stu-001': {
    id: 'stu-001',
    name: 'Ana García López',
    matricula: '20230001',
    carrera: 'Ingeniería en Sistemas',
    semestre: 4,
    tutor: 'Lic. Roberto Sánchez',
    academico: {
      semaforoEstado: 'rojo',
      etiquetaOperativa: 'Requiere apoyo académico urgente',
    },
    socioeconomico: {
      semaforoEstado: 'amarillo',
      etiquetaOperativa: 'Seguimiento socioeconómico activo',
    },
    salud: {
      // ⚠️ DimensionSaludTutor — sin diagnosticoClinico por diseño del tipo
      semaforoEstado: 'amarillo',
      recomendacionOperativa: 'Seguimiento de salud preventivo recomendado',
    },
    alertHistory: [
      {
        id: 'hist-001',
        status: 'nueva',
        etiquetaOperativa: 'Inasistencias consecutivas detectadas',
        registeredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        registeredBy: 'Sistema SAE',
      },
      {
        id: 'hist-002',
        status: 'en-seguimiento',
        etiquetaOperativa: 'Seguimiento iniciado por tutor',
        registeredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        registeredBy: 'Lic. Roberto Sánchez',
        notes: 'Se acordó plan de recuperación con el estudiante.',
      },
    ],
    encuestaCompletada: true,
  },
  'stu-002': {
    id: 'stu-002',
    name: 'Carlos Mendoza Ruiz',
    matricula: '20230045',
    carrera: 'Administración de Empresas',
    semestre: 3,
    tutor: 'Lic. Roberto Sánchez',
    academico: {
      semaforoEstado: 'rojo',
      etiquetaOperativa: 'Promedio académico crítico — acción urgente',
    },
    socioeconomico: {
      semaforoEstado: 'rojo',
      etiquetaOperativa: 'Riesgo socioeconómico elevado detectado',
    },
    salud: {
      semaforoEstado: 'verde',
      recomendacionOperativa: 'Sin observaciones de salud registradas',
    },
    alertHistory: [],
    encuestaCompletada: false, // ← activa el banner de encuesta pendiente
  },
  'stu-003': {
    id: 'stu-003',
    name: 'María Torres Vega',
    matricula: '20220087',
    carrera: 'Psicología',
    semestre: 6,
    tutor: 'Lic. Roberto Sánchez',
    academico: {
      semaforoEstado: 'amarillo',
      etiquetaOperativa: 'Seguimiento activo en Psicología Clínica',
    },
    socioeconomico: {
      semaforoEstado: 'verde',
      etiquetaOperativa: 'Situación socioeconómica estable',
    },
    salud: {
      semaforoEstado: 'verde',
      recomendacionOperativa: 'En seguimiento normal',
    },
    alertHistory: [],
    encuestaCompletada: true,
  },
  'stu-004': {
    id: 'stu-004',
    name: 'Diego Ramírez Soto',
    matricula: '20230112',
    carrera: 'Contaduría Pública',
    semestre: 2,
    tutor: 'Lic. Roberto Sánchez',
    academico: {
      semaforoEstado: 'revisar',
      etiquetaOperativa: 'Datos académicos pendientes de verificación',
    },
    socioeconomico: {
      semaforoEstado: 'sin-datos',
      etiquetaOperativa: 'Encuesta socioeconómica no completada',
    },
    salud: {
      semaforoEstado: 'sin-datos',
      recomendacionOperativa: 'Sin datos de salud disponibles',
    },
    alertHistory: [],
    encuestaCompletada: false,
  },
};

const MOCK_ACADEMIC_HISTORY: Record<string, AcademicHistory> = {
  'stu-001': {
    studentId: 'stu-001',
    asistencia: [
      { mes: 'Ago', porcentaje: 95 },
      { mes: 'Sep', porcentaje: 88 },
      { mes: 'Oct', porcentaje: 72 },
      { mes: 'Nov', porcentaje: 60 },
      { mes: 'Dic', porcentaje: 55 },
      { mes: 'Ene', porcentaje: 48 },
    ],
    calificaciones: [
      { materia: 'Matemáticas', promedio: 5.8 },
      { materia: 'Programación', promedio: 7.2 },
      { materia: 'Inglés', promedio: 8.5 },
      { materia: 'Base de Datos', promedio: 6.1 },
      { materia: 'Redes', promedio: 5.5 },
    ],
    promedioGeneral: 6.6,
    asistenciaGeneral: 69.7,
  },
  'stu-002': {
    studentId: 'stu-002',
    asistencia: [
      { mes: 'Ago', porcentaje: 90 },
      { mes: 'Sep', porcentaje: 75 },
      { mes: 'Oct', porcentaje: 65 },
      { mes: 'Nov', porcentaje: 58 },
      { mes: 'Dic', porcentaje: 52 },
      { mes: 'Ene', porcentaje: 45 },
    ],
    calificaciones: [
      { materia: 'Contabilidad', promedio: 5.2 },
      { materia: 'Economía', promedio: 5.8 },
      { materia: 'Administración', promedio: 6.0 },
      { materia: 'Estadística', promedio: 4.9 },
    ],
    promedioGeneral: 5.5,
    asistenciaGeneral: 64.2,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HU004 — Perfil de riesgo del estudiante
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Obtiene el perfil de riesgo holístico de un estudiante para el Tutor.
 * @privacy El backend filtra por JWT — respuesta para tutor NUNCA incluye diagnosticoClinico.
 */
export async function getStudentRiskProfile(studentId: string): Promise<StudentRiskProfile> {
  // TODO: conectar a GET /students/:id/risk-profile cuando esté disponible en Swagger
  // return api.get<StudentRiskProfile>(`/students/${studentId}/risk-profile`).then(res => res.data);

  await new Promise(resolve => setTimeout(resolve, 700));
  const profile = MOCK_RISK_PROFILES[studentId];
  if (!profile) throw new Error(`Estudiante ${studentId} no encontrado`);
  return profile;
}

/**
 * Obtiene el historial académico del estudiante (calificaciones y asistencia).
 * Datos para renderizar gráficas con Recharts.
 */
export async function getStudentAcademicHistory(studentId: string): Promise<AcademicHistory> {
  // TODO: conectar a GET /students/:id/academic-history cuando esté disponible en Swagger
  // return api.get<AcademicHistory>(`/students/${studentId}/academic-history`).then(res => res.data);

  await new Promise(resolve => setTimeout(resolve, 500));
  const history = MOCK_ACADEMIC_HISTORY[studentId];
  if (!history) {
    // Retornar datos vacíos para estudiantes sin historial
    return {
      studentId,
      asistencia: [],
      calificaciones: [],
      promedioGeneral: 0,
      asistenciaGeneral: 0,
    };
  }
  return history;
}
