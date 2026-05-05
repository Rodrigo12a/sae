/**
 * @module SidebarMenuItem
 * @description Elemento individual de navegación del sidebar.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useUIStore } from '@/src/store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarMenuItemProps {
  path: string;
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  badge?: number;
  /** Permite forzar el estado colapsado desde el padre (ej: en móvil siempre expandido) */
  isCollapsed?: boolean;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ 
  path, 
  icon, 
  title, 
  subTitle, 
  badge,
  isCollapsed: customIsCollapsed 
}) => {
  const currentPath = usePathname();
  const isActive = currentPath === path;
  const { isSidebarCollapsed: globalIsCollapsed } = useUIStore();
  
  // Usar prop si existe, si no, el estado global
  const isCollapsed = customIsCollapsed !== undefined ? customIsCollapsed : globalIsCollapsed;

  return (
    <Link
      href={path}
      className={`
        group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative
        ${isActive 
          ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-text-active)] shadow-lg shadow-black/20' 
          : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-text-active)]'
        }
        ${isCollapsed ? 'justify-center px-0' : 'px-4'}
      `}
      title={isCollapsed ? title : ''}
    >
      <div className={`text-xl transition-transform group-hover:scale-110 flex-shrink-0 ${isActive ? 'text-[var(--sidebar-text-active)]' : 'text-[var(--sidebar-text)] opacity-80'}`}>
        {icon}
      </div>
      
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 truncate"
          >
            <span className="text-[13px] font-bold tracking-wide whitespace-nowrap">{title}</span>
            <span className={`text-[10px] font-medium opacity-60 uppercase tracking-tighter whitespace-nowrap ${isActive ? 'text-white/80' : 'text-[var(--sidebar-text)]'}`}>
              {subTitle}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {badge && !isCollapsed && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={`
              absolute right-4 px-1.5 py-0.5 rounded-md text-[10px] font-black
              ${isActive ? 'bg-white text-[var(--color-secondary)]' : 'bg-[var(--color-primary)] text-white'}
            `}
          >
            {badge}
          </motion.span>
        )}
      </AnimatePresence>

      {isActive && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" 
        />
      )}
    </Link>
  );
};
