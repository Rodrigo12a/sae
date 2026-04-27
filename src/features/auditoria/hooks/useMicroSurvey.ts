/**
 * @module useMicroSurvey
 * @epic EPICA-8 Auditoría y Control de Calidad
 * @hu HU022
 * @ux UXAU-01 Verificación de intervención
 * @qa QA-07 Confiabilidad de auditoría
 * @api GET /api/audit/micro-surveys/:token · POST /api/audit/micro-surveys/:token/submit
 */

import { useState, useEffect } from 'react';
import { getMicroSurvey, submitMicroSurvey } from '@/src/services/api/audit';
import { MicroSurveyData, MicroSurveyResponse, MicroSurveyStatus } from '../types';

export function useMicroSurvey(token: string) {
  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'expired' | 'error'>('loading');
  const [data, setData] = useState<MicroSurveyData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadSurvey() {
      try {
        const result = await getMicroSurvey(token);
        if (result.status === 'pending' && result.data) {
          setData(result.data);
          setStatus('pending');
        } else if (result.status === 'expired') {
          setStatus('expired');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    }

    if (token) {
      loadSurvey();
    }
  }, [token]);

  const submit = async (responses: MicroSurveyResponse) => {
    setIsSubmitting(true);
    try {
      const result = await submitMicroSurvey(token, responses);
      if (result.success) {
        setStatus('success');
      } else {
        throw new Error('Submit failed');
      }
    } catch (err) {
      // En un caso real aquí usaríamos un Toast
      console.error('Error submitting survey:', err);
      alert('Hubo un error al enviar tus respuestas. Por favor reintenta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    status,
    data,
    isSubmitting,
    submit,
    retry: () => setStatus('loading')
  };
}
