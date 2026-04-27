/**
 * @module useStudentHealth
 * @epic Épica 4 — Módulo Médico con Privacidad Diferencial
 * @hu HU010, HU011
 * @ux UXMM-05, UXMM-06, UXMM-07, UXMM-08
 * @qa QA-05 (latencia p95 < 1.5 s)
 * @api GET /api/medical/students/:id/health
 * @privacy Aplica privacidad diferencial basada en el rol de la sesión.
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { medicalService } from '@/src/services/api/medical';
import { HealthProfileMedico, HealthProfileTutor, ProlongedAlertRequest } from '../types';
import { toast } from 'sonner';

export function useStudentHealth(studentId: string) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<HealthProfileMedico | HealthProfileTutor | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    if (!studentId || !session?.user?.role) return;

    try {
      setLoading(true);
      const data = await medicalService.getStudentHealth(studentId, session.user.role);
      setHealthData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching health data:', err);
      setError('No se pudo cargar el perfil de salud');
      toast.error('Error al cargar datos médicos');
    } finally {
      setLoading(false);
    }
  };

  const updateHealth = async (update: Partial<HealthProfileMedico>) => {
    if (!studentId) return false;

    try {
      const success = await medicalService.updateStudentHealth(studentId, update);
      if (success) {
        toast.success('Perfil de salud actualizado');
        fetchHealth(); // Refrescar datos
        return true;
      }
      return false;
    } catch (err) {
      toast.error('Error al actualizar perfil de salud');
      return false;
    }
  };
  
  const sendProlongedAlert = async (data: ProlongedAlertRequest) => {
    if (!studentId) return false;
    
    try {
      const success = await medicalService.sendProlongedAlert(studentId, data);
      if (success) {
        toast.success('Alerta de impacto prolongado enviada al tutor');
        return true;
      }
      return false;
    } catch (err) {
      toast.error('Error al enviar alerta prolongada');
      return false;
    }
  };
  
  useEffect(() => {
    fetchHealth();
  }, [studentId, session?.user?.role]);

  return {
    loading,
    healthData,
    error,
    updateHealth,
    sendProlongedAlert,
    refresh: fetchHealth,
  };
}
