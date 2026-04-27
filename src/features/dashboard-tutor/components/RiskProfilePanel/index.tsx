/**
 * @module RiskProfilePanel
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU004
 * @ux UXDT-06, UXDT-07, UXDT-08, UXDT-09, UXDT-10
 * @qa QA-01 (sin datos clínicos) · QA-03 (candado visual obligatorio en salud)
 * @api GET /students/:id/risk-profile · GET /students/:id/academic-history
 * @privacy Usa DimensionSaludTutor — sin diagnosticoClinico en DOM del Tutor.
 *          Doble capa: tipo TypeScript + filterHealthByRole() en el hook.
 */

'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Semaforo } from '@/src/components/ui/Semaforo';
import { SaludTutorView } from './SaludTutorView';
import { AlertHistoryTimeline } from '../AlertHistoryTimeline';
import { SkeletonRiskProfile } from '@/src/components/ui/SkeletonCard';
import { useStudentRiskProfile } from '../../hooks/useStudentRiskProfile';
import type { StudentRiskProfile, AcademicHistory } from '@/src/types/student';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────────────────────────────────────

function StudentHeader({ profile }: { profile: StudentRiskProfile }) {
  const initials = profile.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Avatar */}
      <div
        className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
        style={{ backgroundColor: '#3A7BC8' }}
        aria-hidden="true"
      >
        {profile.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.photo} alt={`Foto de ${profile.name}`} className="w-full h-full rounded-full object-cover" />
        ) : initials}
      </div>

      {/* Datos del estudiante */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-gray-900 truncate">{profile.name}</h1>
        <p className="text-sm text-gray-500">{profile.carrera} · Semestre {profile.semestre}</p>
        <p className="text-xs text-gray-400 mt-0.5">Matrícula: {profile.matricula}</p>
      </div>

      {/* Indicador de encuesta */}
      {!profile.encuestaCompletada && (
        <div
          role="alert"
          className="shrink-0 flex flex-col items-end gap-2"
        >
          <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
            Variables personales: pendientes
          </span>
          <button
            className="
              text-xs text-blue-600 hover:text-blue-800 underline
              focus:outline-none focus:ring-2 focus:ring-blue-500 rounded
              min-h-[44px] px-2
            "
            aria-label={`Reenviar encuesta a ${profile.name}`}
          >
            Reenviar encuesta
          </button>
        </div>
      )}
    </div>
  );
}

function RiskDimensions({ profile }: { profile: StudentRiskProfile }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Académico */}
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
        <Semaforo
          estado={profile.academico.semaforoEstado}
          etiqueta={profile.academico.etiquetaOperativa}
          dimension="Académico"
          size="sm"
        />
      </div>

      {/* Socioeconómico */}
      <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
        <Semaforo
          estado={profile.socioeconomico.semaforoEstado}
          etiqueta={profile.socioeconomico.etiquetaOperativa}
          dimension="Socioeconómico"
          size="sm"
        />
      </div>

      {/* Salud — Vista exclusiva del Tutor con LockIcon */}
      <SaludTutorView salud={profile.salud} />
    </div>
  );
}

function AcademicCharts({ history }: { history: AcademicHistory }) {
  const [activeChart, setActiveChart] = useState<'asistencia' | 'calificaciones'>('asistencia');

  return (
    <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Tabs */}
      <div role="tablist" className="flex gap-2 mb-5">
        <button
          role="tab"
          aria-selected={activeChart === 'asistencia'}
          onClick={() => setActiveChart('asistencia')}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-h-[44px]
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${activeChart === 'asistencia'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          Asistencia
        </button>
        <button
          role="tab"
          aria-selected={activeChart === 'calificaciones'}
          onClick={() => setActiveChart('calificaciones')}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-lg transition-colors min-h-[44px]
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${activeChart === 'calificaciones'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          Calificaciones
        </button>
      </div>

      {/* Gráfica de Asistencia */}
      {activeChart === 'asistencia' && (
        <div aria-label="Gráfica de asistencia mensual">
          {history.asistencia.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin datos de asistencia disponibles.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={history.asistencia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94A3B8' }} unit="%" />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [`${value ?? 0}%`, 'Asistencia']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                />
                <Line
                  type="monotone"
                  dataKey="porcentaje"
                  stroke="#3A7BC8"
                  strokeWidth={2}
                  dot={{ fill: '#3A7BC8', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Asistencia"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
          <p className="text-xs text-gray-400 mt-2 text-right">
            Promedio general: <span className="font-semibold text-gray-600">{history.asistenciaGeneral.toFixed(1)}%</span>
          </p>
        </div>
      )}

      {/* Gráfica de Calificaciones */}
      {activeChart === 'calificaciones' && (
        <div aria-label="Gráfica de calificaciones por materia">
          {history.calificaciones.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin datos de calificaciones disponibles.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={history.calificaciones} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis dataKey="materia" type="category" tick={{ fontSize: 11, fill: '#94A3B8' }} width={90} />
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [value ?? 0, 'Promedio']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="promedio" fill="#3A7BC8" radius={[0, 4, 4, 0]} name="Calificación" />
              </BarChart>
            </ResponsiveContainer>
          )}
          <p className="text-xs text-gray-400 mt-2 text-right">
            Promedio general: <span className="font-semibold text-gray-600">{history.promedioGeneral.toFixed(1)}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

interface RiskProfilePanelProps {
  studentId: string;
  /** Callback para cuando el tutor quiere registrar un seguimiento */
  onFollowUp?: () => void;
  /** Callback para cuando el tutor quiere cerrar la alerta */
  onCloseAlert?: () => void;
  /** Callback para cuando el tutor quiere derivar a psicología */
  onReferToPsychology?: () => void;
  /** Callback para cuando el tutor quiere derivar a servicios médicos */
  onReferToMedical?: () => void;
}

export function RiskProfilePanel({
  studentId,
  onFollowUp,
  onCloseAlert,
  onReferToPsychology,
  onReferToMedical,
}: RiskProfilePanelProps) {
  const { profile, academicHistory, isLoading, error, refetch } =
    useStudentRiskProfile(studentId);

  if (isLoading) return <SkeletonRiskProfile />;

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-3xl mb-3" aria-hidden="true">⚠️</span>
        <p className="text-sm font-semibold text-red-700 mb-1">Error al cargar el perfil</p>
        <p className="text-xs text-gray-500 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 min-h-[44px]"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!profile) return null;

  // Solo habilitar derivación si hay alerta activa (roja o amarilla)
  const canRefer = profile.academico.semaforoEstado === 'rojo' || 
                   profile.academico.semaforoEstado === 'amarillo';

  return (
    <div className="flex flex-col gap-5">
      {/* Header del estudiante */}
      <StudentHeader profile={profile} />

      {/* Dimensiones de riesgo (semáforos) */}
      <section aria-labelledby="risk-dimensions-heading">
        <h2 id="risk-dimensions-heading" className="sr-only">Dimensiones de riesgo</h2>
        <RiskDimensions profile={profile} />
      </section>

      {/* Gráficas académicas */}
      {academicHistory && (
        <section aria-labelledby="academic-charts-heading">
          <h2 id="academic-charts-heading" className="text-sm font-bold text-gray-700 mb-3 px-1">
            Historial académico
          </h2>
          <AcademicCharts history={academicHistory} />
        </section>
      )}

      {/* Historial de alertas */}
      <section
        aria-labelledby="alert-history-heading"
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
      >
        <h2 id="alert-history-heading" className="text-sm font-bold text-gray-700 mb-4">
          Historial de alertas
        </h2>
        <AlertHistoryTimeline history={profile.alertHistory} />
      </section>

      {/* Acciones rápidas */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          {onFollowUp && (
            <button
              onClick={onFollowUp}
              className="
                flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-colors min-h-[44px]
              "
              aria-label="Registrar seguimiento para este estudiante"
            >
              ✏️ Registrar seguimiento
            </button>
          )}
          {onCloseAlert && (
            <button
              onClick={onCloseAlert}
              className="
                flex-1 px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-xl
                hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
                transition-colors min-h-[44px]
              "
              aria-label="Cerrar alerta activa de este estudiante"
            >
              ✅ Cerrar alerta
            </button>
          )}
        </div>
        
        <div className="flex gap-3">
          {onReferToPsychology && (
            <button
              onClick={onReferToPsychology}
              disabled={!canRefer}
              className={`
                flex-1 px-4 py-3 text-sm font-medium rounded-xl
                focus:outline-none focus:ring-2 focus:ring-purple-500
                transition-all min-h-[44px] flex flex-col items-center justify-center gap-1
                ${canRefer 
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200 shadow-sm' 
                  : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed opacity-60'}
              `}
              aria-label="Derivar este caso al departamento de psicología"
            >
              <div className="flex items-center gap-2">
                🧠 <span>A Psicología</span>
              </div>
              {!canRefer && <span className="text-[10px] font-normal">(Requiere alerta activa)</span>}
            </button>
          )}

          {onReferToMedical && (
            <button
              onClick={onReferToMedical}
              disabled={!canRefer}
              className={`
                flex-1 px-4 py-3 text-sm font-medium rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all min-h-[44px] flex flex-col items-center justify-center gap-1
                ${canRefer 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 shadow-sm' 
                  : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed opacity-60'}
              `}
              aria-label="Derivar este caso a servicios médicos"
            >
              <div className="flex items-center gap-2">
                ⚕️ <span>A Servicios Médicos</span>
              </div>
              {!canRefer && <span className="text-[10px] font-normal">(Requiere alerta activa)</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiskProfilePanel;
