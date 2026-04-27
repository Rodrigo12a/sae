/**
 * @module NotFoundPage
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @description Página 404 premium para el proyecto SAE.
 *              Utiliza el sistema de diseño institucional y redirige al panel según rol.
 */

'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { getDashboardByRole } from '@/src/features/auth/utils/redirection';
import { UserRole } from '@/src/features/auth/domain/types';

export default function NotFound() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGoBack = () => {
    if (session) {
      const role = session.user?.role as UserRole;
      router.push(getDashboardByRole(role));
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Elementos decorativos de fondo (Glows) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)] opacity-[0.03] blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-secondary)] opacity-[0.03] blur-[120px] rounded-full" />

      <div className="w-full max-w-lg text-center z-10">
        {/* Iconografía Premium */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-white border border-[var(--border-subtle)] shadow-xl flex items-center justify-center animate-bounce-slow">
              <FiSearch size={40} className="text-[var(--color-primary)] opacity-80" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--color-danger)] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
              !
            </div>
          </div>
        </div>

        {/* Textos */}
        <div className="space-y-4 mb-10">
          <h1 className="text-8xl font-black text-[var(--text-primary)] opacity-10 tracking-tighter leading-none">
            404
          </h1>
          <div className="space-y-2 -mt-10">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Página no encontrada
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-md mx-auto leading-relaxed">
              Lo sentimos, la ruta que buscas no existe o ha sido movida permanentemente.
            </p>
          </div>
        </div>

        {/* Botón de Acción */}
        <button
          onClick={handleGoBack}
          className="
            inline-flex items-center gap-3 px-8 h-[56px]
            bg-[var(--color-primary)] text-white font-bold rounded-2xl
            hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:shadow-primary/20
            active:scale-[0.98] transition-all
          "
        >
          <FiArrowLeft size={20} />
          {session ? 'Volver a mi panel' : 'Ir al inicio de sesión'}
        </button>

        {/* Footer de Soporte */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)]">
          <p className="text-sm text-[var(--text-muted)]">
            ¿Necesitas ayuda? Contacta con <span className="text-[var(--text-primary)] font-medium">soporte técnico SAE</span>
          </p>
        </div>
      </div>
    </div>
  );
}