/**
 * @module Sidebar
 * @description Barra lateral de navegación principal con control de acceso por rol.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { SidebarMenuItem } from './navigation/SidebarMenuItem';
import { FiLogOut, FiPieChart, FiTrendingUp, FiLayers, FiUsers, FiClipboard, FiDownload, FiShield, FiSettings, FiInbox, FiBook, FiCalendar, FiActivity, FiUser } from 'react-icons/fi';
import { ROLE_ALIAS_MAP } from '@/src/lib/rbac.config';

// Configuración de navegación por rol
const NAV_CONFIG = {
  administrador: [
    {
      section: 'Principal', items: [
        { path: '/admin/dashboard', icon: <FiPieChart />, title: 'Dashboard Ejecutivo', subTitle: 'Vista Global' },
        { path: '/admin/dashboard/carreras', icon: <FiTrendingUp />, title: 'KPIs por Carrera', subTitle: 'Rendimiento' },
        { path: '/admin/dashboard/drilldown', icon: <FiLayers />, title: 'Drill-down Grupos', subTitle: 'Anomalías' },
      ]
    },
    {
      section: 'Gestión', items: [
        { path: '/admin/dashboard/tutores', icon: <FiUsers />, title: 'Gestión Docente', subTitle: 'Desempeño', badge: 2 },
        { path: '/admin/dashboard/estudiantes', icon: <FiUsers />, title: 'Gestión Estudiantes', subTitle: 'Base de datos' },
        { path: '/admin/dashboard/catalogo', icon: <FiClipboard />, title: 'Catálogo Alertas', subTitle: 'Configuración' },
        { path: '/admin/dashboard/configuracion', icon: <FiSettings />, title: 'Configuración', subTitle: 'Control de Usuarios' },
        { path: '/admin/dashboard/reportes', icon: <FiDownload />, title: 'Exportar Datos', subTitle: 'PDF / Excel' },
      ]
    },
    {
      section: 'Usuario', items: [
        { path: '/admin/profile', icon: <FiUser />, title: 'Mi Perfil', subTitle: 'Configuración de cuenta' },
        { path: '/admin/dashboard/auditoria', icon: <FiShield />, title: 'Auditoría', subTitle: 'Logs de sistema' },
      ]
    }
  ],
  tutor: [
    {
      section: 'Seguimiento', items: [
        { path: '/tutor/dashboard', icon: <FiPieChart />, title: 'Dashboard', subTitle: 'Alertas activas' },
        { path: '/tutor/tutorados', icon: <FiUsers />, title: 'Mis Tutorados', subTitle: 'Cuentas y accesos' },
      ]
    },
    {
      section: 'Gestión', items: [
        { path: '/tutor/alertas', icon: <FiLayers />, title: 'Historial de Alertas', subTitle: 'Bitácora' },
      ]
    },
    {
      section: 'Usuario', items: [
        { path: '/tutor/profile', icon: <FiUser />, title: 'Mi Perfil', subTitle: 'Configuración de cuenta' },
      ]
    },
  ],
  psicologo: [
    {
      section: 'Atención', items: [
        { path: '/psicologo/bandeja', icon: <FiInbox />, title: 'Bandeja de Entrada', subTitle: 'Casos derivados' },
        { path: '/psicologo/bitacoras', icon: <FiBook />, title: 'Mis Bitácoras', subTitle: 'Notas clínicas' },
      ]
    },
    {
      section: 'Seguimiento', items: [
        { path: '/psicologo/estudiantes', icon: <FiUsers />, title: 'Estudiantes', subTitle: 'Historial de apoyo' },
      ]
    },
    {
      section: 'Usuario', items: [
        { path: '/psicologo/profile', icon: <FiUser />, title: 'Mi Perfil', subTitle: 'Configuración de cuenta' },
      ]
    },
  ],
  medico: [
    {
      section: 'Clínica', items: [
        { path: '/medico/dashboard', icon: <FiPieChart />, title: 'Dashboard', subTitle: 'Resumen y Casos' },
        { path: '/medico/jornada', icon: <FiCalendar />, title: 'Mi Jornada', subTitle: 'Checklist diario' },
        { path: '/medico/estudiantes', icon: <FiUsers />, title: 'Estudiantes', subTitle: 'Expedientes médicos' },
      ]
    },
    {
      section: 'Reportes', items: [
        { path: '/medico/historial', icon: <FiActivity />, title: 'Cargas Masivas', subTitle: 'Registros previos' },
      ]
    },
    {
      section: 'Usuario', items: [
        { path: '/medico/profile', icon: <FiUser />, title: 'Mi Perfil', subTitle: 'Configuración de cuenta' },
      ]
    },
  ],
};

/** Mapa de roles a prefijos de ruta (carpetas en app/) */
const ROLE_PATH_MAP: Record<string, string> = {
  administrador: 'admin',
  tutor: 'tutor',
  psicologo: 'psicologo',
  medico: 'medico',
  estudiante: 'estudiante'
};

export const Sidebar: React.FC = () => {
  const { data: session } = useSession();

  const rawRole = session?.user?.role as string | undefined;
  const role = (rawRole ? ROLE_ALIAS_MAP[rawRole.toLowerCase()] : 'tutor') as keyof typeof NAV_CONFIG;
  const sections = NAV_CONFIG[role] || NAV_CONFIG.tutor;
  const pathPrefix = ROLE_PATH_MAP[role] || 'tutor';

  return (
    <aside className="w-[280px] h-screen bg-[var(--sidebar-bg)] text-white flex flex-col border-r border-white/5 z-40 relative group">
      {/* 1. Header con Logo */}
      <div className="px-8 py-10 flex flex-col items-center border-b border-white/5">
        <Image
          src="/iconos/isotipo-blanco.png"
          alt="SAE Logo"
          width={60}
          height={60}
          className="mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        />
        <div className="text-center">
          <p className="text-lg font-black tracking-widest text-[var(--sidebar-accent)] leading-none">SAE</p>
          <p className="text-[10px] font-bold text-[var(--sidebar-text)] mt-1 uppercase tracking-tighter">Guardián Institucional</p>
        </div>
      </div>

      {/* 2. Navegación Scrollable */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 no-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-10 last:mb-0">
            <h3 className="px-4 mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--sidebar-text)]">
              {section.section}
            </h3>
            <div className="space-y-1.5">
              {section.items.map((item, idy) => (
                <SidebarMenuItem key={idy} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Footer / User & Logout */}
      <div className="p-6 border-t border-white/5 bg-black/20 space-y-4">
        <Link
          href={`/${pathPrefix}/profile`}
          className="flex items-center gap-3 p-3 rounded-xl bg-[var(--sidebar-hover-bg)] hover:bg-white/10 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-slate-800 flex-shrink-0">
            <Image
              src={session?.user?.image || "/imagenes/profile.jpg"}
              alt="Avatar"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[var(--sidebar-text-active)] truncate">{session?.user?.name || 'Usuario SAE'}</p>
            <p className="text-[10px] font-medium text-[var(--sidebar-text)] uppercase tracking-wider">{role}</p>
          </div>
          <FiSettings className="text-[var(--sidebar-text)] group-hover:text-white transition-colors" />
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-[var(--sidebar-hover-bg)] hover:bg-red-500/10 text-[var(--sidebar-text)] hover:text-red-500 transition-all font-bold text-sm tracking-wide group"
        >
          <FiLogOut className="transition-transform group-hover:-translate-x-1" />
          Cerrar Sesión
        </button>
      </div>

      {/* Efecto decorativo eliminado a petición del usuario */}
    </aside>
  );
};
