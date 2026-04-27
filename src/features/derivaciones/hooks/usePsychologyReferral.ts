import { useState, useEffect } from 'react';
import { referralsService } from '@/src/services/api/referrals';
import { 
  DepartmentCapacity, 
  ReferralReason, 
  PsychologyReferralRequest 
} from '../types';
import { toast } from 'sonner';

/**
 * @module usePsychologyReferral
 * @epic EPICA-5 Derivaciones y Atención Especializada
 * @hu HU012 Derivar caso a psicología
 * @ux UXDT-08 (Confirmación de derivación), UXDT-09 (Alerta de saturación)
 * @qa QA-05 (latencia p95 < 1.5 s)
 * @api GET /api/referrals/capacity/psychology · POST /api/referrals/psychology
 * @privacy rol:tutor -> descripción observable únicamente
 */
export const usePsychologyReferral = (studentId: string) => {
  const [loading, setLoading] = useState(false);
  const [capacity, setCapacity] = useState<DepartmentCapacity | null>(null);
  const [reasons, setReasons] = useState<ReferralReason[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cap, res] = await Promise.all([
          referralsService.getPsychologyCapacity(),
          referralsService.getReferralReasons()
        ]);
        setCapacity(cap);
        setReasons(res);
      } catch (error) {
        toast.error('Error al cargar información del departamento');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchData();
  }, [studentId]);

  const submitReferral = async (data: Omit<PsychologyReferralRequest, 'studentId'>) => {
    setSubmitting(true);
    try {
      // Validación básica de privacidad frontend
      const clinicalTerms = ['depresión', 'ansiedad', 'trastorno', 'suicida', 'psicosis'];
      const hasClinicalTerms = clinicalTerms.some(term => 
        data.descripcionObservable.toLowerCase().includes(term)
      );

      if (hasClinicalTerms) {
        toast.warning('Por favor, evite usar términos clínicos. Describa solo conductas observables.', {
          duration: 5000
        });
        setSubmitting(false);
        return false;
      }

      await referralsService.createPsychologyReferral({
        ...data,
        studentId
      });
      
      toast.success('Derivación enviada exitosamente');
      return true;
    } catch (error) {
      toast.error('Error al enviar la derivación');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    capacity,
    reasons,
    submitting,
    submitReferral
  };
};
