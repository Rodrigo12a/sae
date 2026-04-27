import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KPIFilters, ExportFormat } from '../../types';
import { useExportReport } from '../../hooks/useExportReport';
import { toast } from 'sonner';

/**
 * @module ExportModal
 * @epic Épica 6 - Panel Ejecutivo y Reportes
 * @hu HU018
 * @ux UXPA-07, UXPA-08, UXPA-09
 * @privacy No expone diagnósticos clínicos. El Excel descargado lo purga en el backend.
 */

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: KPIFilters;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, filters }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const { mutate: exportReport, isPending } = useExportReport();

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedFormat('pdf');
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isPending) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isPending]);

  const handleExport = () => {
    exportReport(
      { format: selectedFormat, filters },
      {
        onSuccess: (response) => {
          if (response.status === 'processing') {
            toast.success(response.message || 'El reporte se está procesando y llegará a tu correo.', { duration: 5000 });
          } else if (response.downloadUrl) {
            toast.success('El reporte está listo. Iniciando descarga...');
            // En un caso real: window.open(response.downloadUrl, '_blank');
          }
          onClose();
        },
        onError: () => {
          toast.error('Ocurrió un error al solicitar la exportación. Por favor, intenta de nuevo.');
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="export-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 id="export-modal-title" className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <span>📤</span> Exportar Reporte
                </h2>
                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  aria-label="Cerrar modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 mb-6">
                  Selecciona el formato en el que deseas exportar los datos. Se aplicarán los filtros actuales del dashboard.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* PDF Option */}
                  <label
                    className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center transition-all ${
                      selectedFormat === 'pdf'
                        ? 'border-[var(--brand-primary)] bg-blue-50/30'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="export-format"
                      value="pdf"
                      checked={selectedFormat === 'pdf'}
                      onChange={() => setSelectedFormat('pdf')}
                      className="sr-only"
                    />
                    <span className="text-3xl mb-2">📄</span>
                    <span className="font-bold text-gray-800 text-sm">Resumen Ejecutivo</span>
                    <span className="text-xs text-gray-500 mt-1">PDF con gráficas y KPIs consolidados</span>
                  </label>

                  {/* Excel Option */}
                  <label
                    className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center transition-all ${
                      selectedFormat === 'excel'
                        ? 'border-[var(--brand-primary)] bg-blue-50/30'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="export-format"
                      value="excel"
                      checked={selectedFormat === 'excel'}
                      onChange={() => setSelectedFormat('excel')}
                      className="sr-only"
                    />
                    <span className="text-3xl mb-2">📊</span>
                    <span className="font-bold text-gray-800 text-sm">Datos Crudos</span>
                    <span className="text-xs text-gray-500 mt-1">Excel sin diagnósticos clínicos</span>
                  </label>
                </div>

                {selectedFormat === 'excel' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex gap-2">
                    <span className="shrink-0 text-sm mt-0.5">ℹ️</span>
                    <p>Si el dataset supera los 10,000 registros, el reporte Excel se generará asíncronamente y se enviará por correo.</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExport}
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg font-bold text-white bg-[var(--brand-primary)] hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>Exportar</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
