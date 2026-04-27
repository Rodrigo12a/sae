/**
 * @module ForbiddenPage
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU002
 * @ux UXAU-06
 * @description Página de acceso denegado. El middleware redirige aquí cuando el rol
 *              no tiene permiso para la ruta solicitada. Diseño austero/institucional.
 *              El botón "Ir a mi panel" redirige automáticamente según el rol del usuario.
 * @privacy No expone información sobre qué ruta se intentó acceder
 * @qa QA-03 (UI amigable sin revelar datos del sistema)
 */

'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiShield, FiArrowLeft } from 'react-icons/fi';
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
    <div
      className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center px-6"
      role="main"
      aria-labelledby="forbidden-title"
    >

      {/* Contenedor principal */}
      <div className="w-full max-w-md text-center space-y-8">

        {/* Logotipo / Marca Institucional */}
        <div className="flex justify-center">
          <div
            className="w-20 h-20 rounded-2xl bg-white border border-[var(--border-subtle)] shadow-sm flex items-center justify-center"
            aria-hidden="true"
          >
            <FiShield size={36} className="text-[var(--color-primary)]" />
          </div>
        </div>

        {/* Mensajes */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
            Error 403
          </p>
          <h1
            id="forbidden-title"
            className="text-3xl font-bold text-[var(--text-primary)] tracking-tight"
          >
            Acceso no autorizado
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
            No tienes los permisos necesarios para ver esta sección. 
            Si crees que esto es un error, contacta a tu administrador institucional.
          </p>
        </div>

        {/* Separador */}
        <div className="w-16 h-px bg-[var(--border-subtle)] mx-auto" aria-hidden="true" />

        {/* Acción principal */}
        <button
          onClick={handleGoToPanel}
          className="
            inline-flex items-center gap-2.5 px-6 h-[52px]
            bg-[var(--color-primary)] text-white font-bold rounded-xl
            hover:bg-[var(--color-primary-hover)] active:scale-[0.98]
            transition-all shadow-sm
          "
          aria-label="Regresar a tu panel de inicio"
        >
          <FiArrowLeft size={18} aria-hidden="true" />
          Ir a mi panel
        </button>

        {/* Información de soporte */}
        <p className="text-xs text-[var(--text-muted)]">
          Si el problema persiste, escribe a{' '}
          <span className="font-semibold text-[var(--text-secondary)]">
            soporte@sae.institucional.edu
          </span>
        </p>

      </div>
    </div>
  );
}
