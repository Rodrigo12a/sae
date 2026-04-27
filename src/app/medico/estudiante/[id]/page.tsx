/**
 * @page DetalleSaludEstudiantePage
 * @epic Épica 4 — Módulo Médico con Privacidad Diferencial
 * @hu HU010
 * @description Vista detallada del perfil médico de un estudiante.
 */

import { StudentHealthDetail } from "@/src/features/medico/components/StudentHealthDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil Médico | SAE",
  description: "Detalle clínico confidencial del estudiante.",
};

export default async function StudentHealthPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Expediente Médico Estudiantil
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Información protegida por privacidad diferencial.
        </p>
      </header>

      <StudentHealthDetail studentId={id} />
      
      <div className="mt-8 p-4 border border-amber-200 bg-amber-50 rounded-xl flex gap-3 items-start">
        <span className="text-xl">⚠️</span>
        <div>
          <h4 className="text-sm font-bold text-amber-800">Recordatorio de Confidencialidad</h4>
          <p className="text-xs text-amber-700 leading-relaxed mt-1">
            Cualquier cambio realizado en este perfil impactará el semáforo de riesgo del estudiante 
            visible para su tutor institucional. El diagnóstico clínico permanecerá oculto.
          </p>
        </div>
      </div>
    </div>
  );
}
