/**
 * @page JornadaMedicoPage
 * @epic Épica 4 — Módulo Médico con Privacidad Diferencial
 * @hu HU009
 * @description Punto de entrada para la captura masiva de datos en jornada de salud.
 */

import { BulkJornadaView } from "@/src/features/medico/components/BulkJornadaView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Captura Masiva | SAE Médico",
  description: "Registro de resultados de jornada de salud estudiantil.",
};

export default function JornadaMedicoPage() {
  return <BulkJornadaView />;
}
