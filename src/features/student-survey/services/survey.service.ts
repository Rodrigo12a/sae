/**
 * @module SurveyService
 * @description Servicio para el envío de respuestas del cuestionario de descerción.
 */

import { api } from "@/src/lib/api";

export const surveyService = {
  /**
   * Envía las 50 respuestas del cuestionario al backend.
   * El alumnoId se extrae automáticamente del JWT en el servidor.
   * @param respuestas Array de 50 valores numéricos
   */
  submit: async (respuestas: number[]) => {
    if (respuestas.length < 50) {
      throw new Error(`Se requieren al menos 50 respuestas. Recibidas: ${respuestas.length}`);
    }

    try {
      const response = await api.post('/questionnaire/submit', { 
        respuestas 
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Error al enviar el cuestionario.";
      throw new Error(Array.isArray(message) ? message.join(', ') : message);
    }
  }
};
