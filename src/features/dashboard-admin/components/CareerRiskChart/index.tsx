'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CareerRiskComparison } from '../../types';

/**
 * @module CareerRiskChart
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU016
 * @ux UXPA-04
 */

interface CareerRiskChartProps {
  data: CareerRiskComparison[];
  activeCareers?: { id: string; nombre: string; materias: string[] }[];
  onBarClick?: (careerId: string) => void;
}

// Function to map risk index to the standard traffic light colors
const getRiskColor = (riskIndex: number) => {
  if (riskIndex >= 70) return 'var(--semaforo-rojo)';
  if (riskIndex >= 40) return 'var(--semaforo-amarillo)';
  return 'var(--semaforo-verde)';
};

export const CareerRiskChart: React.FC<CareerRiskChartProps> = ({ data, activeCareers, onBarClick }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm h-[350px] flex flex-col">
      <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
        Índice de Riesgo por Carrera
      </h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
            <XAxis 
              dataKey="careerName" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              domain={[0, 100]}
            />
            <Tooltip
              cursor={{ fill: 'var(--bg-section)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const careerId = payload[0].payload.careerId;
                  const careerData = activeCareers?.find(c => c.id === careerId);
                  const riskIndex = payload[0].value;

                  return (
                    <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Programa Académico</p>
                      <p className="text-sm font-bold text-slate-800 mb-2">{payload[0].payload.careerName}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${riskIndex}%`, backgroundColor: getRiskColor(Number(riskIndex)) }}
                          />
                        </div>
                        <span className="text-xs font-black" style={{ color: getRiskColor(Number(riskIndex)) }}>{riskIndex} pts</span>
                      </div>

                      {careerData && careerData.materias && careerData.materias.length > 0 && (
                        <div className="pt-2 border-t border-slate-50">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Materias Principales</p>
                          <div className="flex flex-wrap gap-1">
                            {careerData.materias.slice(0, 3).map((m, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded text-[9px] font-bold border border-slate-100">
                                {m}
                              </span>
                            ))}
                            {careerData.materias.length > 3 && (
                              <span className="text-[9px] text-slate-400 font-bold ml-1">+{careerData.materias.length - 3} más</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="riskIndex" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={60}
              onClick={(data: any) => {
                if (onBarClick && data?.careerId) {
                  onBarClick(data.careerId);
                }
              }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getRiskColor(entry.riskIndex)} 
                  cursor={onBarClick ? 'pointer' : 'default'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
