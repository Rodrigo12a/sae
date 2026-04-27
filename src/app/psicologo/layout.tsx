import React from 'react';
import { Sidebar } from '@/src/components/layout/Sidebar/Sidebar';
import { RoleGuard } from '@/src/components/ui/RoleGuard';

export default function PsicologoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard resource="referral.accept" action="write">
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar de navegación del Psicólogo */}
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
