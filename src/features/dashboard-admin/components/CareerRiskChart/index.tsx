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
  onBarClick?: (careerId: string) => void;
}

// Function to map risk index to the standard traffic light colors
const getRiskColor = (riskIndex: number) => {
  if (riskIndex >= 70) return 'var(--semaforo-rojo)';
  if (riskIndex >= 40) return 'var(--semaforo-amarillo)';
  return 'var(--semaforo-verde)';
};

export const CareerRiskChart: React.FC<CareerRiskChartProps> = ({ data, onBarClick }) => {
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
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', fontWeight: 'bold' }}
              itemStyle={{ color: 'var(--text-primary)' }}
              formatter={(value: any) => [`${value} pts`, 'Índice de Riesgo']}
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
