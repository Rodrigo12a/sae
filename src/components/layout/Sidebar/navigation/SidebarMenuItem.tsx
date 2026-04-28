/**
 * @module SidebarMenuItem
 * @description Elemento individual de navegación del sidebar.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarMenuItemProps {
  path: string;
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  badge?: number;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ path, icon, title, subTitle, badge }) => {
  const currentPath = usePathname();
  const isActive = currentPath === path;

  return (
    <Link
      href={path}
      className={`
        group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative
        ${isActive 
          ? 'bg-[var(--sidebar-active-bg)] text-[var(--sidebar-text-active)] shadow-lg shadow-black/20' 
          : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--sidebar-text-active)]'
        }
      `}
    >
      <div className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'text-[var(--sidebar-text-active)]' : 'text-[var(--sidebar-text)] opacity-80'}`}>
        {icon}
      </div>
      
      <div className="flex flex-col flex-1 truncate">
        <span className="text-[13px] font-bold tracking-wide">{title}</span>
        <span className={`text-[10px] font-medium opacity-60 uppercase tracking-tighter ${isActive ? 'text-white/80' : 'text-[var(--sidebar-text)]'}`}>
          {subTitle}
        </span>
      </div>

      {badge && (
        <span className={`
          absolute right-4 px-1.5 py-0.5 rounded-md text-[10px] font-black
          ${isActive ? 'bg-white text-[var(--color-secondary)]' : 'bg-[var(--color-primary)] text-white'}
        `}>
          {badge}
        </span>
      )}

      {isActive && (
        <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" />
      )}
    </Link>
  );
};
