/**
 * @module TutorLayout
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU003, HU004, HU005, HU006, HU007
 * @ux UXDT-01 (layout base del Tutor)
 * @qa QA-01 (RBAC: solo rol tutor accede a este layout)
 * @privacy Solo el rol tutor puede montar este layout — doble capa: middleware + RoleGuard
 */

import React from 'react';
import { Sidebar } from '@/src/components/layout/Sidebar/Sidebar';
import { Navbar } from '@/src/components/layout/Navbar/Navbar';
import { RoleGuard } from '@/src/components/ui/RoleGuard';

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[var(--bg-main)] overflow-hidden">
      
      {/* Sidebar de navegación del Tutor */}
      <Sidebar />

      {/* Área Principal de Contenido */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Navbar con menú de usuario */}
        <Navbar />

        {/* Zona de Renderizado de Páginas Protegida */}
        <RoleGuard resource="alert.view" action="read">
          <main
            id="main-content"
            className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in"
            aria-label="Contenido principal"
          >
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </RoleGuard>
      </div>
    </div>
  );
}
