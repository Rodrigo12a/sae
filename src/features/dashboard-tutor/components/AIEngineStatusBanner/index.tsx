/**
 * @module AIEngineStatusBanner
 * @epic EPICA-7
 * @hu HU019, HU020
 * @ux UXDT-05
 * @description Banner informativo que se muestra cuando el Motor de IA no está operando al 100%.
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiCloudOff, FiInfo } from 'react-icons/fi';
import { useAIEngineStatus } from '@/src/hooks/useAIEngineStatus';

export function AIEngineStatusBanner() {
  const { status, lastUpdate, isOk } = useAIEngineStatus();

  if (isOk) return null;

  const config = {
    degraded: {
      icon: <FiAlertTriangle style={{ color: 'var(--semaforo-amarillo)' }} />,
      bg: 'bg-[var(--semaforo-amarillo-light)]',
      border: 'border-[var(--semaforo-amarillo)]',
      text: 'El Motor de IA presenta latencia. Algunos indicadores podrían estar desactualizados.',
      color: 'text-[var(--text-primary)]'
    },
    unavailable: {
      icon: <FiCloudOff style={{ color: 'var(--semaforo-rojo)' }} />,
      bg: 'bg-[var(--semaforo-rojo-light)]',
      border: 'border-[var(--semaforo-rojo)]',
      text: 'Motor de IA fuera de línea. Se muestran datos de la última sincronización exitosa.',
      color: 'text-[var(--text-primary)]'
    }
  }[status as 'degraded' | 'unavailable'] || {
    icon: <FiInfo style={{ color: 'var(--color-info)' }} />,
    bg: 'bg-[var(--color-info-light)]',
    border: 'border-[var(--color-info)]',
    text: 'Estado del motor desconocido.',
    color: 'text-[var(--text-primary)]'
  };

  const formattedDate = lastUpdate 
    ? new Intl.DateTimeFormat('es-MX', { 
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: 'short'
      }).format(new Date(lastUpdate))
    : 'N/A';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`overflow-hidden mb-6`}
      >
        <div className={`flex items-center gap-4 p-4 rounded-xl border ${config.bg} ${config.border} shadow-sm`}>
          <div className="flex-shrink-0 text-xl">
            {config.icon}
          </div>
          <div className="flex-grow">
            <p className={`text-sm font-medium ${config.color}`}>
              {config.text}
            </p>
            {lastUpdate && (
              <p className={`text-xs mt-1 opacity-70 ${config.color}`}>
                Última actualización exitosa: <span className="font-bold">{formattedDate}</span>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
