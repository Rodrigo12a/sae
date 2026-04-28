/**
 * @module ProfileView
 * @description Vista universal de perfil de usuario para todos los roles.
 */
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { FiUser, FiMail, FiShield, FiCalendar, FiEdit2, FiLock, FiCamera, FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';

export const ProfileView: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-[2.5rem]" />
        <div className="bg-white h-64 rounded-3xl border border-gray-100" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
          <FiLock size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Sesión no iniciada</h2>
        <p className="text-gray-500 mt-2">Por favor inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header / Banner */}
      <div className="relative h-48 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative -mt-24 px-8 pb-8">
        <div className="bg-white rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Section */}
            <div className="relative group shrink-0">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-[var(--bg-section)]">
                <Image
                  src={user?.image || "/imagenes/profile.jpg"}
                  alt="Avatar"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 p-2.5 bg-white border border-[var(--border-subtle)] rounded-xl text-[var(--brand-primary)] shadow-lg hover:scale-110 active:scale-95 transition-all">
                <FiCamera size={18} />
              </button>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">{user?.name || 'Usuario SAE'}</h1>
                  <p className="text-[var(--brand-primary)] font-bold uppercase tracking-widest text-xs mt-1">{user?.role || 'Personal'}</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[var(--text-primary)] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-black/10">
                  <FiEdit2 /> Editar Perfil
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[var(--bg-section)]">
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <div className="p-2 bg-[var(--bg-section)] rounded-lg"><FiMail /></div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase">Correo Institucional</p>
                    <p className="text-sm font-bold">{user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <div className="p-2 bg-[var(--bg-section)] rounded-lg"><FiShield /></div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase">Nivel de Acceso</p>
                    <p className="text-sm font-bold">Autorizado - {user?.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <div className="p-2 bg-[var(--bg-section)] rounded-lg"><FiCalendar /></div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase">Último Inicio de Sesión</p>
                    <p className="text-sm font-bold">Hoy, 10:45 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <div className="p-2 bg-[var(--bg-section)] rounded-lg"><FiLock /></div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase">Seguridad de Cuenta</p>
                    <p className="text-sm font-bold">Protegida por 2FA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences / Settings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-[var(--border-subtle)] shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Notificaciones</h2>
          <div className="space-y-4">
            {[
              { label: 'Alertas de riesgo crítico', sub: 'Recibir por correo y en panel', active: true },
              { label: 'Resumen semanal de desempeño', sub: 'Enviado los lunes 8:00 AM', active: false },
              { label: 'Nuevos mensajes de tutores', sub: 'Notificaciones instantáneas', active: true },
            ].map((opt, i) => (
              <div key={i} className="flex justify-between items-center group">
                <div>
                  <p className="font-bold text-[var(--text-secondary)] text-sm">{opt.label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{opt.sub}</p>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${opt.active ? 'bg-[var(--brand-primary)]' : 'bg-[var(--bg-section)]'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${opt.active ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[var(--border-subtle)] shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Seguridad Avanzada</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-[var(--bg-section)] rounded-2xl hover:opacity-80 transition-all group">
              <div className="flex items-center gap-3">
                <FiLock className="text-[var(--brand-primary)]" />
                <span className="font-bold text-sm text-[var(--text-secondary)]">Cambiar Contraseña</span>
              </div>
              <FiEdit2 size={16} className="text-[var(--text-muted)] group-hover:text-[var(--brand-primary)]" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-[var(--bg-section)] rounded-2xl hover:opacity-80 transition-all group">
              <div className="flex items-center gap-3">
                <FiShield className="text-[var(--semaforo-verde)]" />
                <span className="font-bold text-sm text-[var(--text-secondary)]">Historial de Accesos</span>
              </div>
              <FiArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--semaforo-verde)]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
