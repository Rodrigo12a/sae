'use client';

import React, { useState, useEffect } from 'react';
import { useGroupStudents } from '../../hooks/useGroupStudents';
import { useMedicalConditions } from '../../hooks/useMedicalConditions';
import { useBulkMedicalRegister } from '../../hooks/useBulkMedicalRegister';
import { StudentChecklistRow } from '../StudentChecklistRow';
import { BulkHealthEntry } from '../../types';
import { FiLock, FiFileText, FiAlertCircle, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'sonner';

/**
 * @module BulkJornadaView
 * @epic EPICA-4
 * @hu HU009
 * @ux UXMM-01, UXMM-02, UXMM-04
 * @privacy Expone datos clínicos; uso exclusivo por rol Médico.
 * @description Contenedor principal de la carga masiva en jornadas de salud.
 */
export function BulkJornadaView() {
  const [groupId, setGroupId] = useState<string>(''); // Para simplificar, en un caso real se elegiría de un dropdown
  const [entries, setEntries] = useState<BulkHealthEntry[]>([]);

  const { data: conditions, isLoading: loadingConditions } = useMedicalConditions();
  const { data: students, isLoading: loadingStudents, isFetching } = useGroupStudents(groupId || undefined);
  const { mutate: submitBulk, isPending } = useBulkMedicalRegister();

  // Mapeamos los datos del backend al estado local cuando se cargan
  useEffect(() => {
    if (students) {
      setEntries(students.map(s => ({ ...s, selectedConditions: [...s.selectedConditions] })));
    } else {
      setEntries([]);
    }
  }, [students]);

  // Manejo de grupo simulado (en prod vendría de un API de grupos)
  const handleSimulateLoadGroup = () => {
    setGroupId('grupo-501');
  };

  const handleEntryChange = (studentId: string, conditionIds: string[]) => {
    setEntries(prev => prev.map(e => e.studentId === studentId ? { ...e, selectedConditions: conditionIds } : e));
    
    // Verificamos si hay condiciones sin traducción (HU009 Criterio 2)
    if (conditions) {
      const addedConditions = conditions.filter(c => conditionIds.includes(c.id));
      const noTranslation = addedConditions.find(c => !c.operativeTag);
      if (noTranslation) {
        toast.warning(`La condición "${noTranslation.name}" no tiene traducción operativa asignada. Se guardará, pero el tutor solo verá "Seguimiento médico requerido".`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || entries.length === 0) return;

    submitBulk({ groupId, entries }, {
      onSuccess: () => {
        // Los datos se invalidan y recargan en el hook, podemos resetear selecciones
        setGroupId('');
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiFileText className="w-6 h-6 text-blue-600" />
            Captura Masiva de Salud
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
            <FiLock className="w-4 h-4 text-amber-600" aria-label="Datos protegidos" />
            Registro de expedientes clínicos protegido bajo Privacidad Diferencial
          </p>
        </div>
      </header>

      {/* Control de Grupo (Simplificado para el caso) */}
      <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FiUsers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-medium text-gray-900">Selección de Grupo</h2>
            <p className="text-sm text-gray-500">Carga la nómina para evaluación rápida</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={handleSimulateLoadGroup}
          disabled={!!groupId || loadingStudents}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors min-h-[44px] disabled:opacity-50"
        >
          {groupId ? 'Grupo 501 Seleccionado' : 'Cargar Grupo 501 (Demo)'}
        </button>
      </section>

      {/* Área de Checklist */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">Checklist Clínico Estudiantil</h2>
          {entries.length > 0 && (
            <span className="text-sm text-gray-500 font-medium">{entries.length} alumnos</span>
          )}
        </div>

        {/* Loading State */}
        {(loadingConditions || isFetching) && (
          <div className="p-8 text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500">Cargando nómina y catálogo clínico...</p>
          </div>
        )}

        {/* Empty State */}
        {!groupId && !loadingStudents && !isFetching && (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <FiUsers className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Ningún grupo seleccionado</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">
              Selecciona un grupo académico para cargar la nómina de estudiantes y comenzar la asignación de condiciones médicas.
            </p>
          </div>
        )}

        {/* Success / Loaded State */}
        {groupId && !isFetching && conditions && entries.length > 0 && (
          <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
            {entries.map(entry => (
              <StudentChecklistRow 
                key={entry.studentId}
                entry={entry}
                conditions={conditions}
                onChange={handleEntryChange}
                disabled={isPending}
              />
            ))}
            
            <div className="p-4 bg-gray-50 flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors min-h-[44px]"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-5 h-5" />
                    Guardar Expedientes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
