import React from 'react';
import { Sidebar } from '@/src/components/layout/Sidebar/Sidebar';
import { Navbar } from '@/src/components/layout/Navbar/Navbar';
import { RoleGuard } from '@/src/components/ui/RoleGuard';

export default function PsicologoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[var(--bg-main)] overflow-hidden">
      
      {/* Sidebar de navegación del Psicólogo */}
      <Sidebar />

      {/* Área Principal de Contenido */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Navbar con menú de usuario */}
        <Navbar />

        {/* Zona de Renderizado de Páginas Protegida */}
        <RoleGuard resource="referral.accept" action="write">
          <main
            id="main-content"
            className="flex-1 overflow-y-auto p-8 animate-fade-in"
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
