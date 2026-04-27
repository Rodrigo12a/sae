/**
 * @page EstudiantesManagementPage
 * @epic EPICA-6 Panel Ejecutivo
 * @hu HU007, HU023 — Gestión de alumnos
 * @privacy Solo accesible para administradores
 */
'use client';

import React from 'react';
import { FiUsers, FiUserPlus } from 'react-icons/fi';
import { UserManagementContainer } from '@/src/features/dashboard-admin/components/UserManagement/UserManagementContainer';

export default function EstudiantesPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold text-sm uppercase tracking-wider mb-1">
          <FiUsers />
          <span>Gestión de alumnado</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Estudiantes</h1>
            <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
              Registro, edición y monitoreo de la base de datos de alumnos.
            </p>
          </div>
        </div>
      </div>

      <UserManagementContainer />
    </div>
  );
}