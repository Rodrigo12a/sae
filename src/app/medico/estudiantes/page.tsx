/**
 * @module MedicoEstudiantesPage
 * @epic EPICA-4 Módulo Médico con Privacidad Diferencial
 * @hu HU010
 * @description Directorio de estudiantes para consulta de expedientes médicos.
 */

import { StudentDirectoryView } from "@/src/features/medico/components/StudentDirectoryView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Directorio Estudiantil | SAE Médico",
  description: "Consulta de expedientes y antecedentes médicos de estudiantes.",
};

export default function MedicoEstudiantesPage() {
  return <StudentDirectoryView />;
}
