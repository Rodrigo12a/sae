'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useUIStore } from '@/src/store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiPieChart, FiTrendingUp, FiLayers, FiUsers, FiClipboard, FiDownload, FiShield, FiSettings, FiInbox, FiBook, FiCalendar, FiActivity, FiUser, FiMenu, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { SidebarMenuItem } from './navigation/SidebarMenuItem';
import { ROLE_ALIAS_MAP } from '@/src/lib/rbac.config';

// Configuración de navegación por rol (keeps the same)
const NAV_CONFIG = {
  administrador: [
    {
      section: 'Principal', items: [
        { path: '/admin/dashboard', icon: <FiPieChart />, title: 'Dashboard Ejecutivo', subTitle: 'Vista Global' },
        { path: '/admin/dashboard/carreras', icon: <FiTrendingUp />, title: 'KPIs por Carrera', subTitle: 'Rendimiento' },
        { path: '/admin/dashboard/drilldown', icon: <FiLayers />, title: 'Detalle de Grupos', subTitle: 'Anomalías' },
        { path: '/admin/evaluaciones', icon: <FiClipboard />, title: 'Monitoreo Cuestionarios', subTitle: 'Evaluaciones SAE' },
      ]
    },
    {
      section: 'Gestión', items: [
        { path: '/admin/dashboard/tutores', icon: <FiUsers />, title: 'Gestión Docente', subTitle: 'Desempeño', badge: 2 },
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

const ROLE_PATH_MAP: Record<string, string> = {
  administrador: 'admin',
  tutor: 'tutor',
  psicologo: 'psicologo',
  medico: 'medico',
  estudiante: 'estudiante'
};

export const Sidebar: React.FC = () => {
  const { data: session } = useSession();
  const { 
    isSidebarCollapsed, 
    isSidebarOpen, 
    toggleSidebarCollapse, 
    closeSidebarMobile 
  } = useUIStore();

  const rawRole = session?.user?.role as string | undefined;
  const role = (rawRole ? ROLE_ALIAS_MAP[rawRole.toLowerCase()] : 'tutor') as keyof typeof NAV_CONFIG;
  const sections = NAV_CONFIG[role] || NAV_CONFIG.tutor;
  const pathPrefix = ROLE_PATH_MAP[role] || 'tutor';

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const renderSidebarContent = (isCollapsed: boolean) => (
    <div className="h-full flex flex-col bg-[var(--sidebar-bg)] text-white border-r border-white/5 relative">
      <div className="flex flex-col h-full overflow-hidden">
        {/* 1. Header con Logo */}
        <div className={`px-4 py-8 flex flex-col items-center border-b border-white/5 transition-all duration-300 ${isCollapsed ? 'py-6' : 'py-10'}`}>
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div 
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-2xl font-black tracking-widest text-[var(--sidebar-accent)] leading-none">SAE</p>
                <p className="text-[9px] font-bold text-[var(--sidebar-text)] mt-2 uppercase tracking-tight">Sistema de Acompañamiento Estudiantil</p>
              </motion.div>
            ) : (
              <motion.div
                key="short-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--sidebar-accent)] to-indigo-600 flex items-center justify-center shadow-lg shadow-[var(--sidebar-accent)]/20"
              >
                <span className="font-black text-xl italic">S</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Navegación Scrollable */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 no-scrollbar space-y-8">
          {sections.map((section, idx) => (
            <div key={idx}>
              {!isCollapsed && (
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sidebar-text)] opacity-50"
                >
                  {section.section}
                </motion.h3>
              )}
              <div className="space-y-1">
                {section.items.map((item, idy) => (
                  <SidebarMenuItem key={idy} {...item} isCollapsed={isCollapsed} />
                ))}
              </div>
              {isCollapsed && idx < sections.length - 1 && (
                <div className="mx-auto w-8 h-px bg-white/5 my-4" />
              )}
            </div>
          ))}
        </nav>

        {/* 3. Footer / User & Logout */}
        <div className={`p-4 border-t border-white/5 bg-black/20 space-y-3 transition-all duration-300`}>
          <Link
            href={`/${pathPrefix}/profile`}
            className={`flex items-center gap-3 p-2.5 rounded-xl bg-[var(--sidebar-hover-bg)] hover:bg-white/10 transition-all group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10 bg-slate-800 flex-shrink-0">
              <Image
                src={session?.user?.image || "/imagenes/profile.jpg"}
                alt="Avatar"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <p className="text-[13px] font-bold text-[var(--sidebar-text-active)] truncate">{session?.user?.name || 'Usuario SAE'}</p>
                <p className="text-[9px] font-medium text-[var(--sidebar-text)] uppercase tracking-wider">{role}</p>
              </motion.div>
            )}
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className={`w-full flex items-center gap-3 py-2.5 rounded-xl bg-transparent hover:bg-red-500/10 text-[var(--sidebar-text)] hover:text-red-500 transition-all font-bold text-[13px] group ${isCollapsed ? 'justify-center' : 'px-3'}`}
            aria-label="Cerrar Sesión"
          >
            <FiLogOut className={`text-lg transition-transform group-hover:-translate-x-1 flex-shrink-0`} />
            {!isCollapsed && <span className="whitespace-nowrap">Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Botón de Toggle (Solo Desktop) */}
      <button
        onClick={toggleSidebarCollapse}
        className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 bg-[var(--sidebar-accent)] text-white rounded-full items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-110 transition-all z-[100] border-4 border-[var(--bg-main)] group"
        aria-label={isCollapsed ? "Expandir Sidebar" : "Colapsar Sidebar"}
      >
        {isCollapsed ? (
          <FiChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        ) : (
          <FiChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Sidebar Escritorio */}
      <motion.aside
        initial={false}
        animate={isSidebarCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        className="hidden lg:block h-screen z-40 sticky top-0"
      >
        {renderSidebarContent(isSidebarCollapsed)}
      </motion.aside>

      {/* Sidebar Móvil (Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop con Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebarMobile}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-[60] lg:hidden shadow-2xl"
            >
              <button 
                onClick={closeSidebarMobile}
                className="absolute top-4 -right-12 text-white p-2 hover:bg-white/10 rounded-full"
              >
                <FiX size={24} />
              </button>
              {renderSidebarContent(false)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
