/**
 * @component OfflineBanner
 * @epic Épica 3 — Encuesta de Contexto (Estudiante)
 * @qa QA-07
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineBannerProps {
  isVisible: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800/50"
        >
          <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
            <span className="text-xl">📡</span>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200 text-center">
              Sin conexión. Tus respuestas se están guardando localmente y se enviarán al recuperar la señal.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
