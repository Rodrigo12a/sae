/**
 * @module QuestionnaireService
 * @epic EPICA-1 Módulo Estudiantil
 * @hu HU007, HU008
 * @ux UXEN-01 to UXEN-08
 * @api GET /questionnaire/mis-evaluaciones · GET /questionnaire/alumno/{uid} · GET /questionnaire/todas · POST /questionnaire/submit
 * @privacy rol:alumno, rol:tutor, rol:admin
 */

import { api } from "@/src/lib/api";
import { 
  RespuestaItemDto, 
  SubmitResponseDto, 
  EvaluationItem 
} from "@/src/types/questionnaire";

export const questionnaireService = {
  /**
   * Envía las respuestas estructuradas del cuestionario al backend.
   * @api POST /questionnaire/submit
   */
  submit: async (respuestas: RespuestaItemDto[]): Promise<SubmitResponseDto> => {
    const response = await api.post<SubmitResponseDto>('/questionnaire/submit', { 
      respuestas 
    });
    return response.data;
  },

  /**
   * Devuelve el historial de evaluaciones del alumno autenticado.
   * Solo para rol ALUMNO.
   * @api GET /questionnaire/mis-evaluaciones
   */
  getMisEvaluaciones: async (): Promise<EvaluationItem[]> => {
    const response = await api.get<EvaluationItem[]>('/questionnaire/mis-evaluaciones');
    return response.data;
  },

  /**
   * Devuelve todas las evaluaciones de un alumno específico por su UID.
   * Para roles ADMIN y DOCENTE.
   * @api GET /questionnaire/alumno/{uid}
   */
  getEvaluacionesAlumno: async (uid: string): Promise<EvaluationItem[]> => {
    const response = await api.get<EvaluationItem[]>(`/questionnaire/alumno/${uid}`);
    return response.data;
  },

  /**
   * Devuelve todas las evaluaciones registradas en el sistema.
   * Solo para rol ADMIN.
   * @api GET /questionnaire/todas
   */
  getTodasEvaluaciones: async (): Promise<EvaluationItem[]> => {
    const response = await api.get<EvaluationItem[]>('/questionnaire/todas');
    return response.data;
  },
};
