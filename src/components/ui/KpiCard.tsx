/**
 * @module KpiCard
 * @description Componente presentacional para visualización de métricas clave (KPIs).
 */

'use client';

import React from 'react';
import { FiArrowUpRight, FiArrowDownRight, FiMinus } from 'react-icons/fi';

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  trend?: 'up' | 'down';
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, sub, trend }) => {
  return (
    <div className="bg-white border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] leading-tight">
          {label}
        </h3>
        
        {trend && (
          <div className={`
            p-1.5 rounded-lg text-xs font-bold flex items-center justify-center
            ${trend === 'up' 
              ? 'bg-[var(--semaforo-rojo-trans)] text-[var(--semaforo-rojo)]' 
              : 'bg-[var(--semaforo-verde-trans)] text-[var(--semaforo-verde)]'}
          `}>
            {trend === 'up' ? <FiArrowUpRight size={14} /> : <FiArrowDownRight size={14} />}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-3xl font-black text-[var(--text-primary)] leading-none tracking-tight">
          {value}
        </p>
        
        <div className="flex items-center gap-2 mt-2">
          {!trend && <FiMinus className="text-slate-300" />}
          <p className={`text-[11px] font-bold tracking-tight ${
            trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-emerald-500' : 'text-slate-400'
          }`}>
            {sub}
          </p>
        </div>
      </div>

      {/* Decorative bar */}
      <div className={`
        h-1 w-0 group-hover:w-full transition-all duration-500 absolute bottom-0 left-0 rounded-b-2xl opacity-40
        ${trend === 'up' ? 'bg-red-500' : trend === 'down' ? 'bg-emerald-500' : 'bg-[var(--color-secondary)]'}
      `} />
    </div>
  );
};

export default KpiCard;
