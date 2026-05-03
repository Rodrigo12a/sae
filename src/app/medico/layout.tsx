'use client';

import React from 'react';
import { RoleGuard } from "@/src/components/ui/RoleGuard";
import { Navbar } from "@/src/components/layout/Navbar/Navbar";
import { Sidebar } from '@/src/components/layout/Sidebar/Sidebar';

export default function MedicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard resource="student.health.clinical" action="write">
      <div className="flex h-screen w-full bg-[var(--bg-main)] overflow-hidden">
        
        {/* Sidebar con navegación por rol */}
        <Sidebar />

        {/* Área Principal de Contenido */}
        <div className="flex flex-col flex-1 min-w-0">
          
          {/* Navbar con menú de usuario */}
          <Navbar />

          {/* Zona de Renderizado de Páginas */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 animate-fade-in">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>

        </div>
      </div>
    </RoleGuard>
  );
}
