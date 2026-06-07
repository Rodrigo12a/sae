/**
 * @page ConfiguracionPage
 * @epic EPICA-6 Panel Ejecutivo
 * @hu HU002 — Control de permisos y configuración del sistema
 * @privacy Solo accesible para administradores
 */
'use client';

import React from 'react';
import { FiSettings, FiUsers } from 'react-icons/fi';
import { UserManagementContainer } from '@/src/features/dashboard-admin/components/UserManagement/UserManagementContainer';

export default function ConfiguracionPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold text-sm uppercase tracking-wider mb-1">
          <FiSettings />
          <span>Configuración institucional</span>
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Gestión de Usuarios</h1>
        <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
          Administración de usuarios del sistema SAE.
        </p>
      </div>

      {/* Content */}
      <div className="mt-2">
        <UserManagementContainer />
      </div>
    </div>
  );
}
