/**
 * @module MisTutorados
 * @epic EPICA-0 Problema Estructural - Asignación Tutor-Alumno
 * @hu HU007, P0.5
 * @api GET /carreras/{carreraId}/alumnos
 * @privacy Muestra semáforo y etiqueta operativa. Nunca muestra scores numéricos de riesgo al tutor.
 */

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getAdminCarreras, getCarreraAlumnos } from '@/src/services/api/admin';
import { userService } from '@/src/services/api/users';
import { FiUsers, FiArrowRight, FiCheckCircle, FiAlertTriangle, FiEye, FiClock, FiShield } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export const MisTutorados: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [tutorados, setTutorados] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndFilterTutorados = async () => {
      if (!session?.user?.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await userService.getTutorados();
        const mapped = data.map(s => ({
          ...s,
          id: s.uid,
          careerName: (s as any).carreraNombre || '',
          careerId: (s as any).carreraId || '',
          semaforoEstado: (s as any).semaforoEstado || 'sin-datos',
          etiquetaOperativa: (s as any).etiquetaOperativa || 'Sin encuesta completada'
        }));
        setTutorados(mapped);
      } catch (err: any) {
        console.warn('Error fetching tutorados:', err?.message || err);
        setError('No se pudo cargar la lista de tutorados.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterTutorados();
  }, [session]);

  const getSemaforoBadge = (estado: string, label?: string) => {
    switch (estado?.toLowerCase()) {
      case 'rojo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
            <FiAlertTriangle className="text-red-600" />
            {label || 'Requiere apoyo'}
          </span>
        );
      case 'amarillo':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <FiAlertTriangle className="text-amber-600" />
            {label || 'Seguimiento recomendado'}
          </span>
        );
      case 'verde':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800 border border-green-200">
            <FiCheckCircle className="text-green-600" />
            En seguimiento normal
          </span>
        );
      case 'revisar':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <FiEye className="text-purple-600" />
            Datos pendientes de verificación
          </span>
        );
      case 'sin-datos':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
            <FiClock className="text-slate-600" />
            Sin encuesta completada
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <FiUsers className="text-blue-500" />
          Mis tutorados
        </h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <p className="text-sm text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <FiUsers className="text-blue-500" />
          Mis tutorados
        </h3>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {tutorados.length} estudiantes
        </span>
      </div>

      {tutorados.length === 0 ? (
        <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          No tienes tutorados asignados actualmente.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tutorados.map((student) => (
            <div
              key={student.uid || student.id}
              className="flex flex-col justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100/50 transition-all shadow-sm"
            >
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{student.nombre}</h4>
                <p className="text-xs text-gray-500 mt-0.5">Matrícula: {student.matricula || 'N/A'}</p>
                {student.careerName && (
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 font-medium">
                    <FiShield size={10} />
                    {student.careerName}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div>
                  {getSemaforoBadge(student.semaforoEstado || student.semaforo, student.etiquetaOperativa)}
                </div>
                <button
                  onClick={() => router.push(`/tutor/estudiante/${student.uid || student.id}`)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline min-h-[32px] px-2.5 py-1 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Ver Perfil
                  <FiArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
