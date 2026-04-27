/**
 * @module LockIcon
 * @epic EPICA-1 Autenticación y Control de Acceso
 * @hu HU002
 * @ux UXAU-07, UXAU-08
 * @description Indicador visual de campo restringido por rol.
 *              Obligatorio en TODO campo de salud clínica visible para el Tutor.
 *              Muestra ícono 🔒 + texto "Acceso restringido" permanentemente (sin tooltip solo).
 * @accessibility aria-label obligatorio · contraste > 4.5:1
 * @qa QA-03 (RBAC visual — sin campos fantasma)
 */

import React from 'react';
import { FiLock } from 'react-icons/fi';

interface LockIconProps {
  /** Mensaje descriptivo del campo restringido (para lector de pantalla) */
  label?: string;
  /** Tamaño del componente */
  size?: 'sm' | 'md';
  /** Clase extra para posicionamiento desde el padre */
  className?: string;
}

/**
 * Indicador de campo restringido para uso en perfiles de estudiante.
 * Siempre visible — no es un toggle ni un tooltip.
 *
 * @example
 * // En perfil de estudiante (rol Tutor):
 * <LockIcon label="Información clínica — solo personal médico" />
 */
export const LockIcon: React.FC<LockIconProps> = ({
  label = 'Acceso restringido',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: { icon: 12, text: 'text-[10px]', gap: 'gap-1', padding: 'px-2 py-0.5' },
    md: { icon: 14, text: 'text-xs',     gap: 'gap-1.5', padding: 'px-2.5 py-1' },
  };

  const s = sizeStyles[size];

  return (
    <span
      role="img"
      aria-label={`Campo restringido: ${label}`}
      className={`
        inline-flex items-center ${s.gap} ${s.padding}
        bg-slate-100 border border-slate-200
        rounded-md text-slate-500 font-semibold
        select-none ${s.text} ${className}
      `}
    >
      <FiLock
        size={s.icon}
        className="text-slate-400 flex-shrink-0"
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
};
