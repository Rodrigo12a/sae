/**
 * @layout MedicoLayout
 * @epic Épica 4 — Módulo Médico con Privacidad Diferencial
 * @description Layout protegido para el rol médico.
 */

import { RoleGuard } from "@/src/components/ui/RoleGuard";
import { Navbar } from "@/src/components/layout/Navbar/Navbar";

export default function MedicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard resource="student.health.clinical" action="write">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="pb-20">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
