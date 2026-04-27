/**
 * @layout StudentLayout
 * @description Layout base para el módulo de estudiantes, optimizado para legibilidad y enfoque.
 */
import React from 'react';

export const metadata = {
  title: 'Cuestionario de Acompañamiento · SAE',
  description: 'Sistema de Alerta de Deserción Escolar - Universidad Politécnica de Tlaxcala',
};

export default function StudentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-indigo-100/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}