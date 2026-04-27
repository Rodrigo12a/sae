import React from 'react';
import { DrillDownRequest } from '../../types';
import { useDrillDown } from '../../hooks/useDrillDown';
import { Semaforo } from '@/src/components/ui/Semaforo';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';

/**
 * @module DrillDownPanel
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU017
 * @ux UXDT-07
 * @privacy Muestra detalles limitados por rol Administrador (sin diagnóstico clínico).
 */

interface DrillDownPanelProps {
  request: DrillDownRequest;
  onNavigateToStudent: (studentId: string) => void;
}

export const DrillDownPanel: React.FC<DrillDownPanelProps> = ({ request, onNavigateToStudent }) => {
  const { data, isLoading, isError, refetch } = useDrillDown(request);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
        <SkeletonCard lines={3} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
        <div className="flex items-center gap-2 mb-2">
          <span>⚠️</span>
          <h3 className="font-semibold">Error al cargar el detalle</h3>
        </div>
        <p className="text-sm mb-4">Hubo un problema al recuperar los estudiantes. Intenta nuevamente.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded font-medium text-sm transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!data || data.students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 h-64">
        <span className="text-4xl mb-3">📭</span>
        <h3 className="text-lg font-medium text-gray-700">Sin anomalías críticas</h3>
        <p className="text-sm mt-1">No se encontraron estudiantes en riesgo alto para este cohorte.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Total Estudiantes en Riesgo
        </span>
        <span className="bg-[var(--brand-primary)] text-white px-3 py-1 rounded-full text-sm font-bold">
          {data.totalStudentsAtRisk}
        </span>
      </div>

      <div className="space-y-3">
        {data.students.map((student) => (
          <div
            key={student.id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{student.name}</h4>
                <span className="text-xs text-gray-500">ID: {student.id} • Semestre {student.semester}</span>
              </div>
              <button
                onClick={() => onNavigateToStudent(student.id)}
                className="text-sm text-[var(--brand-primary)] hover:underline font-medium"
                aria-label={`Ver perfil de ${student.name}`}
              >
                Ver perfil →
              </button>
            </div>

            <Semaforo
              estado={student.semaforoEstado as any}
              etiqueta={student.etiquetaOperativa}
              size="sm"
            />

            <div className="mt-4">
              <span className="text-xs font-semibold text-gray-500 uppercase">Variables Predominantes</span>
              <ul className="mt-1 space-y-1">
                {student.predominantVariables.map((variable, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    {variable}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
