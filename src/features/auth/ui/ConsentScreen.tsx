/**
 * @module ConsentScreen
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU001
 * @ux RC-03 Consentimiento obligatorio
 * @description Pantalla de consentimiento para el uso de datos. Se integra en el AuthLayout.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { authService } from '../services/auth.service';
import { getDashboardByRole } from '../utils/redirection';

export const ConsentScreen: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!session?.user) return;

    setIsSubmitting(true);
    const success = await authService.submitConsent(session.user.id);
    if (success) {
      router.push(getDashboardByRole(session.user.role));
      router.refresh();
    }
    setIsSubmitting(false);
  };

  const handleDecline = () => {
    alert("Para utilizar SAE es necesario aceptar los términos de privacidad para proteger los datos estudiantiles.");
  };

  return (
    <div className="w-full space-y-8 animate-fade-in" id="consent-feature-container">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Tu Privacidad es Primero</h2>
        <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
          SIAE protege la información institucional bajo estándares de privacidad diferencial (ISO 25010).
        </p>
      </header>

      <div className="space-y-6">
        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
          <h3 className="font-bold text-[var(--color-primary)] flex items-center gap-2">
            <span>🛡️</span> ¿Cómo cuidamos tus datos?
          </h3>
          <p className="text-sm text-blue-900/80 leading-relaxed font-medium">
            Analizamos variables académicas para prevenir riesgos. La información de salud es restringida y solo se traduce en etiquetas operativas para los Tutores.
          </p>
        </div>

        <div className="space-y-4 px-2">
          <div className="flex gap-4">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">Cifrado de Alto Nivel</p>
              <p className="text-xs text-[var(--text-secondary)]">Tus datos están protegidos con AES-256 de grado militar.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-xl">🔒</span>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">Uso Institucional Único</p>
              <p className="text-xs text-[var(--text-secondary)]">La información nunca se comparte con terceros externos.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-6">
        <button
          onClick={handleAccept}
          disabled={isSubmitting}
          className="w-full h-[56px] bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] active:scale-[0.99] transition-all shadow-lg shadow-blue-900/10"
        >
          {isSubmitting ? "Procesando..." : "Entiendo y acepto los términos"}
        </button>
        <button
          onClick={handleDecline}
          className="w-full h-[56px] bg-white text-[var(--text-secondary)] font-bold rounded-xl border border-[var(--border-strong)] hover:bg-gray-50 transition-all"
        >
          No por ahora
        </button>
      </div>
    </div>
  );
};
