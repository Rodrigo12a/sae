/**
 * @module Sidebar
 * @description Barra lateral de navegación principal con control de acceso por rol.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { SidebarMenuItem } from './navigation/SidebarMenuItem';
import { FiLogOut, FiPieChart, FiTrendingUp, FiLayers, FiUsers, FiClipboard, FiDownload, FiShield, FiSettings, FiInbox, FiBook, FiCalendar, FiActivity } from 'react-icons/fi';

// Configuración de navegación por rol
const NAV_CONFIG = {
  administrador: [
    { section: 'Principal', items: [
      { path: '/admin/dashboard', icon: <FiPieChart />, title: 'Dashboard Ejecutivo', subTitle: 'Vista Global' },
      { path: '/admin/dashboard/carreras', icon: <FiTrendingUp />, title: 'KPIs por Carrera', subTitle: 'Rendimiento' },
      { path: '/admin/dashboard/drilldown', icon: <FiLayers />, title: 'Drill-down Grupos', subTitle: 'Anomalías' },
    ]},
    { section: 'Gestión', items: [
      { path: '/admin/dashboard/tutores', icon: <FiUsers />, title: 'Gestión Docente', subTitle: 'Desempeño', badge: 2 },
      { path: '/admin/dashboard/estudiantes', icon: <FiUsers />, title: 'Gestión Estudiantes', subTitle: 'Base de datos' },
      { path: '/admin/dashboard/catalogo', icon: <FiClipboard />, title: 'Catálogo Alertas', subTitle: 'Configuración' },
      { path: '/admin/dashboard/reportes', icon: <FiDownload />, title: 'Exportar Datos', subTitle: 'PDF / Excel' },
    ]},
    { section: 'Control', items: [
      { path: '/admin/dashboard/auditoria', icon: <FiShield />, title: 'Auditoría', subTitle: 'Logs de sistema' },
      { path: '/admin/dashboard/configuracion', icon: <FiSettings />, title: 'Configuración', subTitle: 'Roles y Sistema' },
    ]}
  ],
  tutor: [
    { section: 'Seguimiento', items: [
      { path: '/tutor/dashboard', icon: <FiPieChart />, title: 'Dashboard', subTitle: 'Alertas activas' },
      { path: '/tutor/tutorados', icon: <FiUsers />, title: 'Mis Tutorados', subTitle: 'Cuentas y accesos' },
    ]},
    { section: 'Gestión', items: [
      { path: '/tutor/alertas', icon: <FiLayers />, title: 'Historial de Alertas', subTitle: 'Bitácora' },
    ]},
  ],
  psicologo: [
    { section: 'Atención', items: [
      { path: '/psicologo/bandeja', icon: <FiInbox />, title: 'Bandeja de Entrada', subTitle: 'Casos derivados' },
      { path: '/psicologo/bitacoras', icon: <FiBook />, title: 'Mis Bitácoras', subTitle: 'Notas clínicas' },
    ]},
    { section: 'Seguimiento', items: [
      { path: '/psicologo/estudiantes', icon: <FiUsers />, title: 'Estudiantes', subTitle: 'Historial de apoyo' },
    ]},
  ],
  medico: [
    { section: 'Clínica', items: [
      { path: '/medico/jornada', icon: <FiCalendar />, title: 'Mi Jornada', subTitle: 'Checklist diario' },
      { path: '/medico/estudiantes', icon: <FiUsers />, title: 'Estudiantes', subTitle: 'Expedientes médicos' },
    ]},
    { section: 'Reportes', items: [
      { path: '/medico/historial', icon: <FiActivity />, title: 'Cargas Masivas', subTitle: 'Registros previos' },
    ]},
  ],
};

export const Sidebar: React.FC = () => {
  const { data: session } = useSession();
  const rawRole = session?.user?.role as string;
  const role = (rawRole?.toLowerCase() || 'tutor') as keyof typeof NAV_CONFIG;
  const sections = NAV_CONFIG[role] || NAV_CONFIG.tutor;

  return (
    <aside className="w-[280px] h-screen bg-[#111827] text-white flex flex-col border-r border-white/5 z-40 relative group">
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
          <p className="text-lg font-black tracking-widest text-[var(--color-accent)] leading-none">SAE</p>
          <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Guardián Institucional</p>
        </div>
      </div>

      {/* 2. Navegación Scrollable */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 scrollbar-thin scrollbar-thumb-white/10">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-10 last:mb-0">
            <h3 className="px-4 mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
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

      {/* 3. Footer / Logout */}
      <div className="p-6 border-t border-white/5 bg-black/20">
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all font-bold text-sm tracking-wide group"
        >
          <FiLogOut className="transition-transform group-hover:-translate-x-1" />
          Cerrar Sesión
        </button>
      </div>

      {/* Efecto decorativo */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </aside>
  );
};
