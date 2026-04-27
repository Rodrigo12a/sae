/**
 * @service SurveyService
 * @epic Épica 3 — Encuesta de Contexto (Estudiante)
 * @hu HU007, HU008
 */

import { api } from "@/src/lib/api";
import { 
  SurveySubmitRequest, 
  SurveySubmitResponse, 
  TokenValidationResponse,
  InstitutionalResource 
} from "@/src/features/encuesta/types";

export const surveyService = {
  /**
   * Valida un token de encuesta y obtiene su estructura
   * HU007 - Criterio 1 y 3
   */
  validateToken: async (token: string): Promise<TokenValidationResponse> => {
    try {
      const response = await api.get<TokenValidationResponse>(`/surveys/token/${token}`);
      return response.data;
    } catch (error) {
      // Mock para desarrollo si el endpoint no existe
      console.warn("Survey API: validateToken fallback to mock");
      
      // Simular validación exitosa para tokens que no empiecen con 'exp-'
      if (token.startsWith('exp-')) {
        return { valid: false, expired: true };
      }

      return {
        valid: true,
        expired: false,
        survey: {
          id: "survey-123",
          title: "Encuesta de Contexto Inicial",
          description: "Esta encuesta nos ayudará a entender mejor tu situación actual para brindarte el apoyo necesario.",
          questions: [
            {
              id: "q1",
              text: "¿Cómo calificarías tu nivel de motivación actual con la carrera?",
              type: "radio",
              required: true,
              options: [
                { value: "alta", label: "Muy Alta" },
                { value: "media", label: "Media" },
                { value: "baja", label: "Baja" },
                { value: "nula", label: "Ninguna" }
              ]
            },
            {
              id: "q2",
              text: "¿Has tenido dificultades económicas que afecten tu estudio este semestre?",
              type: "radio",
              required: true,
              options: [
                { value: "si", label: "Sí, frecuentemente" },
                { value: "algunas", label: "A veces" },
                { value: "no", label: "No, ninguna" }
              ]
            },
            {
              id: "q3",
              text: "¿Cuentas con un espacio adecuado y conexión a internet para estudiar en casa?",
              type: "radio",
              required: true,
              options: [
                { value: "ambos", label: "Sí, cuento con ambos" },
                { value: "espacio", label: "Solo espacio" },
                { value: "internet", label: "Solo internet" },
                { value: "ninguno", label: "No cuento con ninguno" }
              ]
            },
            {
              id: "q4",
              text: "¿Hay algo más que te gustaría comentarnos sobre tu situación actual?",
              type: "textarea",
              required: false,
              placeholder: "Escribe aquí tus comentarios..."
            }
          ]
        }
      };
    }
  },

  /**
   * Envía las respuestas de la encuesta
   * HU007 - Criterio 2
   */
  submitSurvey: async (data: SurveySubmitRequest): Promise<SurveySubmitResponse> => {
    try {
      const response = await api.post<SurveySubmitResponse>(`/surveys/${data.surveyId}/submit`, data);
      return response.data;
    } catch (error) {
      console.warn("Survey API: submitSurvey fallback to mock");
      return {
        success: true,
        message: "Tus respuestas fueron recibidas"
      };
    }
  },
  
  /**
   * Obtiene recursos institucionales recomendados para el estudiante.
   * @hu HU008
   */
  getResources: async (surveyId: string): Promise<InstitutionalResource[]> => {
    // TODO: conectar a GET /api/surveys/:id/resources cuando esté disponible
    await new Promise(resolve => setTimeout(resolve, 800)); // Simular latencia

    return [
      {
        id: '1',
        title: 'Apoyo Académico',
        description: 'Tutorías personalizadas para mejorar tu desempeño.',
        icon: '📚',
        location: 'Edificio A, Planta Baja',
      },
      {
        id: '2',
        title: 'Bienestar Estudiantil',
        description: 'Atención psicológica y orientación emocional.',
        icon: '🌱',
        phone: '555-0192',
      },
      {
        id: '3',
        title: 'Becas y Apoyos',
        description: 'Información sobre programas de financiamiento.',
        icon: '🎓',
        link: 'https://campus.institucion.edu/becas',
      }
    ];
  }
};
