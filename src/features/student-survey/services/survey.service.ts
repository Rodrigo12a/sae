/**
 * @module SurveyService
 * @description Servicio para interactuar con los endpoints del cuestionario SAE V2.0.
 * @epic EPICA-1 Módulo Estudiantil
 */

import { api } from "@/src/lib/api";
import { 
  RespuestaItemDto, 
  SubmitResponseDto, 
  EvaluationItem, 
  SurveyResource 
} from "@/src/types/questionnaire";

export const surveyService = {
  /**
   * Envía las respuestas estructuradas del cuestionario al backend.
   * @param respuestas Array de objetos { preguntaId, valor }
   */
  submit: async (respuestas: RespuestaItemDto[]): Promise<SubmitResponseDto> => {
    if (respuestas.length < 50) {
      throw new Error(`Se requieren al menos 50 respuestas. Recibidas: ${respuestas.length}`);
    }

    try {
      const response = await api.post<SubmitResponseDto>('/questionnaire/submit', { 
        respuestas 
      });
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const message = err.response?.data?.message || err.message || "Error al enviar el cuestionario.";
      throw new Error(Array.isArray(message) ? message.join(', ') : message);
    }
  },

  /**
   * Devuelve el historial de evaluaciones del alumno autenticado.
   * Solo para rol ALUMNO.
   */
  getMisEvaluaciones: async (): Promise<EvaluationItem[]> => {
    try {
      const response = await api.get<EvaluationItem[]>('/questionnaire/mis-evaluaciones');
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const message = err.response?.data?.message || err.message || "Error al cargar tu historial de evaluaciones.";
      throw new Error(message);
    }
  },

  /**
   * Devuelve todas las evaluaciones de un alumno específico por su UID.
   * Para roles ADMIN y DOCENTE.
   */
  getEvaluacionesAlumno: async (uid: string): Promise<EvaluationItem[]> => {
    try {
      const response = await api.get<EvaluationItem[]>(`/questionnaire/alumno/${uid}`);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const message = err.response?.data?.message || err.message || "Error al obtener las evaluaciones del alumno.";
      throw new Error(message);
    }
  },

  /**
   * Devuelve todas las evaluaciones registradas en el sistema.
   * Solo para rol ADMIN.
   */
  getTodasEvaluaciones: async (): Promise<EvaluationItem[]> => {
    try {
      const response = await api.get<EvaluationItem[]>('/questionnaire/todas');
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const message = err.response?.data?.message || err.message || "Error al obtener el historial global de evaluaciones.";
      throw new Error(message);
    }
  },

  /**
   * Obtiene los recursos institucionales dinámicos post-cuestionario.
   * @param id ID de la evaluación/encuesta
   */
  getSurveyResources: async (id: string): Promise<SurveyResource[]> => {
    try {
      const response = await api.get<SurveyResource[]>(`/surveys/${id}/resources`);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      const message = err.response?.data?.message || err.message || "Error al obtener los recursos institucionales.";
      throw new Error(message);
    }
  }
};
