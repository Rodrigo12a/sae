import { StudentExpediente } from "@/src/features/student-expediente/components/StudentExpediente";
import { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Expediente Estudiantil | SAE",
  description: "Detalle clínico y académico confidencial del estudiante.",
};

export default async function StudentHealthPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const derivationMock = {
    id: 'REF-123',
    studentName: 'Juan Pérez García',
    tutorName: 'Dr. Rodrigo Osorio',
    fecha: '2026-04-25',
    motivo: 'El estudiante presenta fatiga crónica y dolores de cabeza recurrentes que afectan su desempeño académico.',
    observacionesTutor: 'Se recomienda revisión general y análisis de sangre. El alumno menciona que no duerme bien.',
    prioridad: 'alta' as const
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8 animate-fade-in">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <Link 
            href="/medico/estudiantes"
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-4"
          >
            <FiArrowLeft /> Volver al Directorio
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Expediente Estudiantil
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestión de salud y seguimiento clínico institucional.
          </p>
        </div>
      </header>

      <StudentExpediente studentId={id} derivation={derivationMock} />
      
      <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white flex gap-6 items-center shadow-2xl">
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-xl">⚖️</span>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Aviso de Privacidad</h4>
          <p className="text-xs text-slate-300 leading-relaxed mt-1 font-medium">
            Toda la información consultada en este expediente está protegida por la Ley de Protección de Datos Personales. 
            El mal uso de esta información será sancionado conforme a la normativa institucional vigente.
          </p>
        </div>
      </div>
    </div>
  );
}
