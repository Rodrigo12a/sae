/**
 * @module StudentExpediente
 * @epic EPICA-5 Derivaciones y Atención Especializada
 * @hu HU010, HU014 — Expediente clínico y académico completo
 * @privacy RBAC: Secciones filtradas por rol.
 */

'use client';

import React, { useState } from 'react';
import { FiUser, FiBook, FiActivity, FiMessageSquare, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import { StudentHealthDetail } from '@/src/features/medico/components/StudentHealthDetail';
import { useStudentProfile } from '@/src/features/dashboard-tutor/hooks/useStudentProfile';
import { SkeletonCard } from '@/src/components/ui/SkeletonCard';
import { useSession } from 'next-auth/react';
import { ReferralContextPanel } from '../../medico/components/ReferralContextPanel/ReferralContextPanel';

interface StudentExpedienteProps {
  studentId: string;
  derivation?: {
    id: string;
    studentName: string;
    tutorName: string;
    fecha: string;
    motivo: string;
    observacionesTutor?: string;
    prioridad: 'alta' | 'crítica' | 'normal';
  };
}

export const StudentExpediente: React.FC<StudentExpedienteProps> = ({ studentId, derivation }) => {
  const { data: session } = useSession();
  const role = session?.user?.role as string;
  const { data: student, isLoading } = useStudentProfile(studentId);
  const [activeTab, setActiveTab] = useState<'contexto' | 'perfil' | 'academico' | 'salud' | 'psicologico'>(derivation ? 'contexto' : 'perfil');

  if (isLoading) return <SkeletonCard className="h-[500px]" />;

  const tabs = [
    { id: 'contexto', label: 'Contexto', icon: <FiAlertCircle />, roles: ['medico', 'psicologo', 'administrador'], hideIfNoDerivation: true },
    { id: 'perfil', label: 'Perfil', icon: <FiUser /> },
    { id: 'academico', label: 'Académico', icon: <FiTrendingUp /> },
    { id: 'salud', label: 'Salud', icon: <FiActivity />, roles: ['medico', 'psicologo', 'administrador'] },
    { id: 'psicologico', label: 'Psicológico', icon: <FiMessageSquare />, roles: ['psicologo', 'administrador'] },
  ];

  const visibleTabs = tabs.filter(tab => {
    const hasRole = !tab.roles || tab.roles.includes(role);
    const hasDerivation = !tab.hideIfNoDerivation || derivation;
    return hasRole && hasDerivation;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header del Estudiante */}
      <div className="bg-[var(--bg-panel)] rounded-3xl p-6 border border-[var(--border-subtle)] shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 bg-[var(--bg-section)] rounded-2xl flex items-center justify-center text-3xl font-black text-[var(--text-muted)] overflow-hidden">
          {student?.photo ? (
            <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
          ) : (
            student?.name.charAt(0)
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[var(--text-primary)]">{student?.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${student?.semaforoEstado === 'rojo' ? 'bg-red-50 text-red-600' :
                student?.semaforoEstado === 'amarillo' ? 'bg-amber-50 text-amber-600' :
                  student?.semaforoEstado === 'revisar' ? 'bg-purple-50 text-purple-600' :
                    'bg-green-50 text-green-600'
              }`}>
              {student?.semaforoEstado || 'Normal'}
            </span>
          </div>
          <p className="text-sm font-bold text-[var(--text-muted)] mt-1 uppercase tracking-widest">
            {student?.carrera} • {student?.matricula || studentId}
          </p>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div className="flex gap-2 p-1 bg-[var(--bg-section)] rounded-2xl w-fit">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab.id
                ? 'bg-[var(--bg-panel)] text-[var(--brand-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
            `}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de Tabs */}
      <div className="flex-1">
        {activeTab === 'contexto' && derivation && (
          <ReferralContextPanel derivation={derivation} />
        )}
        {activeTab === 'perfil' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-lg font-black text-[var(--text-primary)] mb-6">Información General</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Correo Institucional</dt>
                  <dd className="text-sm font-bold text-[var(--text-secondary)]">{(student?.matricula || studentId).toLowerCase()}@universidad.edu.mx</dd>
                </div>
                <div>
                  <dt className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Cuatrimestre / Semestre</dt>
                  <dd className="text-sm font-bold text-[var(--text-secondary)]">{student?.semestre || '—'} Cuatrimestre</dd>
                </div>
                <div>
                  <dt className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest">Tutor Asignado</dt>
                  <dd className="text-sm font-bold text-[var(--text-secondary)]">{student?.tutor || 'No asignado'}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] shadow-sm">
              <h3 className="text-lg font-black text-[var(--text-primary)] mb-6">Últimos Eventos</h3>
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-[var(--bg-section)] rounded-2xl">
                    <div className="p-2 bg-[var(--bg-panel)] rounded-lg text-[var(--brand-primary)] shadow-sm">
                      <FiBook />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">Alerta cerrada</p>
                      <p className="text-xs text-[var(--text-muted)]">Se atendió reporte de inasistencias. 24 Abr 2026</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'academico' && (
          <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] shadow-sm">
            <h3 className="text-lg font-black text-[var(--text-primary)] mb-6">Trayectoria Académica</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-[var(--bg-section)] rounded-2xl border border-[var(--border-subtle)]">
                <p className="text-xs font-black text-[var(--text-muted)] uppercase mb-2">Promedio General</p>
                <p className="text-3xl font-black text-[var(--brand-primary)]">8.7</p>
              </div>
              <div className="p-6 bg-[var(--bg-section)] rounded-2xl border border-[var(--border-subtle)]">
                <p className="text-xs font-black text-[var(--text-muted)] uppercase mb-2">% Inasistencias</p>
                <p className="text-3xl font-black text-[var(--semaforo-amarillo)]">12%</p>
              </div>
              <div className="p-6 bg-[var(--bg-section)] rounded-2xl border border-[var(--border-subtle)]">
                <p className="text-xs font-black text-[var(--text-muted)] uppercase mb-2">Materias Reprobadas</p>
                <p className="text-3xl font-black text-[var(--text-primary)]">0</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'salud' && (
          <div className="space-y-6">
            <StudentHealthDetail studentId={studentId} />
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-4">Antecedentes Clínicos</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Sin alergias reportadas. Esquema de vacunación completo.
                Última revisión médica institucional: 15 de Enero de 2026.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'psicologico' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--bg-panel)] rounded-3xl p-8 border border-[var(--border-subtle)] shadow-sm">
                <h3 className="text-lg font-black text-[var(--text-primary)] mb-6">Bitácora de Intervención</h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-[var(--brand-primary)] pl-6 py-2">
                    <p className="text-xs font-black text-[var(--brand-primary)] uppercase tracking-widest mb-1">20 Abril 2026</p>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      El estudiante muestra signos de ansiedad por carga académica. Se recomienda técnica de gestión de tiempo.
                    </p>
                  </div>
                  <div className="border-l-4 border-[var(--border-strong)] pl-6 py-2">
                    <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">15 Abril 2026</p>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      Primera sesión de diagnóstico. Se detecta desmotivación por falta de recursos económicos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--color-primary)] rounded-3xl p-6 text-white shadow-xl shadow-black/10">
                <h4 className="font-black text-sm uppercase tracking-widest mb-4">Nueva Nota</h4>
                <textarea
                  className="w-full h-32 bg-white/10 border-none rounded-2xl p-4 text-sm placeholder-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all mb-4"
                  placeholder="Escribe el progreso..."
                />
                <button className="w-full py-3 bg-white text-[var(--color-primary)] rounded-xl font-bold text-sm hover:bg-[var(--bg-main)] transition-all">
                  Guardar Bitácora
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
