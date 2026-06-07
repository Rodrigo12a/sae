/**
 * @module QuestionnaireTypes
 * @description Contratos TypeScript para los endpoints V2.0 del cuestionario SAE.
 * @epic EPICA-1 Módulo Estudiantil / Encuesta Estudiantil
 */

import { SemaforoEstado } from './alert';

/** Representa una respuesta individual del cuestionario */
export interface RespuestaItemDto {
  preguntaId: number; // 1 a 52
  valor: number;      // Escala 0-4 (excepto pregunta 10: 1 a 10)
}

/** Payload para enviar el cuestionario */
export interface CreateResponseDto {
  respuestas: RespuestaItemDto[];
}

/** Resultado del procesamiento de Machine Learning */
export interface PredictionDto {
  studentId: string;
  semaforo: 'rojo' | 'amarillo' | 'revisar' | 'verde';
  riesgo_pct: number;
  diagnostico: string;
  alerta_principal?: string;
  sugerencia?: string;
  focos_rojos?: string[];
}

/** Respuesta al enviar un cuestionario exitosamente */
export interface SubmitResponseDto {
  id: string; // ID de la evaluación guardada
  message: string;
  totalPreguntas: number;
  prediccion?: PredictionDto;
  mlError?: string; // Si el microservicio de ML falló
}

/** Representa un registro de evaluación en el historial */
export interface EvaluationItem {
  id: string;
  alumnoId?: string;
  nombre?: string;
  matricula?: string;
  totalPreguntas: number;
  fecha: string; // ISO String
  estado: 'pendiente' | 'procesado' | 'error_ml';
  resultado?: {
    semaforo: SemaforoEstado;
    riesgo_pct?: number; // Puede estar ausente en rol tutor
    diagnostico?: string;
  };
}

/** Recurso institucional de apoyo */
export interface SurveyResource {
  id: string;
  title: string;
  description: string;
  icon: string;
  location?: string;
  phone?: string;
}
