/**
 * @module SuccessStep
 * @epic EPICA-8 Auditoría y Control de Calidad
 * @hu HU022
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiHeart } from 'react-icons/fi';

export const SuccessStep: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center space-y-8 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
      >
        <FiCheckCircle className="w-14 h-14 text-green-600 dark:text-green-500" />
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">¡Gracias por tu tiempo!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Tus respuestas nos ayudan a asegurar que recibas el mejor acompañamiento posible por parte de tus tutores.
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-center space-x-2 text-blue-600 font-medium">
          <FiHeart className="w-5 h-5 fill-current" />
          <span>SAE: Siempre contigo</span>
        </div>
      </div>
      
      <p className="text-xs text-slate-400">
        Puedes cerrar esta ventana ahora.
      </p>
    </div>
  );
};
