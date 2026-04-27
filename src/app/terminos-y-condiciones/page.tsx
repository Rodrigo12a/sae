/**
 * @module TermsAndConditionsPage
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @description Página de términos y condiciones del proyecto SAE.
 */

import React from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiShield, FiFileText, FiLock } from 'react-icons/fi';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-6">
          <Link 
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <FiArrowLeft />
            Volver al inicio de sesión
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Términos, Condiciones y Privacidad
            </h1>
            <p className="text-[var(--text-secondary)]">
              Última actualización: 27 de abril de 2026
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="space-y-10 bg-white p-10 rounded-[2.5rem] border border-[var(--border-subtle)] shadow-sm">
          
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-primary)]">
              <FiShield size={24} />
              <h2 className="text-xl font-bold">1. Protección de Datos</h2>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, 
              la Universidad Politécnica del Estado de Tlaxcala (UPET) asegura que el tratamiento de sus datos 
              personales y clínicos se realiza bajo los más estrictos estándares de seguridad y confidencialidad.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-secondary)]">
              <FiLock size={24} />
              <h2 className="text-xl font-bold">2. Privacidad Diferencial</h2>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Nuestra plataforma SAE utiliza un sistema de **Privacidad Diferencial** por rol. Esto significa que:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--text-secondary)]">
              <li>Los <strong>Tutores</strong> solo tienen acceso a etiquetas operativas y semáforos de riesgo.</li>
              <li>Los datos clínicos detallados son accesibles exclusivamente por el <strong>Personal Médico y Psicológico</strong>.</li>
              <li>Los <strong>Administradores</strong> pueden visualizar métricas agregadas pero no diagnósticos privados.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-[var(--color-primary)]">
              <FiFileText size={24} />
              <h2 className="text-xl font-bold">3. Uso de la Información</h2>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              La información recopilada a través de encuestas y expedientes tiene como único fin la 
              detección temprana del riesgo de abandono escolar y el acompañamiento académico del estudiante.
            </p>
          </section>

        </main>

        {/* Footer info */}
        <footer className="text-center pt-8 border-t border-[var(--border-subtle)]">
          <p className="text-sm text-[var(--text-muted)]">
            Para dudas adicionales, contacte a <span className="text-[var(--text-primary)] font-medium">privacidad@upet.edu.mx</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
