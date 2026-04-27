/**
 * @page ConfiguracionPage
 * @epic EPICA-6 Panel Ejecutivo
 * @hu HU002 — Control de permisos y configuración del sistema
 * @privacy Solo accesible para administradores
 */
'use client';

import React, { useState } from 'react';
import { FiSettings, FiUsers, FiShield, FiLock, FiInfo } from 'react-icons/fi';
import { UserManagementContainer } from '@/src/features/dashboard-admin/components/UserManagement/UserManagementContainer';

type Tab = 'usuarios' | 'roles' | 'ajustes';

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<Tab>('usuarios');

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-2 text-[var(--color-secondary)] font-bold text-sm uppercase tracking-wider mb-1">
          <FiSettings />
          <span>Configuración institucional</span>
        </div>
        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Panel de Control</h1>
        <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
          Administración de usuarios, definición de roles y auditoría de permisos del sistema SAE.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-section)] rounded-2xl w-fit border border-[var(--border-subtle)]">
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'usuarios'
              ? 'bg-white text-[var(--color-primary)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FiUsers size={16} />
          Usuarios y Estudiantes
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'roles'
              ? 'bg-white text-[var(--color-primary)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FiShield size={16} />
          Roles y Permisos
        </button>
        <button
          onClick={() => setActiveTab('ajustes')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'ajustes'
              ? 'bg-white text-[var(--color-primary)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FiLock size={16} />
          Seguridad
        </button>
      </div>

      {/* Content */}
      <div className="mt-2">
        {activeTab === 'usuarios' && <UserManagementContainer />}
        
        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            <RoleCard 
              role="Administrador" 
              color="purple" 
              description="Acceso total al sistema, KPIs ejecutivos, auditoría de desempeño y gestión de toda la base de usuarios."
              permissions={['Dashboard Ejecutivo', 'Exportación Masiva', 'Configuración CRUD', 'Auditoría de Tutores']}
            />
            <RoleCard 
              role="Tutor Académico" 
              color="blue" 
              description="Monitoreo de estudiantes asignados, registro de bitácoras y derivación de casos. Sin acceso a datos clínicos."
              permissions={['Widget de Alertas', 'Bitácora Ágil', 'Perfil de Riesgo (No clínico)', 'Derivaciones']}
            />
            <RoleCard 
              role="Médico" 
              color="emerald" 
              description="Gestión de expedientes clínicos y carga masiva de jornadas de salud. Único con acceso a diagnósticos médicos."
              permissions={['Carga Masiva Salud', 'Semáforo Clínico', 'Expediente Médico', 'Alertas Proclives']}
            />
            <RoleCard 
              role="Psicólogo" 
              color="indigo" 
              description="Atención especializada de casos derivados. Notas confidenciales y recomendaciones operativas para tutores."
              permissions={['Bandeja de Derivados', 'Notas Confidenciales', 'Expediente Sensible', 'Tamizaje']}
            />
            <RoleCard 
              role="Estudiante" 
              color="amber" 
              description="Actor principal del sistema. Responsable de completar encuestas de contexto y recibir recursos de apoyo."
              permissions={['Responder Encuestas', 'Confirmación PWA', 'Acceso a Recursos', 'Auto-reporte']}
            />
            
            {/* Info Banner */}
            <div className="lg:col-span-3 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <FiInfo size={24} />
              </div>
              <div>
                <h4 className="text-blue-900 font-bold mb-1">Sobre la Privacidad Diferencial (QA-01)</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Los permisos están configurados a nivel de backend. Aunque un usuario intente acceder a una ruta no autorizada, 
                  el sistema RBAC denegará la petición y el DOM no renderizará campos sensibles (ej. diagnósticos) para roles no clínicos.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ajustes' && (
          <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[var(--bg-section)] rounded-2xl flex items-center justify-center mb-4">
              <FiLock size={28} className="text-[var(--text-muted)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Parámetros de Seguridad</h3>
            <p className="text-[var(--text-secondary)] text-sm max-w-md">
              Configuración de expiración de sesiones, políticas de contraseñas y registros de auditoría global.
            </p>
            <span className="mt-6 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-tighter">
              Versión 1.1 — Próximamente
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleCard({ role, color, description, permissions }: { role: string; color: string; description: string; permissions: string[] }) {
  const colors: any = {
    purple: 'border-purple-200 bg-purple-50/30 text-purple-700',
    blue: 'border-blue-200 bg-blue-50/30 text-blue-700',
    emerald: 'border-emerald-200 bg-emerald-50/30 text-emerald-700',
    indigo: 'border-indigo-200 bg-indigo-50/30 text-indigo-700',
    amber: 'border-amber-200 bg-amber-50/30 text-amber-700',
  };

  return (
    <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className={`w-fit px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${colors[color]}`}>
        {role}
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
        {description}
      </p>
      <div className="space-y-2 pt-4 border-t border-[var(--border-subtle)]">
        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Permisos Clave</span>
        <div className="flex flex-wrap gap-1.5">
          {permissions.map(p => (
            <span key={p} className="px-2 py-0.5 bg-[var(--bg-section)] text-[var(--text-primary)] text-[10px] font-bold rounded border border-[var(--border-subtle)]">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
