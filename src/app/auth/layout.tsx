/**
 * @module AuthLayout
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @description Layout compartido para vistas de autenticación (Login, Recuperación, Consentimiento).
 * Proporciona el marco visual institucional (Split-Screen).
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-main)] font-['Inter']">

      {/* Panel Izquierdo: Branding e Imagen Institucional (Premium) */}
      <aside className="hidden md:flex md:w-5/12 lg:w-1/2 bg-[var(--color-primary)] relative overflow-hidden items-center justify-center p-12 text-white">
        {/* Capas de diseño abstracto */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] z-0" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[var(--color-secondary)] opacity-10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-accent)] opacity-5 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-lg space-y-8 animate-fade-in">
          <div className="space-y-4">

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Acompañamiento <br />
              <span className="text-[var(--color-accent)]">Inteligente</span>
            </h1>
            <p className="text-xl text-[var(--color-secondary-light)] opacity-80 leading-relaxed max-w-md">
              Plataforma de gestión académica avanzada para la excelencia estudiantil.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg">🛡️</span>
              Privacidad diferencial aplicada por rol.
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg">📈</span>
              Análisis predictivo de trayectoria académica.
            </div>
          </div>
        </div>
      </aside>

      {/* Panel Derecho: Contenido de formulario y acciones */}
      <main className="flex-1 flex flex-col bg-[var(--bg-main)] items-center justify-center relative">
        <div className="w-full flex-grow flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[450px] animate-fade-in">
            {/* Logo visible solo en móvil */}


            {children}
          </div>
        </div>

        {/* Footer Institucional y Legales */}
        <footer className="w-full max-w-[450px] px-6 pb-8 space-y-4 text-center">
          <p className="text-[11px] leading-relaxed text-gray-500">
            Al acceder, aceptas nuestros{' '}
            <Link
              href="/terminos-y-condiciones"
              className="text-[var(--color-secondary)] font-semibold underline hover:text-[var(--color-primary)] transition-colors"
            >
              Términos, condiciones y políticas de privacidad
            </Link>
            .
          </p>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              © {currentYear} SAE | Universidad Politécnica del Estado de Tlaxcala
            </p>
          </div>
        </footer>
      </main>

    </div>
  );
}