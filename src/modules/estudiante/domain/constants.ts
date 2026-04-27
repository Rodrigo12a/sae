import { Step, ResourceItem, ResourceCategory } from "./types";

export const STEPS: Step[] = ["welcome", "consent", "q1", "q2", "q3", "q4", "success"];
export const QUESTION_STEPS: Step[] = ["q1", "q2", "q3", "q4"];
export const TOTAL_QUESTIONS = QUESTION_STEPS.length;

export const RESOURCES_DB: Record<ResourceCategory, ResourceItem[]> = {
  economico: [
    { icon: "💰", text: "Becas disponibles — Consulta en ventanilla escolar" },
    { icon: "🍱", text: "Comedor universitario con apoyo alimentario" },
  ],
  academico: [
    { icon: "📚", text: "Tutorías académicas — Edificio A, Lunes 10–12 h" },
    { icon: "🧑‍💻", text: "Laboratorio de cómputo abierto hasta las 20 h" },
  ],
  emocional: [
    { icon: "🧠", text: "Psicología educativa — Citas en línea disponibles" },
    { icon: "🤝", text: "Grupos de apoyo estudiantil — Viernes 16 h" },
  ],
  default: [
    { icon: "📋", text: "Programa de acompañamiento integral estudiantil" },
  ],
};
