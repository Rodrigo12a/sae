/**
 * @module SurveyService
 * @epic EPICA-3 Encuesta de Contexto (Estudiante)
 * @hu HU007, HU008
 * @ux UXEN-01 to UXEN-08
 * @qa QA-07 (Modo offline)
 * @api POST /api/questionnaire/submit · GET /api/surveys/:id/resources
 * @privacy rol:estudiante
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

  submitSurvey: async (data: SurveySubmitRequest): Promise<SurveySubmitResponse> => {
    try {
      const respuestas = data.responses.map(item => {
        const preguntaId = parseInt(item.questionId.replace(/\D/g, ""), 10);
        let valor = 0;
        if (typeof item.value === 'string') {
          if (!isNaN(Number(item.value))) {
            valor = Number(item.value);
          } else {
            const valMap: Record<string, number> = {
              'alta': 3,
              'media': 2,
              'baja': 1,
              'nula': 0,
              'si': 3,
              'algunas': 2,
              'no': 0,
              'ambos': 3,
              'espacio': 2,
              'internet': 1,
              'ninguno': 0
            };
            valor = valMap[item.value.toLowerCase()] ?? 0;
          }
        } else if (Array.isArray(item.value)) {
          valor = Number(item.value[0]) || 0;
        }
        return { preguntaId, valor };
      }).filter(r => !isNaN(r.preguntaId));

      const response = await api.post<any>('/questionnaire/submit', { respuestas });
      return {
        success: true,
        message: response.data.message || "Tus respuestas fueron recibidas"
      };
    } catch (error) {
      console.warn("Survey API: submitSurvey fallback to mock", error);
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
    try {
      const response = await api.get<InstitutionalResource[]>(`/surveys/${surveyId}/resources`);
      return response.data;
    } catch (error) {
      console.warn("Survey API: getResources fallback to mock", error);
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
  }
};
