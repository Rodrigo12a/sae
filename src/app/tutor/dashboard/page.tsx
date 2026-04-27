/**
 * @module TutorDashboardPage
 * @epic EPICA-2 Dashboard y Gestión de Alertas (Tutor)
 * @hu HU003
 * @ux UXDT-01, UXDT-02, UXDT-03, UXDT-04, UXDT-05
 * @qa QA-05 (p95 < 1.5s · datos pre-computados)
 * @api GET /alerts/priority
 * @privacy Rol tutor — sin datos clínicos ni scores del Motor de IA
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PriorityAlertWidget } from '@/src/features/dashboard-tutor/components/PriorityAlertWidget';
import { useSession } from 'next-auth/react';

export default function TutorDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const tutorName = session?.user?.name?.split(' ')[0] ?? 'Tutor';

  const handleViewStudent = (studentId: string) => {
    router.push(`/tutor/estudiante/${studentId}`);
  };

  // Obtener hora para el saludo contextual
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la página */}
      <header className="bg-white border-b border-gray-100 px-6 py-5 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {tutorName} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Aquí están tus estudiantes que requieren atención hoy.
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal: Widget de alertas prioritarias */}
          <div className="lg:col-span-2">
            <PriorityAlertWidget onViewStudent={handleViewStudent} />
          </div>

          {/* Columna lateral: Resumen rápido */}
          <aside aria-label="Resumen de actividad">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                Resumen de hoy
              </h2>
              <div className="flex flex-col gap-4">
                <SummaryItem
                  icon="📋"
                  label="Sesiones programadas"
                  value="—"
                  sublabel="Sin calendario conectado"
                />
                <SummaryItem
                  icon="✅"
                  label="Alertas atendidas"
                  value="—"
                  sublabel="Este mes"
                />
                <SummaryItem
                  icon="👥"
                  label="Total tutorados"
                  value="—"
                  sublabel="Bajo tu seguimiento"
                />
              </div>

              <div className="mt-5 pt-4 border-t border-gray-50">
                <a
                  href="/tutor/tutorados"
                  className="
                    flex items-center justify-center gap-2 w-full px-4 py-2.5
                    bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium
                    rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                    min-h-[44px]
                  "
                >
                  <span aria-hidden="true">👥</span>
                  Gestionar tutorados
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente de resumen
// ─────────────────────────────────────────────────────────────────────────────

function SummaryItem({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: string;
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xl shrink-0" aria-hidden="true">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-800 leading-tight">{value}</p>
        <p className="text-[11px] text-gray-400">{sublabel}</p>
      </div>
    </div>
  );
}
