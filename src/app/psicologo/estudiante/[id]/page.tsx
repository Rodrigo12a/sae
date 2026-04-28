import { StudentExpediente } from "@/src/features/student-expediente/components/StudentExpediente";
import { Metadata } from "next";
import Link from "next/link";
import { FiArrowLeft, FiShield } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Expediente Psicológico | SAE",
  description: "Detalle clínico y académico confidencial del estudiante.",
};

export default async function PsicologoEstudianteDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8 animate-fade-in">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <Link 
            href="/psicologo/estudiantes"
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-purple-600 transition-colors mb-4"
          >
            <FiArrowLeft /> Volver al Directorio
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Expediente de Intervención
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestión de bitácoras confidenciales y apoyo especializado.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 shadow-sm">
          <FiShield className="shrink-0" />
          <span className="text-xs font-black uppercase tracking-tighter">Conexión Cifrada</span>
        </div>
      </header>

      <StudentExpediente studentId={id} />
    </div>
  );
}
