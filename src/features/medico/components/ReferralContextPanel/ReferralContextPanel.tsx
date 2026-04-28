/**
 * @module ReferralContextPanel
 * @epic EPICA-4 Módulo Médico con Privacidad Diferencial
 * @hu HU012 — Seguimiento de casos derivados
 * @description Muestra el contexto de la derivación (quién, por qué, cuándo) para el médico.
 */
'use client';

import React from 'react';
import { FiUsers, FiCalendar, FiMessageSquare, FiShield, FiAlertTriangle } from 'react-icons/fi';

interface ReferralContextProps {
  derivation: {
    id: string;
    studentName: string;
    tutorName: string;
    fecha: string;
    motivo: string;
    observacionesTutor?: string;
    prioridad: 'alta' | 'crítica' | 'normal';
  };
}

export const ReferralContextPanel: React.FC<ReferralContextProps> = ({ derivation }) => {
  return (
    <div className="bg-white rounded-3xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      {/* Header Contexto */}
      <div className="bg-slate-50 border-b border-gray-100 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Contexto de Derivación</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                Expediente: {derivation.id}
              </p>
            </div>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${
            derivation.prioridad === 'crítica' ? 'bg-red-100 text-red-700 animate-pulse' : 
            derivation.prioridad === 'alta' ? 'bg-orange-100 text-orange-700' : 
            'bg-blue-100 text-blue-700'
          }`}>
            {derivation.prioridad}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Tutor Info */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <FiUsers className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Derivado por:</p>
            <p className="font-bold text-slate-800">{derivation.tutorName}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FiCalendar /> {derivation.fecha}
            </div>
          </div>
        </div>

        {/* Motivo Principal */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
            <FiAlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Motivo de Alerta:</p>
            <p className="text-sm font-bold text-slate-700 leading-relaxed bg-orange-50/50 p-4 rounded-2xl border border-orange-100 italic">
              "{derivation.motivo}"
            </p>
          </div>
        </div>

        {/* Observaciones del Tutor */}
        {derivation.observacionesTutor && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FiMessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observaciones del Tutor:</p>
              <div className="text-sm text-slate-600 leading-relaxed p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {derivation.observacionesTutor}
              </div>
            </div>
          </div>
        )}

        {/* Nota de Privacidad */}
        <div className="pt-6 border-t border-slate-50">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            <FiShield /> Información confidencial · Ley de Protección de Datos
          </div>
        </div>
      </div>
    </div>
  );
};
