/**
 * @module ProfileView
 * @description Vista universal de perfil de usuario para todos los roles.
 */
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { FiUser, FiMail, FiShield, FiCalendar, FiEdit2, FiLock, FiCamera, FiArrowRight, FiMessageSquare } from 'react-icons/fi';
import Image from 'next/image';

export const ProfileView: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-48 bg-[var(--bg-section)] rounded-[3rem]" />
        <div className="bg-white rounded-[2.5rem] border border-[var(--border-subtle)] h-80" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-24 h-24 bg-[var(--bg-section)] rounded-[2rem] flex items-center justify-center text-[var(--text-muted)] mb-8">
          <FiLock size={40} />
        </div>
        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Acceso Restringido</h2>
        <p className="text-[var(--text-secondary)] mt-3 max-w-xs mx-auto font-medium leading-relaxed">
          Es necesario iniciar sesión con tus credenciales institucionales para acceder a tu perfil.
        </p>
        <button className="mt-8 px-8 py-3 bg-[var(--text-primary)] text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">
          Iniciar Sesión
        </button>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header / Banner */}
      <div className="relative h-56 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--brand-primary)] rounded-[3.5rem] shadow-2xl shadow-[var(--color-primary)]/20 overflow-hidden group">
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--brand-primary)] rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        </div>
        <div className="absolute bottom-8 right-12 text-white/40 text-8xl font-black select-none pointer-events-none opacity-20">
          PERFIL
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative -mt-32 px-6 sm:px-12">
        <div className="bg-white rounded-[3rem] border border-[var(--border-subtle)] shadow-2xl shadow-black/5 overflow-hidden p-8 sm:p-12">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
            {/* Avatar Section */}
            <div className="relative group shrink-0">
              <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-[var(--bg-section)] relative z-10">
                <Image
                  src={user?.image || "/imagenes/profile.jpg"}
                  alt="Avatar"
                  width={160}
                  height={160}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-[var(--brand-primary)] rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity -z-0" />
              <button className="absolute -bottom-2 -right-2 z-20 p-3.5 bg-white border border-[var(--border-subtle)] rounded-2xl text-[var(--brand-primary)] shadow-xl hover:scale-110 active:scale-95 transition-all group/btn">
                <FiCamera size={20} className="group-hover/btn:rotate-12 transition-transform" />
              </button>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-6">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <span className="px-3 py-1 bg-[var(--bg-section)] text-[var(--brand-primary)] rounded-lg text-[10px] font-black uppercase tracking-widest border border-[var(--border-subtle)]">
                      {user?.role || 'Personal'}
                    </span>
                    <span className="w-2 h-2 bg-[var(--semaforo-verde)] rounded-full animate-pulse" />
                  </div>
                  <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight leading-none">{user?.name || 'Usuario SAE'}</h1>
                  <p className="text-[var(--text-secondary)] font-medium mt-2">ID Institucional: {user?.id?.toString().slice(0, 8) || '2024-001'}</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-[var(--text-primary)] text-white rounded-[1.25rem] text-sm font-black hover:opacity-90 hover:translate-y-[-2px] active:translate-y-0 transition-all shadow-xl shadow-black/10 group">
                  <FiEdit2 className="group-hover:rotate-12 transition-transform" />
                  <span>Editar Perfil</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 pt-8 border-t border-[var(--bg-section)]">
                <div className="flex items-center gap-4 group">
                  <div className="p-3.5 bg-[var(--bg-section)] text-[var(--brand-primary)] rounded-2xl group-hover:scale-110 transition-transform"><FiMail size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Correo Institucional</p>
                    <p className="text-[var(--text-primary)] font-bold">{user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3.5 bg-[var(--bg-section)] text-[var(--semaforo-amarillo)] rounded-2xl group-hover:scale-110 transition-transform"><FiShield size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Estado de Cuenta</p>
                    <p className="text-[var(--text-primary)] font-bold">Activo / Verificado</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3.5 bg-[var(--bg-section)] text-[var(--text-secondary)] rounded-2xl group-hover:scale-110 transition-transform"><FiCalendar size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Último Acceso</p>
                    <p className="text-[var(--text-primary)] font-bold">Hoy, 10:45 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="p-3.5 bg-[var(--bg-section)] text-[var(--semaforo-verde)] rounded-2xl group-hover:scale-110 transition-transform"><FiLock size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Seguridad</p>
                    <p className="text-[var(--text-primary)] font-bold">2FA Habilitado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <div className="bg-white rounded-[2.5rem] border border-[var(--border-subtle)] shadow-sm p-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--bg-section)] rounded-2xl flex items-center justify-center text-[var(--brand-primary)]">
              <FiMessageSquare />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Notificaciones</h2>
          </div>

          <div className="space-y-6">
            {[
              { label: 'Alertas de riesgo crítico', sub: 'Recibir por correo y en panel', active: true },
              { label: 'Resumen semanal de desempeño', sub: 'Enviado los lunes 8:00 AM', active: false },
              { label: 'Mensajes directos', sub: 'Notificaciones instantáneas', active: true },
            ].map((opt, i) => (
              <div key={i} className="flex justify-between items-center group cursor-pointer">
                <div>
                  <p className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">{opt.label}</p>
                  <p className="text-xs text-[var(--text-muted)] font-medium">{opt.sub}</p>
                </div>
                <div className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ${opt.active ? 'bg-[var(--brand-primary)]' : 'bg-[var(--bg-section)] border border-[var(--border-subtle)]'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${opt.active ? 'translate-x-7' : 'translate-x-0'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-[var(--border-subtle)] shadow-sm p-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--bg-section)] rounded-2xl flex items-center justify-center text-[var(--semaforo-amarillo)]">
              <FiLock />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Seguridad</h2>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-5 bg-[var(--bg-section)] border border-transparent hover:border-[var(--border-subtle)] rounded-2xl transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[var(--brand-primary)] shadow-sm">
                  <FiLock />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-[var(--text-primary)]">Cambiar Contraseña</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">Último cambio hace 3 meses</p>
                </div>
              </div>
              <FiArrowRight size={18} className="text-[var(--text-muted)] group-hover:translate-x-1 transition-all" />
            </button>

            <button className="w-full flex items-center justify-between p-5 bg-[var(--bg-section)] border border-transparent hover:border-[var(--border-subtle)] rounded-2xl transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[var(--semaforo-verde)] shadow-sm">
                  <FiShield />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-[var(--text-primary)]">Dispositivos Vinculados</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase">2 sesiones activas</p>
                </div>
              </div>
              <FiArrowRight size={18} className="text-[var(--text-muted)] group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
