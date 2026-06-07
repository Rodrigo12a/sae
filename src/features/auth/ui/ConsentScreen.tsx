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
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiLock, FiCheckCircle, FiInfo, FiAlertCircle } from 'react-icons/fi';

export const ConsentScreen: React.FC = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    if (!session?.user) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const success = await authService.submitConsent(session.user.id);
      if (success) {
        // Actualizar la sesión para que needsConsent sea false
        await update({ needsConsent: false });
        
        // Pequeña pausa para asegurar que el estado se propaga
        setTimeout(() => {
          router.push(getDashboardByRole(session.user.role));
          router.refresh();
        }, 100);
      } else {
        setError("No pudimos registrar tu consentimiento. Por favor, intenta de nuevo.");
      }
    } catch (err) {
      setError("Ocurrió un problema de conexión. Inténtalo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = () => {
    setError("Para utilizar SAE es obligatorio aceptar los términos de privacidad.");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto space-y-8" 
      id="consent-feature-container"
    >
      <header className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[var(--color-primary)] shadow-sm">
          <FiShield size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Tu Privacidad es Primero</h2>
          <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
            SIAE protege la información institucional bajo estándares de <span className="text-[var(--color-primary)] font-bold">privacidad diferencial</span>.
          </p>
        </div>
      </header>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
        >
          <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </motion.div>
      )}

      <div className="space-y-6">
        <div className="p-5 bg-blue-50/40 rounded-2xl border border-blue-100/50 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-blue-100">
            <FiInfo size={40} />
          </div>
          <h3 className="font-bold text-blue-900 flex items-center gap-2 relative">
             ¿Cómo cuidamos tus datos?
          </h3>
          <p className="text-sm text-blue-800/80 leading-relaxed font-medium relative">
            Analizamos variables académicas para prevenir riesgos. La información de salud es restringida y solo se traduce en etiquetas operativas para los Tutores.
          </p>
        </div>

        <div className="space-y-5 px-1">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
              <FiCheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">Cifrado de Alto Nivel</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Tus datos están protegidos con AES-256 de grado militar en reposo y tránsito.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
              <FiLock size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">Uso Institucional Único</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">La información nunca se comparte con terceros externos ni fines comerciales.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <button
          onClick={handleAccept}
          disabled={isSubmitting}
          className="w-full h-[56px] bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[var(--color-primary-hover)] active:scale-[0.98] transition-all shadow-lg shadow-red-900/10 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            "Entiendo y acepto los términos"
          )}
        </button>
        <button
          onClick={handleDecline}
          disabled={isSubmitting}
          className="w-full h-[56px] bg-white text-[var(--text-secondary)] font-bold rounded-xl border border-[var(--border-strong)] hover:bg-gray-50 transition-all active:scale-[0.98]"
        >
          No por ahora
        </button>
      </div>

      <footer className="text-center">
        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
          SIAE · Sistema Inteligente de Acompañamiento Estudiantil
        </p>
      </footer>
    </motion.div>
  );
};
