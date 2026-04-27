/**
 * @module Navbar
 * @description Componente de navegación superior institucional.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FiBell, FiChevronDown, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { signOut, useSession } from 'next-auth/react';

export const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-[72px] bg-white border-b border-[var(--border-subtle)] flex items-center justify-between px-8 z-30 shadow-sm">
      {/* Lado Izquierdo: Contexto de Página */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
          Panel de Gestión
        </h2>
      </div>

      {/* Lado Derecho: Acciones y Perfil */}
      <div className="flex items-center gap-6">
        {/* Notificaciones */}
        <button className="relative p-2 text-slate-500 hover:text-[var(--color-secondary)] hover:bg-slate-50 rounded-full transition-all group">
          <FiBell size={22} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[var(--semaforo-rojo)] border-2 border-white rounded-full animate-pulse group-hover:scale-110"></span>
        </button>

        {/* Perfil de Usuario */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 p-1.5 pl-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-[var(--border-subtle)] transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[var(--text-primary)] leading-none">{session?.user?.name || 'Usuario SAE'}</p>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mt-1 uppercase tracking-wider">{session?.user?.role || 'Personal'}</p>
            </div>
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-secondary-light)]">
              <Image
                src={session?.user?.image || "/imagenes/profile.jpg"}
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
            <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menú Dropdown (UX Premium) */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-[var(--border-subtle)] rounded-2xl shadow-xl overflow-hidden py-2 animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-gray-100 mb-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cuenta</p>
              </div>
              
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-slate-50 hover:text-[var(--color-primary)] transition-colors text-left font-medium">
                <FiUser className="text-slate-400" /> Mi Perfil
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-slate-100 hover:text-[var(--color-primary)] transition-colors text-left font-medium">
                <FiSettings className="text-slate-400" /> Configuración
              </button>

              <div className="h-px bg-gray-100 my-2 mx-4" />

              <button 
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-bold"
              >
                <FiLogOut /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
