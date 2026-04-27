/**
 * @module EncuestaTypes
 * @epic Épica 3 — Encuesta de Contexto (Estudiante)
 * @hu HU007, HU008
 */

export type QuestionType = 'radio' | 'checkbox' | 'text' | 'textarea';

export interface SurveyQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
}

export interface SurveyResponse {
  questionId: string;
  value: string | string[];
}

export interface SurveySubmitRequest {
  surveyId: string;
  responses: SurveyResponse[];
  completionTimeMs: number;
  offlineCached: boolean;
}

export interface SurveySubmitResponse {
  success: boolean;
  message: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  expired: boolean;
  survey?: Survey;
}

export interface InstitutionalResource {
  id: string;
  title: string;
  description: string;
  icon: string;
  link?: string;
  location?: string;
  phone?: string;
}

export interface ResourceResponse {
  resources: InstitutionalResource[];
}
