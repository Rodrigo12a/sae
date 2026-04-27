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
import { RoleGuard } from '@/src/components/ui/RoleGuard';

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard resource="alert.view" action="read">
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar de navegación del Tutor */}
        <Sidebar />

        {/* Contenido principal */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          aria-label="Contenido principal"
        >
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
