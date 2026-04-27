/**
 * @component CustomizeDashboardModal
 * @description Modal que permite al administrador personalizar los widgets visibles en su dashboard.
 */
'use client';

import React from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { FiX, FiCheck, FiEye, FiEyeOff, FiRefreshCcw } from 'react-icons/fi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizeDashboardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { widgets, toggleWidget, resetWidgets } = useDashboardStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Personalizar Vista</h3>
            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mt-1">Configuración de Widgets</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {widgets.map((widget) => (
            <div 
              key={widget.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer group ${
                widget.visible 
                  ? 'bg-blue-50/30 border-blue-100 shadow-sm' 
                  : 'bg-gray-50 border-gray-200 opacity-70 hover:opacity-100'
              }`}
              onClick={() => toggleWidget(widget.id)}
            >
              <div className="flex-1">
                <h4 className={`text-sm font-black tracking-tight mb-0.5 ${widget.visible ? 'text-blue-900' : 'text-gray-600'}`}>
                  {widget.title}
                </h4>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                  {widget.description}
                </p>
              </div>

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                widget.visible 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'bg-gray-200 text-gray-400 group-hover:bg-gray-300'
              }`}>
                {widget.visible ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
          <button
            onClick={resetWidgets}
            className="flex-1 h-11 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors border border-gray-200 rounded-xl hover:bg-white"
          >
            <FiRefreshCcw size={14} />
            Restablecer
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-11 bg-[var(--brand-primary)] hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-blue-900/10 active:scale-95"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
