/**
 * @page StudentSurveyPage
 * @epic EPICA-1 / HU007 Encuesta Estudiantil
 * @description Punto de entrada para el cuestionario de descerción escolar.
 */
'use client';

import React from 'react';
import { SurveyContainer } from '@/src/features/student-survey/components/SurveyContainer';
import { signOut } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';

export default function StudentSurveyPage() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-red-500 transition-all uppercase tracking-widest"
          >
            <FiLogOut />
            Cerrar Sesión
          </button>
        </div>

        {/* Main Survey Container */}
        <SurveyContainer />

        {/* Footer Info */}
        <footer className="mt-12 text-center">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
            Sistema de Alerta de Deserción Escolar · SAE · UPTX 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
