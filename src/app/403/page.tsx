/**
 * @module ForbiddenPage
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU002
 * @description Página 403 premium para el proyecto SAE.
 *              Bloqueo visual estricto pero con estética alineada al sistema de diseño.
 */

'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiShieldOff, FiArrowLeft, FiLock } from 'react-icons/fi';
import { getDashboardByRole } from '@/src/features/auth/utils/redirection';
import { UserRole } from '@/src/features/auth/domain/types';

export default function ForbiddenPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGoToPanel = () => {
    const role = session?.user?.role as UserRole | undefined;
    router.push(getDashboardByRole(role ?? ''));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Elementos decorativos de fondo (Glows en rojo/advertencia) */}
      <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-[var(--color-danger)] opacity-[0.02] blur-[140px] rounded-full" />
      
      <div className="w-full max-w-lg text-center z-10">
        {/* Escudo de Seguridad */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[2rem] bg-white border border-[var(--border-subtle)] shadow-2xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <FiShieldOff size={44} className="text-[var(--color-danger)] opacity-90" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-center shadow-lg">
              <FiLock size={18} className="text-[var(--text-muted)]" />
            </div>
          </div>
        </div>

        {/* Mensajes de Error */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-danger)]/5 border border-[var(--color-danger)]/10 text-[var(--color-danger)] text-xs font-bold uppercase tracking-widest">
            Acceso Denegado · Error 403
          </div>
          
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Sección Protegida
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-md mx-auto leading-relaxed">
              Tu rol actual (<span className="text-[var(--color-primary)] font-semibold">{session?.user?.role || 'Visitante'}</span>) 
              no tiene los permisos suficientes para acceder a este recurso.
            </p>
          </div>
        </div>

        {/* Contenedor de Acción con Glassmorphism */}
        <div className="bg-white/40 backdrop-blur-md border border-white/50 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center gap-6">
          <p className="text-sm text-[var(--text-muted)] text-center">
            Si crees que esto es un error de tu perfil docente, <br />
            por favor contacta al administrador de tu plantel.
          </p>
          
          <button
            onClick={handleGoToPanel}
            className="
              w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 h-[60px]
              bg-[var(--text-primary)] text-white font-bold rounded-2xl
              hover:bg-black hover:shadow-xl transition-all active:scale-[0.98]
            "
          >
            <FiArrowLeft size={20} />
            Regresar a mi panel seguro
          </button>
        </div>

        {/* Soporte Institucional */}
        <p className="mt-12 text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
          ID de Seguridad SAE: <code className="bg-[var(--bg-secondary)] px-2 py-0.5 rounded text-[var(--text-secondary)]">RBAC-{session?.user?.id?.slice(0, 8) || 'GUEST'}</code>
        </p>
      </div>
    </div>
  );
}
