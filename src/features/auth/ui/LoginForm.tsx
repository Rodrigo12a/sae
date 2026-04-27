/**
 * @module LoginForm
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU001
 * @ux UX-AU-01 a UX-AU-05
 * @qa QA-01 Lockout por intentos
 * @description Componente de formulario de acceso. Se renderiza dentro del AuthLayout.
 */

'use client';

import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import Link from 'next/link';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading, error, isBlocked, timeRemaining } = useLogin();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({ email, password });
  };

  return (
    <div className="w-full space-y-8" id="login-form-feature">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Ingresa a tu cuenta</h2>
        <p className="text-[var(--text-secondary)] font-medium">Gestiona tu trayectoria académica desde un solo lugar.</p>
      </header>

      {error && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${isBlocked ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`} role="alert">
          <span className="text-xl">{isBlocked ? '🛑' : '⚠️'}</span>
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-bold text-[var(--text-secondary)] ml-1">Cédula o Correo</label>
          <input
            id="email"
            type="text"
            required
            disabled={isBlocked || loading}
            placeholder="Introduce tu identificación"
            className="w-full h-[52px] px-5 rounded-xl border border-[var(--border-strong)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all shadow-sm bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label htmlFor="password" className="text-sm font-bold text-[var(--text-secondary)]">Contraseña</label>
            <Link href="/auth/forgot-password" className="text-xs font-bold text-[var(--color-secondary)] hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            disabled={isBlocked || loading}
            placeholder="••••••••"
            className="w-full h-[52px] px-5 rounded-xl border border-[var(--border-strong)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all shadow-sm bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isBlocked || loading}
          className="w-full h-[56px] bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] active:scale-[0.99] transition-all disabled:opacity-50 shadow-lg shadow-blue-900/10 mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verificando...
            </span>
          ) : isBlocked ? (
            `Cuenta BLOQUEADA (${timeRemaining}m)`
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>

      <div className="pt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border-subtle)]"></span>
          </div>
          {/*
          <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
            <span className="bg-[#F2F2F2] px-4 text-[var(--text-muted)]">O accede vía SSO</span>
          </div>
          */}
        </div>
        { /*
        <div className="mt-6 flex gap-4">
          <button className="flex-1 h-[52px] flex items-center justify-center gap-3 bg-white border border-[var(--border-strong)] rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm shadow-sm">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_Logo.svg" className="w-5 h-5" alt="Google" />
            Google
          </button>
          <button className="flex-1 h-[52px] flex items-center justify-center gap-3 bg-white border border-[var(--border-strong)] rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm shadow-sm">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-5 h-5" alt="Apple" />
            Apple
          </button>
        </div>
        */}
      </div>
    </div>
  );
};
