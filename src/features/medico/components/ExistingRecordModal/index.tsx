'use client';

import { FiAlertTriangle, FiX } from 'react-icons/fi';
import React from 'react';

/**
 * @module ExistingRecordModal
 * @epic EPICA-4
 * @hu HU009
 * @ux UXMM-03
 * @description Modal de confirmación para evitar sobreescritura accidental.
 */

interface ExistingRecordModalProps {
  isOpen: boolean;
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExistingRecordModal({ isOpen, studentName, onConfirm, onCancel }: ExistingRecordModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-amber-600">
            <FiAlertTriangle className="w-5 h-5" aria-hidden="true" />
            <h2 id="modal-title" className="font-semibold text-lg">Expediente Existente</h2>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Cerrar modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600">
            El estudiante <strong className="text-gray-900">{studentName}</strong> ya cuenta con un expediente de salud en el ciclo actual. 
            <br/><br/>
            ¿Deseas sobreescribir sus condiciones médicas con los nuevos datos capturados?
          </p>
        </div>

        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 outline-none transition-all min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 outline-none transition-all min-h-[44px]"
          >
            Sí, Sobreescribir
          </button>
        </div>
      </div>
    </div>
  );
}
