/**
 * @module useMedicalBulkAction
 * @epic Épica 4 — Módulo Médico con Privacidad Diferencial
 * @hu HU009
 * @ux UXMM-01, UXMM-02
 * @qa QA-05 (latencia p95 < 1.5 s)
 * @api POST /api/medical/bulk-register
 */

import { useState, useCallback } from 'react';
import { medicalService } from '@/src/services/api/medical';
import { BulkHealthEntry, BulkHealthRegisterRequest } from '../types';

export const useMedicalBulkAction = (groupId: string) => {
  const [entries, setEntries] = useState<BulkHealthEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    if (!groupId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await medicalService.getStudentsByGroup(groupId);
      setEntries(data);
    } catch (err) {
      setError("No se pudo cargar la lista de estudiantes.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  const updateEntry = (studentId: string, updates: Partial<BulkHealthEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.studentId === studentId ? { ...entry, ...updates } : entry
    ));
  };

  const submitBulk = async () => {
    const validEntries = entries.filter(e => e.selectedConditions.length > 0);
    
    if (validEntries.length === 0) {
      setError("Debes seleccionar al menos una condición para un estudiante.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const payload: BulkHealthRegisterRequest = {
        groupId,
        entries: validEntries
      };
      const result = await medicalService.bulkRegister(payload);
      if (result.success) {
        // Podríamos limpiar o redirigir
        return result;
      }
    } catch (err) {
      setError("Error al guardar los registros masivos.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    entries,
    isLoading,
    isSubmitting,
    error,
    fetchStudents,
    updateEntry,
    submitBulk
  };
};
